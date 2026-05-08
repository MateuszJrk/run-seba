import type { SplitKm } from "@/lib/strava";
import { formatPace } from "@/lib/time";

type Props = {
  splits: SplitKm[];
};

export function SplitsTable({ splits }: Props) {
  if (splits.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Brak danych o splitach na km.
      </p>
    );
  }

  const paces = splits.map((s) => s.paceSecPerKm);
  const fastest = Math.min(...paces);
  const slowest = Math.max(...paces);
  const range = slowest - fastest || 1;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr className="text-xs uppercase tracking-wider text-muted-foreground">
            <th className="w-12 px-4 py-2 text-left font-medium">km</th>
            <th className="w-20 px-4 py-2 text-left font-medium">tempo</th>
            <th className="px-4 py-2 text-left font-medium">
              względem najszybszego
            </th>
            <th className="hidden w-16 px-4 py-2 text-right font-medium sm:table-cell">
              Δm
            </th>
            <th className="hidden w-14 px-4 py-2 text-right font-medium sm:table-cell">
              hr
            </th>
          </tr>
        </thead>
        <tbody>
          {splits.map((s) => {
            const isFastest = s.paceSecPerKm === fastest;
            const isSlowest = s.paceSecPerKm === slowest;
            // Bar: proporcjonalna długość gdzie 100% = slowest, 30% = fastest
            const barWidth =
              30 + ((s.paceSecPerKm - fastest) / range) * 70;

            return (
              <tr
                key={s.km}
                className="border-t border-border/60 transition-colors hover:bg-muted/30"
              >
                <td className="px-4 py-2.5 font-mono tabular-nums text-muted-foreground">
                  {s.km}
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className={`font-mono tabular-nums ${
                      isFastest
                        ? "font-bold text-running"
                        : isSlowest
                          ? "text-muted-foreground"
                          : "text-foreground"
                    }`}
                  >
                    {formatPace(s.paceSecPerKm)}
                  </span>
                  {isFastest ? (
                    <span className="ml-2 inline-block rounded bg-running-soft px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-running">
                      best
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-2.5">
                  <div className="h-2 w-full max-w-md overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${
                        isFastest ? "bg-running" : "bg-foreground/40"
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </td>
                <td className="hidden px-4 py-2.5 text-right font-mono tabular-nums text-xs text-muted-foreground sm:table-cell">
                  {s.elevationDelta > 0 ? `+${s.elevationDelta}` : s.elevationDelta}
                </td>
                <td className="hidden px-4 py-2.5 text-right font-mono tabular-nums text-xs text-muted-foreground sm:table-cell">
                  {s.averageHr ?? "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
