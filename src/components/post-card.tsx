"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { PostMeta } from "@/lib/posts";

const DATE_FORMATTER = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-foreground/20"
    >
      {post.cover ? (
        <Link
          href={`/blog/${post.slug}`}
          className="relative block aspect-[16/9] overflow-hidden"
        >
          <Image
            src={post.cover}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      ) : null}

      <div className="flex flex-1 flex-col p-6">
        <Link href={`/blog/${post.slug}`} className="block">
          <header className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <time dateTime={post.date}>
                {DATE_FORMATTER.format(new Date(post.date))}
              </time>
              <span aria-hidden>·</span>
              <span>{post.readingTimeMin} min czytania</span>
            </div>
            <h2 className="text-xl font-semibold tracking-tight">
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
      </div>
    </motion.article>
  );
}
