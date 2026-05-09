import polyline from "@mapbox/polyline";

export type StravaActivity = {
  id: number;
  name: string;
  distance: number; // meters
  movingTime: number; // seconds
  startDate: string; // ISO
  averageSpeed: number; // m/s
  totalElevationGain: number; // meters
  sportType: string;
  /** Decoded polyline as [lat, lng] pairs. Empty if no map data. */
  coordinates: Array<[number, number]>;
  /** Strava activity URL */
  url: string;
};

export type ElevationPoint = {
  /** Distance from start in meters */
  distance: number;
  /** Altitude in meters above sea level */
  altitude: number;
};

export type SplitKm = {
  km: number; // 1, 2, 3...
  paceSecPerKm: number;
  elevationDelta: number; // meters gained/lost on this km
  averageHr?: number;
};

export type StravaActivityFull = StravaActivity & {
  averageHeartrate?: number;
  maxHeartrate?: number;
  averageCadence?: number;
  calories?: number;
  description?: string;
  elevation: ElevationPoint[];
  splits: SplitKm[];
  /** Speed in m/s, jeden punkt per coordinate */
  velocityStream?: number[];
  kudosCount?: number;
  prCount?: number;
};

type StravaApiActivity = {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  start_date_local: string;
  average_speed: number;
  total_elevation_gain: number;
  sport_type: string;
  map?: { summary_polyline?: string | null };
};

const TOKEN_URL = "https://www.strava.com/api/v3/oauth/token";
const ACTIVITIES_URL = "https://www.strava.com/api/v3/athlete/activities";
const RUN_SPORT_TYPES = new Set([
  "Run",
  "TrailRun",
  "VirtualRun",
]);

// Cache strategy:
// - Activities list: 1 day (revalidacja przez cron lub ręczny tag)
// - Per-activity szczegóły + streams: 7 dni (historia immutable po publikacji)
// - Wszystkie fetches taggowane "strava" → jeden revalidateTag czyści cache.
// - per_page ujednolicony do PER_PAGE → ten sam URL = ten sam klucz cache
//   niezależnie od tego czy strona prosi o 5, 20 czy 200 ostatnich biegów.
const STRAVA_LIST_REVALIDATE_SEC = 86_400;
const STRAVA_ACTIVITY_REVALIDATE_SEC = 7 * 86_400;
const STRAVA_TAG = "strava";
const PER_PAGE = 100;

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;
  const refreshToken = process.env.STRAVA_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) return null;

  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now() + 60_000) {
    return cachedAccessToken.token;
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    console.warn("Strava token refresh failed:", res.status);
    return null;
  }

  const data = (await res.json()) as {
    access_token: string;
    expires_at: number; // unix seconds
  };

  cachedAccessToken = {
    token: data.access_token,
    expiresAt: data.expires_at * 1000,
  };

  return data.access_token;
}

function normalize(activity: StravaApiActivity): StravaActivity {
  const summary = activity.map?.summary_polyline ?? "";
  const coordinates = summary
    ? (polyline.decode(summary) as Array<[number, number]>)
    : [];

  return {
    id: activity.id,
    name: activity.name,
    distance: activity.distance,
    movingTime: activity.moving_time,
    startDate: activity.start_date_local,
    averageSpeed: activity.average_speed,
    totalElevationGain: activity.total_elevation_gain,
    sportType: activity.sport_type,
    coordinates,
    url: `https://www.strava.com/activities/${activity.id}`,
  };
}

export type YearStats = {
  year: number;
  totalDistanceM: number;
  totalRuns: number;
  totalMovingSec: number;
  totalElevationM: number;
  longestRunM: number;
  avgPaceSecPerKm: number;
  isMock: boolean;
};

export async function fetchYearStats(
  year: number = new Date().getFullYear(),
  limit = 200,
): Promise<YearStats> {
  const { activities, isMock } = await fetchRecentRuns(limit);
  const yearRuns = activities.filter(
    (a) => new Date(a.startDate).getFullYear() === year,
  );

  const totalDistanceM = yearRuns.reduce((s, a) => s + a.distance, 0);
  const totalMovingSec = yearRuns.reduce((s, a) => s + a.movingTime, 0);
  const totalElevationM = yearRuns.reduce(
    (s, a) => s + a.totalElevationGain,
    0,
  );
  const longestRunM =
    yearRuns.length > 0 ? Math.max(...yearRuns.map((a) => a.distance)) : 0;
  const avgPaceSecPerKm =
    totalDistanceM > 0 ? totalMovingSec / (totalDistanceM / 1000) : 0;

  return {
    year,
    totalDistanceM,
    totalRuns: yearRuns.length,
    totalMovingSec,
    totalElevationM,
    longestRunM,
    avgPaceSecPerKm,
    isMock,
  };
}

