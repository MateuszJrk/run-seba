import Link from "next/link";
import { fetchRecentRuns } from "@/lib/strava";
import { RunCard } from "@/components/run-card";

export async function StravaFeed() {
  const { activities, isMock } = await fetchRecentRuns(3);
  if (activities.length === 0) return null;

  return (
    <section className="mt-16">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Ostatnie biegi
          </h2>
          <p className="mt-1 text-lg font-semibold tracking-tight">
            {isMock ? (
              <span className="text-muted-foreground">
                Podgląd — Strava jeszcze niepodpięta
              </span>
            ) : (
              <>
                ze Stravy{" "}
                <span className="text-muted-foreground">@run_seba</span>
              </>
            )}
          </p>
        </div>
        <Link
          href="/biegi"
          className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
        >
          Wszystkie biegi →
        </Link>
      </header>

      <ul className="grid gap-3 sm:grid-cols-3">
        {activities.map((a) => (
          <li key={a.id}>
            <RunCard activity={a} />
          </li>
        ))}
      </ul>

      {isMock ? (
        <p className="mt-4 text-xs text-muted-foreground">
          To są przykładowe dane. Po podpięciu konta Strava na tej liście
          pojawiają się Twoje rzeczywiste biegi (auto-odświeżanie co 30 min).
        </p>
      ) : (
        <div className="mt-6 flex justify-center sm:hidden">
          <Link
            href="/biegi"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:border-running/40"
          >
            Wszystkie biegi
          </Link>
        </div>
      )}
    </section>
  );
}
