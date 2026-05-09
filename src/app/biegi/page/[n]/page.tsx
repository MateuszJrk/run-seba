import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchRecentRuns } from "@/lib/strava";
import { RunCard } from "@/components/run-card";
import { Pagination } from "@/components/pagination";

const PAGE_SIZE = 20;
const MAX_RUNS = 100;

export const dynamicParams = false;
export const revalidate = 3600;

function hrefFor(page: number) {
  return page === 1 ? "/biegi" : `/biegi/page/${page}`;
}

function plural(n: number): string {
  if (n === 1) return "bieg";
  if (n >= 2 && n <= 4) return "biegi";
  return "biegów";
}

export async function generateStaticParams() {
  const { activities } = await fetchRecentRuns(MAX_RUNS);
  const totalPages = Math.max(1, Math.ceil(activities.length / PAGE_SIZE));
  const params: Array<{ n: string }> = [];
  for (let i = 2; i <= totalPages; i++) {
    params.push({ n: String(i) });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ n: string }>;
}): Promise<Metadata> {
  const { n } = await params;
  const page = Number.parseInt(n, 10);
  return {
    title: `Biegi — strona ${page}`,
    description: `Lista biegów @run_seba ze Stravy, strona ${page}.`,
  };
}

export default async function BiegiPaginatedPage({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n } = await params;
  const requested = Number.parseInt(n, 10);
  if (Number.isNaN(requested) || requested < 2) notFound();

  const { activities, isMock } = await fetchRecentRuns(MAX_RUNS);
  const total = activities.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  if (requested > totalPages) notFound();

  const start = (requested - 1) * PAGE_SIZE;
  const items = activities.slice(start, start + PAGE_SIZE);
  if (items.length === 0) notFound();

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
          {total} {plural(total)} ze Stravy{" "}
          <Link
            href="https://www.strava.com/athletes/run_seba"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 hover:underline"
          >
            @run_seba
          </Link>
          , strona {requested} z {totalPages}
          {isMock ? " (podgląd)" : ""}.
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => (
          <li key={a.id}>
            <RunCard activity={a} />
          </li>
        ))}
      </ul>

      <Pagination
        page={requested}
        totalPages={totalPages}
        hrefFor={hrefFor}
      />
    </div>
  );
}
