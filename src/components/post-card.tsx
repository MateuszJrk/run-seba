import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

const DATE_FORMATTER = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-foreground/20">
      <Link href={`/blog/${post.slug}`} className="block">
        <header className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <time dateTime={post.date}>
              {DATE_FORMATTER.format(new Date(post.date))}
            </time>
            <span aria-hidden>·</span>
            <span>{post.readingTimeMin} min czytania</span>
          </div>
          <h2 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-foreground">
            {post.title}
          </h2>
        </header>
        <p className="mt-3 text-sm text-muted-foreground">
          {post.description}
        </p>
      </Link>
      {post.tags?.length ? (
        <ul className="mt-4 flex flex-wrap gap-2">
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
    </article>
  );
}
