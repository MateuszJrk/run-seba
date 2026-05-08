import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { PostsList } from "@/components/posts-list";

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map(({ tag }) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag}`,
    description: `Wpisy oznaczone tagiem #${tag} na blogu run-seba.pl.`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);
  if (posts.length === 0) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10">
        <p className="text-sm text-muted-foreground">Tag</p>
        <h1 className="mt-1 text-4xl font-bold tracking-tight">#{tag}</h1>
        <p className="mt-2 text-muted-foreground">
          {posts.length}{" "}
          {posts.length === 1 ? "wpis" : posts.length < 5 ? "wpisy" : "wpisów"}
        </p>
      </header>

      <PostsList posts={posts} />

      <div className="mt-12">
        <Link
          href="/tagi"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Wszystkie tagi
        </Link>
      </div>
    </div>
  );
}
