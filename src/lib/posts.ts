import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import {
  ALL_POSTS_QUERY,
  POST_BY_SLUG_QUERY,
} from "@/sanity/lib/queries";
import type { SanityPost } from "@/sanity/lib/types";
import type { PortableTextBlock } from "next-sanity";

export type PostSource = "mdx" | "sanity";

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  cover?: string;
  coverAlt?: string;
  coverLqip?: string;
  readingTimeMin: number;
  source: PostSource;
};

export type PostFull = PostMeta &
  (
    | { source: "mdx" }
    | { source: "sanity"; body: PortableTextBlock[] }
  );

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function plainTextFromBlocks(blocks: PortableTextBlock[] | undefined): string {
  if (!blocks) return "";
  return blocks
    .map((block) => {
      if (block._type !== "block" || !("children" in block)) return "";
      const children = block.children as Array<{ text?: string }> | undefined;
      return children?.map((c) => c.text ?? "").join("") ?? "";
    })
    .join(" ");
}

// ---------- MDX ----------

async function listMdxFiles(): Promise<string[]> {
  try {
    const entries = await readdir(POSTS_DIR);
    return entries.filter((f) => f.endsWith(".mdx"));
  } catch {
    return [];
  }
}

async function getMdxPost(slug: string): Promise<PostMeta | null> {
  try {
    const raw = await readFile(path.join(POSTS_DIR, `${slug}.mdx`), "utf8");
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title ?? slug,
      description: data.description ?? "",
      date: data.date ?? new Date().toISOString(),
      tags: Array.isArray(data.tags) ? data.tags : [],
      cover: typeof data.cover === "string" ? data.cover : undefined,
      readingTimeMin: estimateReadingTime(content),
      source: "mdx",
    };
  } catch {
    return null;
  }
}

async function getAllMdxPosts(): Promise<PostMeta[]> {
  const files = await listMdxFiles();
  const posts = await Promise.all(
    files.map((f) => getMdxPost(f.replace(/\.mdx$/, ""))),
  );
  return posts.filter((p): p is PostMeta => p !== null);
}

// ---------- Sanity ----------

function normalizeSanityPost(p: SanityPost): PostMeta {
  const cover = p.cover?.asset
    ? urlForImage(p.cover).width(1600).quality(80).url()
    : undefined;
  return {
    slug: p.slug,
    title: p.title,
    description: p.description,
    date: p.date,
    tags: p.tags ?? [],
    cover,
    coverAlt: p.cover?.alt,
    coverLqip: p.cover?.asset?.metadata?.lqip,
    readingTimeMin: estimateReadingTime(plainTextFromBlocks(p.body)),
    source: "sanity",
  };
}

async function getAllSanityPosts(): Promise<PostMeta[]> {
  try {
    const posts = await client.fetch<SanityPost[]>(
      ALL_POSTS_QUERY,
      {},
      { next: { revalidate: 60, tags: ["post"] } },
    );
    return posts.map(normalizeSanityPost);
  } catch (error) {
    console.warn("Sanity fetch failed (returning empty):", error);
    return [];
  }
}

async function getSanityPost(slug: string): Promise<SanityPost | null> {
  try {
    return await client.fetch<SanityPost | null>(
      POST_BY_SLUG_QUERY,
      { slug },
      { next: { revalidate: 60, tags: ["post", `post:${slug}`] } },
    );
  } catch (error) {
    console.warn(`Sanity fetch for slug "${slug}" failed:`, error);
    return null;
  }
}

// ---------- Public API ----------

export async function getAllPosts(): Promise<PostMeta[]> {
  const [mdx, sanity] = await Promise.all([
    getAllMdxPosts(),
    getAllSanityPosts(),
  ]);
  return [...mdx, ...sanity].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getAllSlugs(): Promise<
  Array<{ slug: string; source: PostSource }>
> {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug, source: p.source }));
}

export async function getPostMeta(slug: string): Promise<PostMeta | null> {
  const mdx = await getMdxPost(slug);
  if (mdx) return mdx;
  const sanity = await getSanityPost(slug);
  return sanity ? normalizeSanityPost(sanity) : null;
}

export async function getPostFull(slug: string): Promise<PostFull | null> {
  const mdx = await getMdxPost(slug);
  if (mdx) return mdx as PostFull;
  const sanity = await getSanityPost(slug);
  if (!sanity) return null;
  return {
    ...normalizeSanityPost(sanity),
    body: sanity.body ?? [],
  } as PostFull;
}

export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await getAllPosts();
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getPostsByTag(tag: string): Promise<PostMeta[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.tags.includes(tag));
}

export async function getRelatedPosts(
  slug: string,
  limit = 3,
): Promise<PostMeta[]> {
  const all = await getAllPosts();
  const current = all.find((p) => p.slug === slug);
  if (!current || current.tags.length === 0) return [];

  const candidates = all
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      score: p.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.post.date < b.post.date ? 1 : -1;
    });

  return candidates.slice(0, limit).map(({ post }) => post);
}
