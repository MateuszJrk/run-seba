import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllSlugs,
  getPostFull,
  getPostMeta,
  getRelatedPosts,
} from "@/lib/posts";
import { PortableTextBody } from "@/components/portable-text";
import { ReadingProgress } from "@/components/reading-progress";
import { RelatedPosts } from "@/components/related-posts";
import { ArticleJsonLd } from "@/components/article-json-ld";

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostMeta(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
      images: post.cover ? [{ url: post.cover }] : undefined,
    },
  };
}

const DATE_FORMATTER = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, related] = await Promise.all([
    getPostFull(slug),
    getRelatedPosts(slug),
  ]);
  if (!post) notFound();

  return (
    <>
      <ReadingProgress />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      {post.cover ? (
        <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl border border-border">
          <Image
            src={post.cover}
            alt={post.coverAlt ?? post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            placeholder={post.coverLqip ? "blur" : undefined}
            blurDataURL={post.coverLqip}
            className="object-cover"
          />
        </div>
      ) : null}

      <header className="mb-10 border-b border-border pb-8">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <time dateTime={post.date}>
            {DATE_FORMATTER.format(new Date(post.date))}
          </time>
          <span aria-hidden>·</span>
          <span>{post.readingTimeMin} min czytania</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {post.title}
        </h1>
        {post.description ? (
          <p className="mt-4 text-lg text-muted-foreground">
            {post.description}
          </p>
        ) : null}
        {post.tags?.length ? (
          <ul className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li key={tag}>
                <Link
                  href={`/tagi/${tag}`}
                  className="inline-block rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-foreground hover:text-background"
                >
                  #{tag}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      <div className="prose-running">
        {post.source === "mdx" ? (
          <MdxBody slug={slug} />
        ) : (
          <PortableTextBody value={post.body} />
        )}
      </div>

      <ArticleJsonLd post={post} />

      <RelatedPosts posts={related} />

      <footer className="mt-16 border-t border-border pt-8">
        <Link
          href="/"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Wszystkie wpisy
        </Link>
      </footer>
      </article>
    </>
  );
}

async function MdxBody({ slug }: { slug: string }) {
  const { default: Post } = await import(`@/../content/posts/${slug}.mdx`);
  return <Post />;
}