export async function fetchRecentRuns(
  limit = 5,
): Promise<{ activities: StravaActivity[]; isMock: boolean }> {
  const token = await getAccessToken();
  if (!token) {
    return { activities: getMockActivities(limit), isMock: true };
  }

  try {
    const res = await fetch(`${ACTIVITIES_URL}?per_page=${PER_PAGE}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: STRAVA_LIST_REVALIDATE_SEC, tags: [STRAVA_TAG] },
    });

    if (!res.ok) {
      console.warn("Strava activities fetch failed:", res.status);
      return { activities: getMockActivities(limit), isMock: true };
    }

    const data = (await res.json()) as StravaApiActivity[];
    const runs = data
      .filter((a) => RUN_SPORT_TYPES.has(a.sport_type))
      .slice(0, limit)
      .map(normalize);

    return { activities: runs, isMock: false };
  } catch (error) {
    console.warn("Strava fetch error:", error);
    return { activities: getMockActivities(limit), isMock: true };
  }
}

export async function fetchActivityById(
  id: number | string,
): Promise<{ activity: StravaActivityFull | null; isMock: boolean }> {
  const numericId =
    typeof id === "string" ? Number.parseInt(id, 10) : id;
  if (Number.isNaN(numericId)) return { activity: null, isMock: true };

  const token = await getAccessToken();
  if (!token) {
    const mock = getMockActivities(10).find((a) => a.id === numericId);
    if (!mock) return { activity: null, isMock: true };
    return { activity: enrichWithMockDetails(mock), isMock: true };
  }

  try {
    const activityTag = `strava:activity:${numericId}`;
    const [activityRes, streamsRes] = await Promise.all([
      fetch(
        `https://www.strava.com/api/v3/activities/${numericId}?include_all_efforts=false`,
        {
          headers: { Authorization: `Bearer ${token}` },
          next: {
            revalidate: STRAVA_ACTIVITY_REVALIDATE_SEC,
            tags: [STRAVA_TAG, activityTag],
          },
        },
      ),
      fetch(
        `https://www.strava.com/api/v3/activities/${numericId}/streams?keys=distance,altitude,heartrate,velocity_smooth&key_by_type=true`,
        {
          headers: { Authorization: `Bearer ${token}` },
          next: {
            revalidate: STRAVA_ACTIVITY_REVALIDATE_SEC,
            tags: [STRAVA_TAG, activityTag],
          },
        },
      ),
    ]);

    if (!activityRes.ok) {
      console.warn("Strava activity fetch failed:", activityRes.status);
      return { activity: null, isMock: false };
    }

    const apiActivity = (await activityRes.json()) as StravaApiActivity & {
      average_heartrate?: number;
      max_heartrate?: number;
      average_cadence?: number;
      calories?: number;
      description?: string;
      kudos_count?: number;
      pr_count?: number;
      splits_metric?: Array<{
        distance: number;
        elapsed_time: number;
        moving_time: number;
        elevation_difference: number;
        average_heartrate?: number;
        split: number;
      }>;
    };

    type Streams = {
      distance?: { data: number[] };
      altitude?: { data: number[] };
      heartrate?: { data: number[] };
      velocity_smooth?: { data: number[] };
    };
    const streams: Streams = streamsRes.ok ? await streamsRes.json() : {};

    const elevation: ElevationPoint[] =
      streams.distance && streams.altitude
        ? streams.distance.data.map((d, i) => ({
            distance: d,
            altitude: streams.altitude!.data[i],
          }))
        : [];

    const velocityStream = streams.velocity_smooth?.data;

    const splits: SplitKm[] =
      apiActivity.splits_metric?.map((s) => ({
        km: s.split,
        paceSecPerKm: s.moving_time,
        elevationDelta: s.elevation_difference,
        averageHr: s.average_heartrate,
      })) ?? [];

    const base = normalize(apiActivity);
    return {
      activity: {
        ...base,
        averageHeartrate: apiActivity.average_heartrate,
        maxHeartrate: apiActivity.max_heartrate,
        averageCadence: apiActivity.average_cadence,
        calories: apiActivity.calories,
        description: apiActivity.description,
        kudosCount: apiActivity.kudos_count,
        prCount: apiActivity.pr_count,
        elevation,
        splits,
        velocityStream,
      },
      isMock: false,
    };
  } catch (error) {
    console.warn("Strava activity fetch error:", error);
    return { activity: null, isMock: false };
  }
}

// ---------- Mock data ----------
// Encoded polylines z prawdziwych okolic (kawałek tras w Polsce),
// żeby kształty wyglądały realistycznie. Wymieniamy na real po OAuth.

