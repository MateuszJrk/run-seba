import { ImageResponse } from "next/og";
import { OgTemplate, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";
import { fetchActivityById } from "@/lib/strava";
import { formatRaceTime } from "@/lib/time";

export const alt = "Aktywność — run-seba.pl";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const DATE_FORMATTER = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatPace(metersPerSecond: number): string {
  if (metersPerSecond <= 0) return "—";
  const secPerKm = 1000 / metersPerSecond;
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatDistance(meters: number): string {
  return (meters / 1000).toFixed(1).replace(".", ",") + " km";
}

export default async function ActivityOG({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { activity } = await fetchActivityById(id);

  if (!activity) {
    return new ImageResponse(
      <OgTemplate title="Aktywność" description="run-seba.pl" />,
      size,
    );
  }

  const pace = formatPace(activity.averageSpeed) + " /km";
  const time = formatRaceTime(activity.movingTime);
  const distance = formatDistance(activity.distance);
  const elevation = `${Math.round(activity.totalElevationGain)} m ↑`;

  return new ImageResponse(
    (
      <OgTemplate
        eyebrow={activity.sportType.toUpperCase()}
        title={activity.name}
        description={`${distance} · ${time} · ${pace} · ${elevation}`}
        badges={[distance, time, pace]}
        footerRight={DATE_FORMATTER.format(new Date(activity.startDate))}
      />
    ),
    size,
  );
}
