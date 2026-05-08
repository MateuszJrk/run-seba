export const STANDARD_DISTANCES = [
  { key: "5k", label: "5 km", meters: 5000 },
  { key: "10k", label: "10 km", meters: 10000 },
  { key: "hm", label: "Półmaraton", meters: 21097.5 },
  { key: "marathon", label: "Maraton", meters: 42195 },
] as const;

export type DistanceKey = (typeof STANDARD_DISTANCES)[number]["key"];

const KM_PER_MILE = 1.609344;

/**
 * Riegel formula — predict T2 from T1 across distances.
 * T2 = T1 * (D2/D1)^1.06
 * Działa dobrze dla 5km–maraton (znacznie odjazd dla bardzo krótkich/długich).
 */
export function predictRaceTime(
  knownTimeSec: number,
  knownDistanceM: number,
  targetDistanceM: number,
  fatigue = 1.06,
): number {
  return knownTimeSec * Math.pow(targetDistanceM / knownDistanceM, fatigue);
}

/**
 * VDOT (Daniels) — przybliżenie z formul Petera Riegela / Jacka Danielsa.
 * Wraca number (mL/kg/min equivalent). Użyteczne porównawczo.
 */
export function calculateVdot(distanceM: number, timeSec: number): number {
  const timeMin = timeSec / 60;
  if (timeMin <= 0 || distanceM <= 0) return 0;

  const velocity = distanceM / timeMin; // m/min
  const vo2 = -4.6 + 0.182258 * velocity + 0.000104 * velocity * velocity;
  const percentVO2max =
    0.8 +
    0.1894393 * Math.exp(-0.012778 * timeMin) +
    0.2989558 * Math.exp(-0.1932605 * timeMin);

  return vo2 / percentVO2max;
}

/**
 * Pace na kilometr w sekundach.
 */
export function pacePerKm(distanceM: number, timeSec: number): number {
  if (distanceM <= 0) return 0;
  return timeSec / (distanceM / 1000);
}

/**
 * Pace na milę w sekundach.
 */
export function pacePerMile(distanceM: number, timeSec: number): number {
  return pacePerKm(distanceM, timeSec) * KM_PER_MILE;
}

export function speedKmh(distanceM: number, timeSec: number): number {
  if (timeSec <= 0) return 0;
  return distanceM / 1000 / (timeSec / 3600);
}

// ---------- Daniels VDOT training paces ----------

export type IntensityZone = "E" | "M" | "T" | "I" | "R";

export const ZONE_DEFINITIONS: Record<
  IntensityZone,
  {
    name: string;
    description: string;
    purpose: string;
    /** % of vVO2max — Daniels canonical ranges */
    percentVO2max: [number, number];
  }
> = {
  E: {
    name: "Easy",
    description: "Spokojny rozbieg / regeneracja",
    purpose: "Aerobic base, regeneracja, wytrzymałość",
    percentVO2max: [0.59, 0.74],
  },
  M: {
    name: "Marathon",
    description: "Tempo maratońskie",
    purpose: "Specyficzny trening pod maraton",
    percentVO2max: [0.75, 0.84],
  },
  T: {
    name: "Threshold",
    description: "Tempo progowe (LT)",
    purpose: "Próg mleczanowy, comfortable hard 20-40 min",
    percentVO2max: [0.86, 0.88],
  },
  I: {
    name: "Intervals",
    description: "Interwały VO2max",
    purpose: "Wzmocnienie VO2max, 3-5 min powtórzenia",
    percentVO2max: [0.95, 1.0],
  },
  R: {
    name: "Repetition",
    description: "Powtórzenia szybkościowe",
    purpose: "Ekonomia biegu, 200-600m",
    percentVO2max: [1.05, 1.1],
  },
};

/**
 * vVO2max — velocity at VO2max in m/min, na bazie VDOT (Daniels formula).
 */
export function vVO2max(vdot: number): number {
  return 29.54 + 5.000663 * vdot - 0.007546 * vdot * vdot;
}

/**
 * Tempo (sec/km) dla wybranej strefy treningowej i danego VDOT.
 * Zwraca zakres [faster, slower].
 */
export function paceForZone(
  vdot: number,
  zone: IntensityZone,
): { fasterSec: number; slowerSec: number } {
  if (vdot <= 0) return { fasterSec: 0, slowerSec: 0 };
  const v = vVO2max(vdot); // m/min
  const [pMin, pMax] = ZONE_DEFINITIONS[zone].percentVO2max;
  // velocity = v × percentage (m/min); pace (sec/km) = 60 × 1000 / velocity
  const fasterVelocity = v * pMax;
  const slowerVelocity = v * pMin;
  return {
    fasterSec: 60_000 / fasterVelocity,
    slowerSec: 60_000 / slowerVelocity,
  };
}
