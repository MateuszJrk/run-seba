import { ImageResponse } from "next/og";
import { OgTemplate, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";
import { getPostsByTag } from "@/lib/posts";

export const alt = "Tag — run-seba.pl";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function TagOG({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);
  const count = posts.length;
  const noun = count === 1 ? "wpis" : count < 5 ? "wpisy" : "wpisów";

  return new ImageResponse(
    (
      <OgTemplate
        eyebrow="TAG"
        title={`#${tag}`}
        description={`${count} ${noun} oznaczonych tagiem #${tag} na blogu Seby.`}
        badges={posts
          .slice(0, 3)
          .map((p) => p.title.slice(0, 40) + (p.title.length > 40 ? "…" : ""))}
      />
    ),
    size,
  );
}
