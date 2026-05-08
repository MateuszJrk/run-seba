export function parseTimeToSeconds(time: string): {
  seconds: number;
  hasHours: boolean;
} {
  const parts = time.split(":").map((p) => Number(p));
  if (parts.length === 3) {
    return {
      seconds: parts[0] * 3600 + parts[1] * 60 + parts[2],
      hasHours: true,
    };
  }
  if (parts.length === 2) {
    return { seconds: parts[0] * 60 + parts[1], hasHours: false };
  }
  return { seconds: parts[0] ?? 0, hasHours: false };
}

export function formatSecondsAsTime(
  seconds: number,
  hasHours: boolean,
): string {
  const total = Math.max(0, Math.floor(seconds));
  if (hasHours) {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Format seconds as race time, automatycznie wybiera HH:MM:SS lub MM:SS
 * w zależności czy przekracza godzinę.
 */
export function formatRaceTime(seconds: number): string {
  return formatSecondsAsTime(seconds, seconds >= 3600);
}

export function formatPace(secondsPerKm: number): string {
  return formatSecondsAsTime(secondsPerKm, false);
}
