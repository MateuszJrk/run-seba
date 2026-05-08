import Link from "next/link";

export default function ActivityNotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-running">
        404
      </p>
      <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">
        Ta trasa zniknęła z GPS.
      </h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        Tej aktywności nie ma w bazie — może została usunięta ze Stravy albo
        ID jest niepoprawne. Sprawdź najnowsze biegi na stronie głównej.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-running px-5 py-2.5 text-sm font-medium text-running-foreground transition-opacity hover:opacity-90"
        >
          Najnowsze biegi
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:border-running/40"
        >
          Wpisy
        </Link>
      </div>
    </div>
  );
}
