import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPostsPaginated,
  getTotalPostsPages,
} from "@/lib/posts";
import { PostsList } from "@/components/posts-list";
import { Pagination } from "@/components/pagination";

export const dynamicParams = false;
export const revalidate = 60;

function hrefFor(page: number) {
  return page === 1 ? "/blog" : `/blog/page/${page}`;
}

export async function generateStaticParams() {
  const total = await getTotalPostsPages();
  // Generate /blog/page/2, /blog/page/3, ... (page 1 is at /blog)
  const params: Array<{ n: string }> = [];
  for (let i = 2; i <= total; i++) {
    params.push({ n: String(i) });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ n: string }>;
}): Promise<Metadata> {
  const { n } = await params;
  const page = Number.parseInt(n, 10);
  return {
    title: `Blog — strona ${page}`,
    description: `Wpisy z bloga run-seba.pl, strona ${page}.`,
  };
}

export default async function BlogPaginatedPage({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n } = await params;
  const requested = Number.parseInt(n, 10);
  if (Number.isNaN(requested) || requested < 2) notFound();

  const { posts, page, totalPages, totalPosts } =
    await getPostsPaginated(requested);

  if (page !== requested || posts.length === 0) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Blog
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          Wszystkie wpisy
        </h1>
        <p className="mt-2 text-muted-foreground">
          {totalPosts}{" "}
          {totalPosts === 1
            ? "wpis"
            : totalPosts < 5
              ? "wpisy"
              : "wpisów"}
          , strona {page} z {totalPages}.
        </p>
      </header>

      <PostsList posts={posts} />

      <Pagination page={page} totalPages={totalPages} hrefFor={hrefFor} />
    </div>
  );
}