const MOCK_POLYLINES = [
  "_p~iF~ps|U_ulLnnqC_mqNvxq`@",
  "ehruHcdqaC_aBnh@_aB`o@_aB`r@",
  "uxxgIa~i{B}qBfrAmlBsvAelB_zA",
];

function generateMockElevation(
  totalDistance: number,
  baseAltitude: number,
  totalGain: number,
): ElevationPoint[] {
  // Generuje rozsądny profil: 100 punktów, sinusoidalna fala + drobne oscylacje
  const points: ElevationPoint[] = [];
  const samples = 100;
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const distance = t * totalDistance;
    // Główna fala: 2 wzgórza
    const wave = Math.sin(t * Math.PI * 2.2) * 0.6 + Math.sin(t * Math.PI * 5) * 0.2;
    // Lekki tilt do góry (gain over distance)
    const trend = t * 0.4;
    const altitude = baseAltitude + (wave + trend) * (totalGain / 1.4);
    points.push({ distance, altitude });
  }
  return points;
}

function generateMockSplits(
  distanceM: number,
  totalSec: number,
): SplitKm[] {
  const km = Math.floor(distanceM / 1000);
  const baseSec = totalSec / (distanceM / 1000);
  const splits: SplitKm[] = [];
  for (let i = 1; i <= km; i++) {
    // Drobna wariacja ±5%, lekki negative split (drugie połowa szybsza)
    const progressBoost = i > km / 2 ? -baseSec * 0.02 : baseSec * 0.01;
    const noise = (Math.sin(i * 1.7) + Math.cos(i * 0.9)) * baseSec * 0.025;
    splits.push({
      km: i,
      paceSecPerKm: Math.round(baseSec + progressBoost + noise),
      elevationDelta: Math.round((Math.sin(i * 0.7) + Math.cos(i * 0.4)) * 8),
      averageHr: Math.round(155 + Math.sin(i * 0.5) * 8),
    });
  }
  return splits;
}

function generateMockVelocity(
  pointCount: number,
  averageSpeed: number,
): number[] {
  // Simulate negative split with noise: drugie połowa nieco szybsza, lekkie wahania
  return Array.from({ length: pointCount }, (_, i) => {
    const t = i / Math.max(pointCount - 1, 1);
    const trend = (t - 0.5) * 0.15; // ±7.5% trend (faster at end)
    const noise =
      Math.sin(i * 0.7) * 0.08 +
      Math.sin(i * 0.23) * 0.06 +
      Math.cos(i * 1.1) * 0.04;
    return averageSpeed * (1 + trend + noise);
  });
}

function enrichWithMockDetails(base: StravaActivity): StravaActivityFull {
  return {
    ...base,
    averageHeartrate: 158,
    maxHeartrate: 178,
    averageCadence: 88,
    calories: Math.round(base.distance * 0.07),
    description:
      "Świetna trasa, idealne warunki. Ten odcinek na 9 km kilometrze był najtrudniejszy — pod górkę, ale dało radę.",
    kudosCount: 24,
    prCount: 1,
    elevation: generateMockElevation(
      base.distance,
      180,
      base.totalElevationGain,
    ),
    splits: generateMockSplits(base.distance, base.movingTime),
    velocityStream: generateMockVelocity(
      base.coordinates.length,
      base.averageSpeed,
    ),
  };
}

function getMockActivities(limit: number): StravaActivity[] {
  const now = Date.now();
  const all: StravaActivity[] = [
    {
      id: 1,
      name: "Niedzielny długi w lesie",
      distance: 16200,
      movingTime: 4114,
      startDate: new Date(now - 1 * 86400_000).toISOString(),
      averageSpeed: 3.94,
      totalElevationGain: 124,
      sportType: "TrailRun",
      coordinates: polyline.decode(MOCK_POLYLINES[0]) as Array<
        [number, number]
      >,
      url: "https://strava.com",
    },
    {
      id: 2,
      name: "Interwały 5×1000",
      distance: 8500,
      movingTime: 2052,
      startDate: new Date(now - 3 * 86400_000).toISOString(),
      averageSpeed: 4.14,
      totalElevationGain: 22,
      sportType: "Run",
      coordinates: polyline.decode(MOCK_POLYLINES[1]) as Array<
        [number, number]
      >,
      url: "https://strava.com",
    },
    {
      id: 3,
      name: "Spokojny rozbieg",
      distance: 6000,
      movingTime: 1800,
      startDate: new Date(now - 5 * 86400_000).toISOString(),
      averageSpeed: 3.33,
      totalElevationGain: 38,
      sportType: "Run",
      coordinates: polyline.decode(MOCK_POLYLINES[2]) as Array<
        [number, number]
      >,
      url: "https://strava.com",
    },
  ];
  return all.slice(0, limit);
}
