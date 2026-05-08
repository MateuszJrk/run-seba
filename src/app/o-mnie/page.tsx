import type { Metadata } from "next";
import Link from "next/link";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { PBGrid, type PB } from "@/components/pb-grid";

export const metadata: Metadata = {
  title: "O mnie",
  description:
    "Seba — biegacz KS Ultra, ambasador butyjana. PB: HM 1:22:52, 10 km 36:59, 5 km 17:39.",
};

const PERSONAL_BESTS: PB[] = [
  { distance: "Półmaraton", time: "1:22:52", year: "2020" },
  { distance: "10 km", time: "36:59", year: "2022" },
  { distance: "5 km", time: "17:39", year: "2022" },
  { distance: "1500 m", time: "4:28", year: "2006" },
  { distance: "1 km", time: "2:47" },
];

const DOMTEL_PROFILE_URL =
  "https://domtel-sport.pl/statystykaLA/personal.php?page=profile&nr_zaw=16385";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          O mnie
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          Seba
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Biegacz KS Ultra, ambasador{" "}
          <Link
            href="https://instagram.com/butyjana"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 transition-opacity hover:opacity-80"
          >
            @butyjana
          </Link>
          .
        </p>
      </header>

      <section className="mb-12">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Rekordy życiowe
        </h2>
        <PBGrid items={PERSONAL_BESTS} />
      </section>

      <div className="prose-running">
        <p>
          Cześć, jestem Seba. Biegam, bo to najprostszy sposób, żeby uciec od
          ekranu i wrócić do siebie. Tu zapisuję, co mi z tego biegania
          wychodzi — relacje z tras, treningi, które zadziałały (i te, które
          mnie złamały), oraz przemyślenia o sprzęcie.
        </p>

        <h2>Klub i współprace</h2>
        <ul>
          <li>
            <strong>KS Ultra</strong> — mój klub.
          </li>
          <li>
            Ambasador <Link href="https://instagram.com/butyjana">@butyjana</Link>
            {" "}— polskiej marki butów do biegania.
          </li>
        </ul>

        <h2>Co tu znajdziesz</h2>
        <ul>
          <li>Relacje z biegów i opisy tras</li>
          <li>Plany treningowe, które testuję na sobie</li>
          <li>Recenzje sprzętu — głównie butów</li>
          <li>Notki z przygotowań do startów</li>
        </ul>

        <h2>Statystyki i wyniki</h2>
        <p>
          Pełny profil zawodnika (PZLA / domtel-sport):{" "}
          <Link href={DOMTEL_PROFILE_URL}>
            domtel-sport.pl
          </Link>
          .
        </p>
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href="https://instagram.com/run_seba"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-foreground/20"
        >
          <InstagramIcon className="size-4" />
          @run_seba
        </Link>
        <Link
          href="/kontakt"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-foreground/20"
        >
          Napisz do mnie
        </Link>
      </div>
    </div>
  );
}
