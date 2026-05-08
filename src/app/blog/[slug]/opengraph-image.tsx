import { ImageResponse } from "next/og";
import { OgTemplate, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";
import { getPostMeta } from "@/lib/posts";

export const alt = "run-seba.pl — wpis";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

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
    : undefined;
  const badges = post?.tags?.length ? post.tags.map((t) => `#${t}`) : undefined;

  return new ImageResponse(
    (
      <OgTemplate
        title={title}
        description={description}
        badges={badges}
        footerRight={dateLabel}
      />
    ),
    size,
  );
}
