import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/posts";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://run-seba.pl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);
  const now = new Date();

  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/o-mnie`, lastModified: now },
    { url: `${SITE_URL}/kontakt`, lastModified: now },
    { url: `${SITE_URL}/kalkulator`, lastModified: now },
    { url: `${SITE_URL}/tagi`, lastModified: now },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
    })),
    ...tags.map(({ tag }) => ({
      url: `${SITE_URL}/tagi/${tag}`,
      lastModified: now,
    })),
  ];
}
