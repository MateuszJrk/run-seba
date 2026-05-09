import Link from "next/link";
import { type StravaActivity } from "@/lib/strava";
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
      const x = padding + ((lng - minLng) / dLng) * (w - 2 * padding);
      const y = padding + ((maxLat - lat) / dLat) * (h - 2 * padding);
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

export function RunCard({ activity }: { activity: StravaActivity }) {
  return (
    <Link
      href={`/biegi/${activity.id}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-running/40"
    >
      <div className="aspect-[5/3] bg-running-soft p-3">
        <PolylinePreview activity={activity} />
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <time dateTime={activity.startDate} suppressHydrationWarning>
            {DATE_FORMATTER.format(new Date(activity.startDate))}
          </time>
          <span aria-hidden>·</span>
          <span>{activity.sportType}</span>
        </div>
        <p className="line-clamp-1 font-semibold tracking-tight">
          {activity.name}
        </p>
        <div className="flex items-center gap-3 font-mono text-xs tabular-nums text-muted-foreground">
          <span className="text-foreground">
            {formatDistance(activity.distance)}
          </span>
          <span>{formatRaceTime(activity.movingTime)}</span>
          <span>{formatPace(activity.averageSpeed)}</span>
        </div>
      </div>
    </Link>
  );
}
