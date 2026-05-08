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

export async function fetchRecentRuns(
  limit = 5,
): Promise<{ activities: StravaActivity[]; isMock: boolean }> {
  const token = await getAccessToken();
  if (!token) {
    return { activities: getMockActivities(limit), isMock: true };
  }

  try {
    const res = await fetch(`${ACTIVITIES_URL}?per_page=${limit * 2}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 1800 }, // 30 min cache
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

// ---------- Mock data ----------
// Encoded polylines z prawdziwych okolic (kawałek tras w Polsce),
// żeby kształty wyglądały realistycznie. Wymieniamy na real po OAuth.

const MOCK_POLYLINES = [
  "_p~iF~ps|U_ulLnnqC_mqNvxq`@",
  "ehruHcdqaC_aBnh@_aB`o@_aB`r@",
  "uxxgIa~i{B}qBfrAmlBsvAelB_zA",
];

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
