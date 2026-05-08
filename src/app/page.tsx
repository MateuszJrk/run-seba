import Link from "next/link";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { PostCard } from "@/components/post-card";

export const dynamic = "force-static";

export default async function HomePage() {
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="mb-12 sm:mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Bieganie. Trasy. Cierpienie ze szczyptą radości.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Blog Seby o tym, co dzieje się między startem a metą — od porannych
          truchtów po starty w maratonach.
        </p>
      </section>

      {tags.length > 0 ? (
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Tagi
          </h2>
          <ul className="flex flex-wrap gap-2">
            {tags.map(({ tag, count }) => (
              <li key={tag}>
                <Link
                  href={`/tagi/${tag}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm transition-colors hover:border-foreground/20"
                >
                  #{tag}
                  <span className="text-xs text-muted-foreground">
                    {count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Najnowsze wpisy
        </h2>
        {posts.length === 0 ? (
          <p className="text-muted-foreground">
            Jeszcze nic tu nie ma — pierwszy bieg zaraz, pierwszy wpis tuż po nim.
          </p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <li key={post.slug}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
