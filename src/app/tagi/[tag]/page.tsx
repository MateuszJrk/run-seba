import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { PostCard } from "@/components/post-card";

export const dynamicParams = false;

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

      <ul className="grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <li key={post.slug}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>

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
