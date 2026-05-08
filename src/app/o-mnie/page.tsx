import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "O mnie",
  description: "Kim jestem i dlaczego biegam.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-4xl font-bold tracking-tight">O mnie</h1>

      <div className="prose-running mt-8">
        <p>
          Cześć, jestem Seba. Biegam, bo to najprostszy sposób, żeby uciec od
          ekranu i wrócić do siebie. Tu zapisuję, co mi z tego biegania
          wychodzi — relacje z tras, treningi, które zadziałały (i te, które
          mnie złamały), oraz przemyślenia o sprzęcie.
        </p>

        <p>
          Jeśli chcesz złapać mnie na żywo, najszybciej znajdziesz mnie na
          Instagramie:{" "}
          <Link href="https://instagram.com/run_seba">@run_seba</Link>.
        </p>

        <h2>Co tu znajdziesz</h2>
        <ul>
          <li>Relacje z biegów i opisy tras</li>
          <li>Plany treningowe, które testuję na sobie</li>
          <li>Recenzje sprzętu — głównie butów</li>
          <li>Notki z przygotowań do startów</li>
        </ul>
      </div>
    </div>
  );
}
