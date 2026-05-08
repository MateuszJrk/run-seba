import type { ReactNode } from "react";

type Props = {
  label: string;
  value: ReactNode;
  hint?: string;
  accent?: boolean;
};

export function StatCard({ label, value, hint, accent }: Props) {
  return (
    <div
      className={`rounded-xl border p-4 ${accent ? "border-running/40 bg-running-soft" : "border-border bg-card"}`}
    >
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-1 font-mono text-2xl font-bold tabular-nums ${accent ? "text-running" : "text-foreground"}`}
      >
        {value}
      </p>
      {hint ? (
        <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
