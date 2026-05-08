import { ImageResponse } from "next/og";
import { OgTemplate, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const alt = "run-seba.pl — bieganie, trasy, treningi";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function HomeOG() {
  return new ImageResponse(
    (
      <OgTemplate
        title="Bieganie, trasy, własne tempo."
        description="Blog Seby — biegacza KS Ultra, ambasadora @butyjana. PB: HM 1:22:52, 10 km 36:59, 5 km 17:39."
        badges={["#bieganie", "#trening", "#trasy"]}
      />
    ),
    size,
  );
}
