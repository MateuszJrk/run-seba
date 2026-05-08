"use client";

import { motion, type Variants } from "motion/react";
import { useMemo, useState } from "react";
import {
  calculateVdot,
  pacePerKm,
  pacePerMile,
  predictRaceTime,
  speedKmh,
  STANDARD_DISTANCES,
  type DistanceKey,
} from "@/lib/running";
import { formatPace, formatRaceTime } from "@/lib/time";

const DEFAULT_DISTANCE: DistanceKey = "hm";

type SebaTime = {
  hours: number;
  minutes: number;
  seconds: number;
  hint: string;
};

const SEBA_PBS: Record<DistanceKey, SebaTime> = {
  "5k": {
    hours: 0,
    minutes: 17,
    seconds: 39,
    hint: "PB Seby na 5 km: 17:39 (2022).",
  },
  "10k": {
    hours: 0,
    minutes: 36,
    seconds: 59,
    hint: "PB Seby na 10 km: 36:59 (2022).",
  },
  hm: {
    hours: 1,
    minutes: 22,
    seconds: 52,
    hint: "PB Seby na półmaratonie: 1:22:52 (2020).",
  },
  marathon: {
    hours: 2,
    minutes: 52,
    seconds: 46,
    hint: "Seba nie ma jeszcze PB w maratonie — wstawiony szacunek z PB w HM (Riegel).",
  },
};

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

function clampInt(value: string, max: number): number {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n) || n < 0) return 0;
  return Math.min(n, max);
}

export function PaceCalculator() {
  const [distanceKey, setDistanceKey] =
    useState<DistanceKey>(DEFAULT_DISTANCE);
  const [hours, setHours] = useState<number>(
    SEBA_PBS[DEFAULT_DISTANCE].hours,
  );
  const [minutes, setMinutes] = useState<number>(
    SEBA_PBS[DEFAULT_DISTANCE].minutes,
  );
  const [seconds, setSeconds] = useState<number>(
    SEBA_PBS[DEFAULT_DISTANCE].seconds,
  );

  function handleDistanceChange(key: DistanceKey) {
    setDistanceKey(key);
    const pb = SEBA_PBS[key];
    setHours(pb.hours);
    setMinutes(pb.minutes);
    setSeconds(pb.seconds);
  }

  const distance = useMemo(
    () =>
      STANDARD_DISTANCES.find((d) => d.key === distanceKey) ??
      STANDARD_DISTANCES[2],
    [distanceKey],
  );

  const totalSec = hours * 3600 + minutes * 60 + seconds;
  const validInput = totalSec > 0 && distance.meters > 0;

  const paceKm = pacePerKm(distance.meters, totalSec);
  const paceMile = pacePerMile(distance.meters, totalSec);
  const speed = speedKmh(distance.meters, totalSec);
  const vdot = calculateVdot(distance.meters, totalSec);

  const predictions = STANDARD_DISTANCES.filter(
    (d) => d.key !== distance.key,
  ).map((d) => ({
    ...d,
    predictedSec: predictRaceTime(totalSec, distance.meters, d.meters),
  }));

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
      <form
        className="space-y-6"
        onSubmit={(e) => e.preventDefault()}
        aria-label="Kalkulator tempa biegowego"
      >
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Dystans
          </legend>
          <div className="flex flex-wrap gap-2">
            {STANDARD_DISTANCES.map((d) => {
              const active = d.key === distanceKey;
              return (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => handleDistanceChange(d.key)}
                  aria-pressed={active}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "border-running bg-running text-running-foreground"
                      : "border-border bg-card hover:border-running/40"
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Czas
          </legend>
          <div className="grid grid-cols-3 gap-3">
            <TimeInput
              label="Godziny"
              value={hours}
              onChange={(v) => setHours(clampInt(v, 99))}
              max={99}
            />
            <TimeInput
              label="Minuty"
              value={minutes}
              onChange={(v) => setMinutes(clampInt(v, 59))}
              max={59}
            />
            <TimeInput
              label="Sekundy"
              value={seconds}
              onChange={(v) => setSeconds(clampInt(v, 59))}
              max={59}
            />
          </div>
        </fieldset>

        <p className="text-xs text-muted-foreground">
          {SEBA_PBS[distanceKey].hint} Zmień wartości, aby przeliczyć dla
          siebie.
        </p>
      </form>

      <motion.div
        key={`${distanceKey}-${totalSec}`}
        variants={containerVariants}
        initial="hidden"
        animate={validInput ? "show" : "hidden"}
        className="space-y-6"
      >
        <motion.div variants={itemVariants}>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Twoje tempo
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <ResultCard
              label="min / km"
              value={formatPace(paceKm)}
              hint="pace"
            />
            <ResultCard
              label="min / mila"
              value={formatPace(paceMile)}
              hint="pace"
            />
            <ResultCard
              label="km / h"
              value={speed.toFixed(2)}
              hint="prędkość"
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Przy tym tempie zrobisz...
          </h2>
          <ul className="space-y-2">
            {predictions.map((p) => (
              <li
                key={p.key}
                className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
              >
                <span className="text-sm text-muted-foreground">
                  {p.label}
                </span>
                <span className="font-mono text-lg font-semibold tabular-nums">
                  {formatRaceTime(p.predictedSec)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">
            Predykcja oparta na formule Riegela (wykładnik zmęczenia 1.06).
            Dobrze działa w zakresie 5 km – maraton, dla bardzo krótkich i
            ultra dystansów odbiega od rzeczywistości.
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="flex items-end justify-between rounded-xl border border-border bg-card p-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                VDOT
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Wskaźnik wytrzymałości tlenowej wg Jacka Danielsa.
              </p>
            </div>
            <p className="font-mono text-4xl font-bold tabular-nums">
              {vdot.toFixed(1)}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function TimeInput({
  label,
  value,
  onChange,
  max,
}: {
  label: string;
  value: number;
  onChange: (raw: string) => void;
  max: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-muted-foreground">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-2xl font-semibold tabular-nums focus:border-foreground/40 focus:outline-none"
      />
    </label>
  );
}

function ResultCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-mono text-2xl font-semibold tabular-nums">
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
