import type { CSSProperties, ReactNode } from "react";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const BG_GRADIENT =
  "linear-gradient(135deg, #21316a 0%, #2c4080 60%, #1a2755 100%)";

export type OgTemplateProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  badges?: string[];
  footerLeft?: ReactNode;
  footerRight?: ReactNode;
};

const baseStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  background: BG_GRADIENT,
  color: "#ffffff",
  padding: "80px",
  fontFamily: '"Inter", "Helvetica Neue", system-ui, sans-serif',
};

export function OgTemplate({
  eyebrow = "RUN-SEBA.PL",
  title,
  description,
  badges,
  footerLeft,
  footerRight,
}: OgTemplateProps) {
  const titleSize = title.length > 60 ? 60 : 78;

  return (
    <div style={baseStyle}>
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
        {eyebrow}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            fontSize: titleSize,
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
        {badges && badges.length > 0 ? (
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            {badges.map((b) => (
              <div
                key={b}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 18px",
                  background: "rgba(255, 255, 255, 0.12)",
                  borderRadius: 999,
                  fontSize: 22,
                  fontWeight: 600,
                }}
              >
                {b}
              </div>
            ))}
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
        <div
          style={{
            display: "flex",
            opacity: 0.85,
            fontWeight: 600,
          }}
        >
          {footerLeft ?? "Seba — biegacz KS Ultra, ambasador @butyjana"}
        </div>
        {footerRight ? (
          <div style={{ display: "flex", opacity: 0.6 }}>{footerRight}</div>
        ) : null}
      </div>
    </div>
  );
}
