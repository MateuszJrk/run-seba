import type { Metadata } from "next";
import { PaceCalculator } from "@/components/pace-calculator";

export const metadata: Metadata = {
  title: "Kalkulator tempa",
  description:
    "Policz tempo na km i mile, prognozy na 5 km, 10 km, półmaraton i maraton (formuła Riegela) oraz VDOT (Daniels). Default: PB Seby — HM 1:22:52.",
};

export default function CalculatorPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Narzędzia
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          Kalkulator tempa
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Wyberz dystans i wpisz czas, zobacz tempo, przewidywany czas na inne
          dystanse oraz swoje VDOT. Wszystko liczy się na bieżąco — bez
          przycisku „Oblicz”.
        </p>
      </header>

      <PaceCalculator />
    </div>
  );
}
