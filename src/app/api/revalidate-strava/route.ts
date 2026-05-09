import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

// Ręczna rewalidacja cache'u Stravy. Trafia tu Vercel Cron (vercel.json),
// można też wywołać ręcznie: GET /api/revalidate-strava?secret=...
//
// Auth:
// - Vercel Cron: automatyczny `Authorization: Bearer $CRON_SECRET`
// - Manual: ?secret=... lub Authorization: Bearer ...
// Akceptujemy CRON_SECRET (default Vercela) albo STRAVA_REVALIDATE_SECRET.
export async function GET(req: NextRequest) {
  const secret =
    process.env.STRAVA_REVALIDATE_SECRET ?? process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "Missing STRAVA_REVALIDATE_SECRET / CRON_SECRET" },
      { status: 500 },
    );
  }

  const provided =
    req.nextUrl.searchParams.get("secret") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (provided !== secret) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  // Webhook/cron → natychmiastowe wygaszenie cache (Next 16 wymaga 2 argumentu).
  revalidateTag("strava", { expire: 0 });
  return NextResponse.json({ ok: true, revalidated: "strava", at: Date.now() });
}
