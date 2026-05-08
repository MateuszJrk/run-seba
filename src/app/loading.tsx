import { Skeleton } from "@/components/skeleton";

export default function HomeLoading() {
  return (
    <>
      <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden border-b border-border">
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-background from-35% via-background/85 via-65% to-transparent" />
        <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col justify-end px-4 pb-16 sm:px-6 sm:pb-24">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="mt-4 h-12 w-3/4" />
          <Skeleton className="mt-2 h-12 w-1/2" />
          <Skeleton className="mt-6 h-5 w-2/3" />
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <Skeleton className="mb-3 h-3 w-16" />
        <div className="mb-10 flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>

        <Skeleton className="mb-6 h-3 w-32" />
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
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-6 w-14 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
