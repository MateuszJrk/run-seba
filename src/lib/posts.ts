import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  tags: string[];
  cover?: string;
};

export type PostMeta = PostFrontmatter & {
  slug: string;
  readingTimeMin: number;
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

async function listPostFiles(): Promise<string[]> {
  const entries = await readdir(POSTS_DIR);
  return entries.filter((f) => f.endsWith(".mdx"));
}

function estimateReadingTime(raw: string): number {
  const words = raw.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export async function getPostMeta(slug: string): Promise<PostMeta | null> {
  try {
    const raw = await readFile(path.join(POSTS_DIR, `${slug}.mdx`), "utf8");
    const { data, content } = matter(raw);
    return {
      slug,
      readingTimeMin: estimateReadingTime(content),
      ...(data as PostFrontmatter),
    };
  } catch {
    return null;
  }
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const files = await listPostFiles();
  const posts = await Promise.all(
    files.map((f) => getPostMeta(f.replace(/\.mdx$/, ""))),
  );
  return posts
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getAllSlugs(): Promise<string[]> {
  const files = await listPostFiles();
  return files.map((f) => f.replace(/\.mdx$/, ""));
}

export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await getAllPosts();
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getPostsByTag(tag: string): Promise<PostMeta[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.tags?.includes(tag));
}
