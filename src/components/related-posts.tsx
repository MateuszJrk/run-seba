import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

const DATE_FORMATTER = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function RelatedPosts({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-20 border-t border-border pt-10">
      <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Może Cię też zainteresować
      </h2>
      <ul className="grid gap-4 sm:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group block overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-running/40"
            >
              {post.cover ? (
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={post.cover}
                    alt={post.coverAlt ?? post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ) : null}
              <div className="p-4">
                <p className="text-xs text-muted-foreground">
                  {DATE_FORMATTER.format(new Date(post.date))}
                </p>
                <h3 className="mt-1 text-base font-semibold tracking-tight">
                  {post.title}
                </h3>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
