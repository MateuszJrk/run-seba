import type { Metadata } from "next";
import { getPostsPaginated } from "@/lib/posts";
import { PostsList } from "@/components/posts-list";
import { Pagination } from "@/components/pagination";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description: "Wszystkie wpisy na run-seba.pl — relacje z biegów, treningi, sprzęt.",
};

function hrefFor(page: number) {
  return page === 1 ? "/blog" : `/blog/page/${page}`;
}

export default async function BlogIndexPage() {
  const { posts, page, totalPages, totalPosts } = await getPostsPaginated(1);

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
          {totalPages > 1 ? `, strona ${page} z ${totalPages}` : ""}.
        </p>
      </header>

      <PostsList posts={posts} />

      <Pagination page={page} totalPages={totalPages} hrefFor={hrefFor} />
    </div>
  );
}
