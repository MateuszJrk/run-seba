import type { Metadata } from "next";
import Link from "next/link";
import { fetchRecentRuns } from "@/lib/strava";
import { RunCard } from "@/components/run-card";
import { Pagination } from "@/components/pagination";

const PAGE_SIZE = 20;
const MAX_RUNS = 100;

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Biegi",
  description:
    "Wszystkie ostatnie biegi @run_seba ze Stravy — dystans, czas, tempo, mapa.",
};

function hrefFor(page: number) {
  return page === 1 ? "/biegi" : `/biegi/page/${page}`;
}

function plural(n: number): string {
  if (n === 1) return "bieg";
  if (n >= 2 && n <= 4) return "biegi";
  return "biegów";
}

export default async function BiegiIndexPage() {
  const { activities, isMock } = await fetchRecentRuns(MAX_RUNS);
  const total = activities.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const items = activities.slice(0, PAGE_SIZE);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Strava
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          Wszystkie biegi
        </h1>
        <p className="mt-2 text-muted-foreground">
          {isMock ? (
            "Podgląd — Strava jeszcze niepodpięta."
          ) : (
            <>
              {total} {plural(total)} ze Stravy{" "}
              <Link
                href="https://www.strava.com/athletes/run_seba"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
              >
                @run_seba
              </Link>
              {totalPages > 1 ? `, strona 1 z ${totalPages}` : ""}.
            </>
          )}
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => (
          <li key={a.id}>
            <RunCard activity={a} />
          </li>
        ))}
      </ul>

      <Pagination page={1} totalPages={totalPages} hrefFor={hrefFor} />
    </div>
  );
}
