import type { ElevationPoint } from "@/lib/strava";

type Props = {
  points: ElevationPoint[];
  className?: string;
};

export function ElevationProfile({ points, className = "" }: Props) {
  if (points.length < 2) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-border bg-muted text-sm text-muted-foreground">
        Brak danych o przewyższeniach.
      </div>
    );
  }

  const w = 800;
  const h = 200;
  const padding = { top: 20, right: 16, bottom: 28, left: 44 };

  const distances = points.map((p) => p.distance);
  const altitudes = points.map((p) => p.altitude);
  const minAlt = Math.min(...altitudes);
  const maxAlt = Math.max(...altitudes);
  const altRange = maxAlt - minAlt || 1;
  const maxDist = Math.max(...distances) || 1;

  const xScale = (d: number) =>
    padding.left + (d / maxDist) * (w - padding.left - padding.right);
  const yScale = (a: number) =>
    h -
    padding.bottom -
    ((a - minAlt) / altRange) * (h - padding.top - padding.bottom);

  const linePath = points
    .map((p, i) => {
      const x = xScale(p.distance);
      const y = yScale(p.altitude);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(" ");

  const areaPath = `${linePath} L ${xScale(maxDist)} ${h - padding.bottom} L ${xScale(0)} ${h - padding.bottom} Z`;

  // X axis ticks: co 2 km
  const tickEveryM = maxDist > 20000 ? 5000 : maxDist > 10000 ? 2000 : 1000;
  const xTicks: number[] = [];
  for (let d = 0; d <= maxDist; d += tickEveryM) xTicks.push(d);

  // Y axis ticks: 4 podziałki
  const yTicks = [0, 0.33, 0.66, 1].map((p) => minAlt + p * altRange);

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={`w-full ${className}`}
      role="img"
      aria-label="Profil przewyższenia trasy"
    >
      <defs>
        <linearGradient id="elev-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#21316a" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#21316a" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Y grid + labels */}
      {yTicks.map((alt, i) => {
        const y = yScale(alt);
        return (
          <g key={i}>
            <line
              x1={padding.left}
              x2={w - padding.right}
              y1={y}
              y2={y}
              stroke="currentColor"
              strokeOpacity="0.1"
            />
            <text
              x={padding.left - 8}
              y={y + 4}
              textAnchor="end"
              className="fill-muted-foreground text-[10px]"
              style={{ fontSize: 11 }}
            >
              {Math.round(alt)} m
            </text>
          </g>
        );
      })}

      {/* X axis labels */}
      {xTicks.map((d, i) => {
        const x = xScale(d);
        return (
          <text
            key={i}
            x={x}
            y={h - 10}
            textAnchor="middle"
            className="fill-muted-foreground"
            style={{ fontSize: 11 }}
          >
            {(d / 1000).toFixed(0)} km
          </text>
        );
      })}

      {/* Filled area */}
      <path d={areaPath} fill="url(#elev-fill)" />

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke="#21316a"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
