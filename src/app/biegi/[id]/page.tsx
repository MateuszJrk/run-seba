import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchActivityById, fetchRecentRuns } from "@/lib/strava";
import { formatRaceTime } from "@/lib/time";
import { RouteMap } from "@/components/route-map";
import { ElevationProfile } from "@/components/elevation-profile";
import { SplitsTable } from "@/components/splits-table";
import { StatCard } from "@/components/stat-card";
import { WeatherWidget } from "@/components/weather-widget";
import { ShareButtons } from "@/components/share-buttons";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://run-seba.pl";

export const dynamicParams = true;
export const revalidate = 1800; // 30 min

const DATE_FORMATTER = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
});

export async function generateStaticParams() {
  const { activities } = await fetchRecentRuns(20);
  return activities.map((a) => ({ id: String(a.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { activity } = await fetchActivityById(id);
  if (!activity) return {};
  const km = (activity.distance / 1000).toFixed(1);
  return {
    title: `${activity.name} — ${km} km`,
    description: `Aktywność z ${DATE_FORMATTER.format(new Date(activity.startDate))}: ${km} km, czas ${formatRaceTime(activity.movingTime)}.`,
  };
}

function formatPace(metersPerSecond: number): string {
  if (metersPerSecond <= 0) return "—";
  const secPerKm = 1000 / metersPerSecond;
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatDistance(meters: number): string {
  return (meters / 1000).toFixed(2).replace(".", ",") + " km";
}

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { activity, isMock } = await fetchActivityById(id);
  if (!activity) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Link
            href="/"
            className="transition-colors hover:text-foreground"
          >
            ← Wszystkie biegi
          </Link>
          <span aria-hidden>·</span>
          <span>{activity.sportType}</span>
          {isMock ? (
            <>
              <span aria-hidden>·</span>
              <span className="rounded bg-muted px-1.5 py-0.5 font-medium uppercase tracking-wider text-muted-foreground">
                Mock data
              </span>
            </>
          ) : null}
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {activity.name}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          <time dateTime={activity.startDate} suppressHydrationWarning>
            {DATE_FORMATTER.format(new Date(activity.startDate))}
          </time>
        </p>
      </header>

      <RouteMap
        coordinates={activity.coordinates}
        velocityStream={activity.velocityStream}
        className="aspect-[16/9] w-full sm:aspect-[2/1]"
      />

      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Dystans"
          value={formatDistance(activity.distance)}
          accent
        />
        <StatCard
          label="Czas"
          value={formatRaceTime(activity.movingTime)}
        />
        <StatCard
          label="Tempo"
          value={
            <>
              {formatPace(activity.averageSpeed)}
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                /km
              </span>
            </>
          }
        />
        <StatCard
          label="Przewyższenie"
          value={
            <>
              {Math.round(activity.totalElevationGain)}
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                m
              </span>
            </>
          }
        />
        {activity.averageHeartrate ? (
          <StatCard
            label="HR średnie"
            value={
              <>
                {Math.round(activity.averageHeartrate)}
                <span className="ml-1 text-sm font-normal text-muted-foreground">
                  bpm
                </span>
              </>
            }
            hint={
              activity.maxHeartrate
                ? `max ${Math.round(activity.maxHeartrate)}`
                : undefined
            }
          />
        ) : null}
        {activity.averageCadence ? (
          <StatCard
            label="Kadencja"
            value={
              <>
                {Math.round(activity.averageCadence * 2)}
                <span className="ml-1 text-sm font-normal text-muted-foreground">
                  spm
                </span>
              </>
            }
          />
        ) : null}
        {activity.calories ? (
          <StatCard
            label="Kalorie"
            value={
              <>
                {activity.calories}
                <span className="ml-1 text-sm font-normal text-muted-foreground">
                  kcal
                </span>
              </>
            }
          />
        ) : null}
        {activity.kudosCount !== undefined ? (
          <StatCard
            label="Kudosów"
            value={activity.kudosCount}
            hint={
              activity.prCount
                ? `${activity.prCount} PR${activity.prCount > 1 ? "-y" : ""}`
                : undefined
            }
          />
        ) : null}
      </section>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <WeatherWidget
          coordinates={activity.coordinates}
          isoDateTime={activity.startDate}
        />
        {activity.description ? (
          <section className="rounded-xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Notatka
            </p>
            {activity.description}
          </section>
        ) : null}
      </div>

      <section className="mt-12">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Profil przewyższenia
        </h2>
        <div className="rounded-xl border border-border bg-card p-4 text-foreground/70">
          <ElevationProfile points={activity.elevation} />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Splity na km
        </h2>
        <SplitsTable splits={activity.splits} />
      </section>

      <ShareButtons
        url={`${SITE_URL}/biegi/${activity.id}`}
        title={`${activity.name} — ${(activity.distance / 1000).toFixed(1)} km`}
      />

      <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-sm">
        <Link
          href="/"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Wszystkie biegi
        </Link>
        {!isMock ? (
          <Link
            href={activity.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-running/40"
          >
            Zobacz na Stravie →
          </Link>
        ) : null}
      </footer>
    </div>
  );
}
