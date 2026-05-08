import Link from "next/link";
import { getPostsPaginated } from "@/lib/posts";
import { fetchYearStats } from "@/lib/strava";
import { PostsList } from "@/components/posts-list";
import { Hero } from "@/components/hero";
import { StravaFeed } from "@/components/strava-feed";
import { YearStatsBlock } from "@/components/year-stats";

export const revalidate = 60;

export default async function HomePage() {
  const [postsPage, yearStats] = await Promise.all([
    getPostsPaginated(1, 4),
    fetchYearStats(),
  ]);
  const posts = postsPage.posts;
  const hasMore = postsPage.totalPosts > posts.length;

  return (
    <>
      <Hero />
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <section>
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Najnowsze wpisy
            </h2>
            {hasMore ? (
              <Link
                href="/blog"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Wszystkie wpisy →
              </Link>
            ) : null}
          </div>
          <PostsList posts={posts} />
          {hasMore ? (
            <div className="mt-8 flex justify-center sm:hidden">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:border-running/40"
              >
                Zobacz wszystkie wpisy ({postsPage.totalPosts})
              </Link>
            </div>
          ) : null}
        </section>

        <YearStatsBlock stats={yearStats} />

        <StravaFeed />
      </div>
    </>
  );
}
