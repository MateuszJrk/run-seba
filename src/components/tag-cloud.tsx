import Link from "next/link";

type TagCount = { tag: string; count: number };

const SIZE_STEPS = [
  { className: "text-sm sm:text-base" },
  { className: "text-base sm:text-lg" },
  { className: "text-lg sm:text-xl" },
  { className: "text-xl sm:text-2xl font-medium" },
  { className: "text-2xl sm:text-3xl font-semibold" },
] as const;

function sizeClassFor(count: number, max: number): string {
  if (max <= 1) return SIZE_STEPS[0].className;
  // Skala logarytmiczna 0..1 → index w SIZE_STEPS
  const ratio = Math.log(count + 1) / Math.log(max + 1);
  const idx = Math.min(
    SIZE_STEPS.length - 1,
    Math.floor(ratio * SIZE_STEPS.length),
  );
  return SIZE_STEPS[idx].className;
}

export function TagCloud({ tags }: { tags: TagCount[] }) {
  if (tags.length === 0) return null;

  const maxCount = Math.max(...tags.map((t) => t.count));
  // Sortuj alfabetycznie po tagu, żeby cloud nie był zbyt "rankingowy"
  const sorted = [...tags].sort((a, b) => a.tag.localeCompare(b.tag, "pl"));

  return (
    <ul className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
      {sorted.map(({ tag, count }) => {
        const isHot = count === maxCount && tags.length > 1;
        return (
          <li key={tag}>
            <Link
              href={`/tagi/${tag}`}
              className={`inline-flex items-baseline gap-1 leading-none transition-colors hover:text-running ${sizeClassFor(count, maxCount)} ${isHot ? "text-running" : "text-foreground"}`}
            >
              <span className="text-muted-foreground">#</span>
              <span>{tag}</span>
              <span className="ml-0.5 text-[0.65em] tabular-nums text-muted-foreground">
                {count}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
