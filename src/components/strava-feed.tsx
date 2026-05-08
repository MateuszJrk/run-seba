import Link from "next/link";
import { fetchRecentRuns, type StravaActivity } from "@/lib/strava";
import { formatRaceTime } from "@/lib/time";

const DATE_FORMATTER = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "long",
});

function formatPace(metersPerSecond: number): string {
  if (metersPerSecond <= 0) return "—";
  const secondsPerKm = 1000 / metersPerSecond;
  const m = Math.floor(secondsPerKm / 60);
  const s = Math.round(secondsPerKm % 60);
  return `${m}:${String(s).padStart(2, "0")}/km`;
}

function formatDistance(meters: number): string {
  return (meters / 1000).toFixed(1).replace(".", ",") + " km";
}

function PolylinePreview({ activity }: { activity: StravaActivity }) {
  const coords = activity.coordinates;
  if (coords.length < 2) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
        brak mapy
      </div>
    );
  }

  // Normalizacja do 0..100 z paddingiem
  const lats = coords.map(([lat]) => lat);
  const lngs = coords.map(([, lng]) => lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const dLat = maxLat - minLat || 0.0001;
  const dLng = maxLng - minLng || 0.0001;
  const padding = 6;
  const w = 100;
  const h = 60;

  const points = coords
    .map(([lat, lng]) => {
      const x =
        padding + ((lng - minLng) / dLng) * (w - 2 * padding);
      // y is inverted (north = top)
      const y =
        padding + ((maxLat - lat) / dLat) * (h - 2 * padding);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className="size-full text-running"
      aria-hidden
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
          href="https://www.strava.com/athletes/run_seba"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
        >
          Zobacz wszystkie →
        </Link>
      </header>

      <ul className="grid gap-3 sm:grid-cols-3">
        {activities.map((a) => (
          <li key={a.id}>
            <Link
              href={`/biegi/${a.id}`}
              className="group block overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-running/40"
            >
              <div className="aspect-[5/3] bg-running-soft p-3">
                <PolylinePreview activity={a} />
              </div>
              <div className="space-y-2 p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <time dateTime={a.startDate}>
                    {DATE_FORMATTER.format(new Date(a.startDate))}
                  </time>
                  <span aria-hidden>·</span>
                  <span>{a.sportType}</span>
                </div>
                <p className="line-clamp-1 font-semibold tracking-tight">
                  {a.name}
                </p>
                <div className="flex items-center gap-3 font-mono text-xs tabular-nums text-muted-foreground">
                  <span className="text-foreground">
                    {formatDistance(a.distance)}
                  </span>
                  <span>{formatRaceTime(a.movingTime)}</span>
                  <span>{formatPace(a.averageSpeed)}</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {isMock ? (
        <p className="mt-4 text-xs text-muted-foreground">
          To są przykładowe dane. Po podpięciu konta Strava na tej liście
          pojawiają się Twoje rzeczywiste biegi (auto-odświeżanie co 30 min).
        </p>
      ) : null}
    </section>
  );
}
