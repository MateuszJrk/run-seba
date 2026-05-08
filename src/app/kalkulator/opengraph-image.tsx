import { ImageResponse } from "next/og";
import { OgTemplate, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const alt = "Kalkulator tempa — run-seba.pl";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function CalculatorOG() {
  return new ImageResponse(
    (
      <OgTemplate
        eyebrow="NARZĘDZIA"
        title="Kalkulator tempa"
        description="Policz pace, prognozy na 5 km, 10 km, półmaraton i maraton (formuła Riegela) oraz VDOT (Daniels)."
        badges={["min/km", "VDOT", "Riegel"]}
      />
    ),
    size,
  );
}
