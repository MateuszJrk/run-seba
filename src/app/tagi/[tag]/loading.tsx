import { Skeleton } from "@/components/skeleton";

export default function TagLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="mt-2 h-12 w-48" />
        <Skeleton className="mt-3 h-4 w-24" />
      </header>

      <ul className="grid gap-6 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <li
            key={i}
            className="overflow-hidden rounded-xl border border-border bg-card"
          >
            <Skeleton className="aspect-[16/9] w-full rounded-none" />
            <div className="space-y-3 p-6">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
