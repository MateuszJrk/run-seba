import { Skeleton } from "@/components/skeleton";

export default function ActivityLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8">
        <Skeleton className="mb-2 h-3 w-44" />
        <Skeleton className="h-10 w-3/4 sm:h-12" />
        <Skeleton className="mt-2 h-4 w-40" />
      </header>

      <Skeleton className="aspect-[16/9] w-full rounded-xl sm:aspect-[2/1]" />

      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-4"
          >
            <Skeleton className="h-3 w-16" />
            <Skeleton className="mt-2 h-7 w-24" />
          </div>
        ))}
      </section>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="mt-3 h-8 w-24" />
          <Skeleton className="mt-2 h-3 w-20" />
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-1 h-4 w-5/6" />
        </div>
      </div>

      <section className="mt-12">
        <Skeleton className="mb-3 h-3 w-44" />
        <Skeleton className="h-52 w-full rounded-xl" />
      </section>

      <section className="mt-12">
        <Skeleton className="mb-3 h-3 w-32" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </section>
    </div>
  );
}
