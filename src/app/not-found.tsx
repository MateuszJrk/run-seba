import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zgubiłeś trasę",
  description: "Strony nie ma. Wracaj na bieg.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-running">
        404
      </p>
      <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">
        Zgubiłeś trasę.
      </h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        Tej strony nie ma w GPS. Może pomyliłeś skrzyżowanie albo link
        zwietrzał. Bywa.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-running px-5 py-2.5 text-sm font-medium text-running-foreground transition-opacity hover:opacity-90"
        >
          Wróć na blog
        </Link>
        <Link
          href="/tagi"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:border-running/40"
        >
          Przeglądaj po tagach
        </Link>
        <Link
          href="/kalkulator"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:border-running/40"
        >
          Kalkulator tempa
        </Link>
      </div>

      <svg
        viewBox="-8 -8 336 96"
        className="mt-16 w-full max-w-md text-running/30"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path
          d="M0 60 Q 40 20, 80 50 T 160 40 T 240 55 T 312 32"
          strokeDasharray="4 6"
        />
        <circle cx="312" cy="32" r="4" fill="currentColor" stroke="none" />
      </svg>
    </div>
  );
}
