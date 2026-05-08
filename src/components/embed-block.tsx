type EmbedKind = "youtube" | "strava" | "vimeo" | "unknown";

type ParsedEmbed = {
  kind: EmbedKind;
  embedUrl: string;
  aspectClass: string;
};

function parseYouTube(u: URL): string | null {
  // youtu.be/VIDEO_ID
  if (u.hostname === "youtu.be") {
    return u.pathname.slice(1).split("/")[0] || null;
  }
  // youtube.com/watch?v=VIDEO_ID
  if (u.hostname.endsWith("youtube.com")) {
    const v = u.searchParams.get("v");
    if (v) return v;
    // youtube.com/embed/VIDEO_ID lub /shorts/VIDEO_ID
    const m = u.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/);
    if (m) return m[1];
  }
  return null;
}

function parseStrava(u: URL): string | null {
  // strava.com/activities/123456 → 123456
  if (!u.hostname.endsWith("strava.com")) return null;
  const m = u.pathname.match(/\/activities\/(\d+)/);
  return m ? m[1] : null;
}

function parseVimeo(u: URL): string | null {
  if (!u.hostname.endsWith("vimeo.com")) return null;
  const m = u.pathname.match(/\/(\d+)/);
  return m ? m[1] : null;
}

function parseEmbed(rawUrl: string): ParsedEmbed | null {
  let u: URL;
  try {
    u = new URL(rawUrl);
  } catch {
    return null;
  }

  const yt = parseYouTube(u);
  if (yt) {
    return {
      kind: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${yt}`,
      aspectClass: "aspect-video",
    };
  }

  const strava = parseStrava(u);
  if (strava) {
    return {
      kind: "strava",
      embedUrl: `https://www.strava.com/activities/${strava}/embed`,
      aspectClass: "aspect-[16/10]",
    };
  }

  const vimeo = parseVimeo(u);
  if (vimeo) {
    return {
      kind: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeo}`,
      aspectClass: "aspect-video",
    };
  }

  return null;
}

export function EmbedBlock({
  url,
  caption,
}: {
  url: string;
  caption?: string;
}) {
  const parsed = parseEmbed(url);

  if (!parsed) {
    return (
      <figure className="my-8 not-prose rounded-xl border border-border bg-card p-4 text-sm">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-running underline underline-offset-2"
        >
          {caption ?? url}
        </a>
        <p className="mt-1 text-xs text-muted-foreground">
          (Nieznany typ embedu — pokazany jako link.)
        </p>
      </figure>
    );
  }

  const title =
    caption ??
    (parsed.kind === "youtube"
      ? "Film z YouTube"
      : parsed.kind === "strava"
        ? "Aktywność Strava"
        : parsed.kind === "vimeo"
          ? "Film z Vimeo"
          : "Embed");

  return (
    <figure className="my-8 not-prose">
      <div
        className={`relative w-full overflow-hidden rounded-xl border border-border ${parsed.aspectClass}`}
      >
        <iframe
          src={parsed.embedUrl}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      </div>
      {caption ? (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
