import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://run-seba.pl";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "run-seba.pl — bieganie, trasy, treningi",
    template: "%s — run-seba.pl",
  },
  description:
    "Blog Seby o bieganiu: relacje z tras, treningi, sprzęt i maraton w praktyce.",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "run-seba.pl",
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pl"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-background text-foreground"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
