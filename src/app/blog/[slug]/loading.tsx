import { Skeleton } from "@/components/skeleton";

export default function PostLoading() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Skeleton className="mb-10 aspect-[16/9] w-full rounded-2xl" />

      <header className="mb-10 border-b border-border pb-8">
        <Skeleton className="mb-4 h-3 w-44" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="mt-3 h-12 w-1/2" />
        <Skeleton className="mt-5 h-5 w-2/3" />
        <div className="mt-6 flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </header>

      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-8 h-7 w-2/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </article>
  );
}
