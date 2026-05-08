import Link from "next/link";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { PostsList } from "@/components/posts-list";
import { Hero } from "@/components/hero";

export const revalidate = 60;

export default async function HomePage() {
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);

  return (
    <>
      <Hero />
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
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
          <PostsList posts={posts} />
        </section>
      </div>
    </>
  );
}
