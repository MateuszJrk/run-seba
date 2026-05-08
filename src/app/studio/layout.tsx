import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: { absolute: "Sanity Studio — run-seba.pl" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-[calc(100vh-4rem)]">{children}</div>;
}
