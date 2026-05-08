import Link from "next/link";
import type { Metadata } from "next";
import { getAllTags } from "@/lib/posts";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tagi",
  description: "Wszystkie tagi na blogu run-seba.pl.",
};

export default async function TagsIndexPage() {
  const tags = await getAllTags();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-4xl font-bold tracking-tight">Tagi</h1>
      <p className="mt-2 text-muted-foreground">
        Posortowane według liczby wpisów.
      </p>

      {tags.length === 0 ? (
        <p className="mt-8 text-muted-foreground">Jeszcze brak tagów.</p>
      ) : (
        <ul className="mt-8 flex flex-wrap gap-2">
          {tags.map(({ tag, count }) => (
            <li key={tag}>
              <Link
                href={`/tagi/${tag}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-foreground/20"
              >
                #{tag}
                <span className="text-xs text-muted-foreground">{count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
