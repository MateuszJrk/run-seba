import { ImageResponse } from "next/og";
import { getPostMeta } from "@/lib/posts";

export const alt = "run-seba.pl — wpis";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const DATE_FORMATTER = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostMeta(slug);

  const title = post?.title ?? "run-seba.pl";
  const description = post?.description ?? "Bieganie, trasy, własne tempo.";
  const dateLabel = post?.date
    ? DATE_FORMATTER.format(new Date(post.date))
    : "";
  const tagsLabel = post?.tags?.length
    ? post.tags.map((t) => `#${t}`).join("  ")
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #21316a 0%, #2c4080 60%, #1a2755 100%)",
          color: "#ffffff",
          padding: "80px",
          fontFamily: '"Inter", "Helvetica Neue", system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: "0.15em",
            opacity: 0.85,
          }}
        >
          RUN-SEBA.PL
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: title.length > 60 ? 60 : 78,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              display: "flex",
            }}
          >
            {title}
          </div>
          {description ? (
            <div
              style={{
                fontSize: 28,
                lineHeight: 1.35,
                opacity: 0.78,
                display: "flex",
                maxWidth: "1000px",
              }}
            >
              {description}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 22,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ opacity: 0.85, fontWeight: 600 }}>
              Seba — biegacz KS Ultra, ambasador @butyjana
            </div>
            {tagsLabel ? (
              <div style={{ opacity: 0.55, fontSize: 20 }}>{tagsLabel}</div>
            ) : null}
          </div>
          {dateLabel ? (
            <div style={{ opacity: 0.6 }}>{dateLabel}</div>
          ) : null}
        </div>
      </div>
    ),
    size,
  );
}
