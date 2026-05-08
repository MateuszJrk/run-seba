"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
  type Variants,
} from "motion/react";
import { useEffect, useRef } from "react";
import type { YearStats } from "@/lib/strava";
import { formatPace, formatRaceTime } from "@/lib/time";

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

function CountUp({
  to,
  format,
  play,
}: {
  to: number;
  format: (v: number) => string;
  play: boolean;
}) {
  const value = useMotionValue(0);
  const display = useTransform(value, format);

  useEffect(() => {
    if (!play) return;
    const controls = animate(value, to, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [play, to, value]);

  return <motion.span>{display}</motion.span>;
}

export function YearStatsBlock({ stats }: { stats: YearStats }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  if (stats.totalRuns === 0) return null;

  const totalKm = stats.totalDistanceM / 1000;

  return (
    <section ref={ref} className="mt-16">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {stats.year} w liczbach
          </h2>
          <p className="mt-1 text-lg font-semibold tracking-tight">
            {stats.isMock ? (
              <span className="text-muted-foreground">
                Podgląd — Strava jeszcze niepodpięta
              </span>
            ) : (
              "Co dał ten rok"
            )}
          </p>
        </div>
      </header>

      <motion.ul
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        <motion.li
          variants={itemVariants}
          className="rounded-xl border border-running/40 bg-running-soft p-4"
        >
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Łącznie
          </p>
          <p className="mt-1 font-mono text-3xl font-bold tabular-nums text-running">
            <CountUp
              to={totalKm}
              format={(v) => v.toFixed(0)}
              play={inView}
            />
            <span className="ml-1 text-base font-medium text-muted-foreground">
              km
            </span>
          </p>
        </motion.li>

        <motion.li
          variants={itemVariants}
          className="rounded-xl border border-border bg-card p-4"
        >
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Biegów
          </p>
          <p className="mt-1 font-mono text-3xl font-bold tabular-nums">
            <CountUp
              to={stats.totalRuns}
              format={(v) => Math.floor(v).toString()}
              play={inView}
            />
          </p>
        </motion.li>

        <motion.li
          variants={itemVariants}
          className="rounded-xl border border-border bg-card p-4"
        >
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Średnie tempo
          </p>
          <p className="mt-1 font-mono text-3xl font-bold tabular-nums">
            {formatPace(stats.avgPaceSecPerKm)}
            <span className="ml-1 text-base font-medium text-muted-foreground">
              /km
            </span>
          </p>
        </motion.li>

        <motion.li
          variants={itemVariants}
          className="rounded-xl border border-border bg-card p-4"
        >
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Wzniesienia
          </p>
          <p className="mt-1 font-mono text-3xl font-bold tabular-nums">
            <CountUp
              to={stats.totalElevationM}
              format={(v) => Math.floor(v).toLocaleString("pl-PL")}
              play={inView}
            />
            <span className="ml-1 text-base font-medium text-muted-foreground">
              m
            </span>
          </p>
        </motion.li>
      </motion.ul>

      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
        <span>
          Łączny czas:{" "}
          <span className="font-mono tabular-nums text-foreground">
            {formatRaceTime(stats.totalMovingSec)}
          </span>
        </span>
        {stats.longestRunM > 0 ? (
          <span>
            Najdłuższy bieg:{" "}
            <span className="font-mono tabular-nums text-foreground">
              {(stats.longestRunM / 1000).toFixed(1)} km
            </span>
          </span>
        ) : null}
      </div>
    </section>
  );
}
