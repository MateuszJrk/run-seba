import { ImageResponse } from "next/og";
import { OgTemplate, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const alt = "Seba — biegacz, ambasador butyjana";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function AboutOG() {
  return new ImageResponse(
    (
      <OgTemplate
        eyebrow="O MNIE"
        title="Seba"
        description="Biegacz KS Ultra, ambasador butyjana."
        badges={["HM 1:22:52", "10 km 36:59", "5 km 17:39"]}
      />
    ),
    size,
  );
}
