import { getAllPosts, getAllTags } from "@/lib/posts";
import { fetchYearStats } from "@/lib/strava";
import { PostsList } from "@/components/posts-list";
import { Hero } from "@/components/hero";
import { StravaFeed } from "@/components/strava-feed";
import { YearStatsBlock } from "@/components/year-stats";
import { TagCloud } from "@/components/tag-cloud";

export const revalidate = 60;

export default async function HomePage() {
  const [posts, tags, yearStats] = await Promise.all([
    getAllPosts(),
    getAllTags(),
    fetchYearStats(),
  ]);

  return (
    <>
      <Hero />
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        {tags.length > 0 ? (
          <section className="mb-10">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Tagi
            </h2>
            <TagCloud tags={tags} />
          </section>
        ) : null}

        <section>
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Najnowsze wpisy
          </h2>
          <PostsList posts={posts} />
        </section>

        <YearStatsBlock stats={yearStats} />

        <StravaFeed />
      </div>
    </>
  );
}
