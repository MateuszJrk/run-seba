import Link from "next/link";

type Props = {
  page: number;
  totalPages: number;
  /** Function returning URL for given page number. Page 1 is special. */
  hrefFor: (page: number) => string;
};

function pageNumbers(current: number, total: number): Array<number | "…"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  // Window: first, last, current ±1, plus ellipses
  const set = new Set<number>([1, total, current - 1, current, current + 1]);
  const sorted = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const result: Array<number | "…"> = [];
  for (let i = 0; i < sorted.length; i++) {
    result.push(sorted[i]);
    if (i < sorted.length - 1 && sorted[i + 1] - sorted[i] > 1) {
      result.push("…");
    }
  }
  return result;
}

export function Pagination({ page, totalPages, hrefFor }: Props) {
  if (totalPages <= 1) return null;

  const prev = page > 1 ? page - 1 : null;
  const next = page < totalPages ? page + 1 : null;
  const items = pageNumbers(page, totalPages);

  return (
    <nav
      aria-label="Paginacja"
      className="mt-12 flex items-center justify-between gap-4"
    >
      {prev ? (
        <Link
          href={hrefFor(prev)}
          rel="prev"
          className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-running/40"
        >
          ← Poprzednia
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-muted px-4 py-2 text-sm text-muted-foreground/60">
          ← Poprzednia
        </span>
      )}

      <ul className="hidden items-center gap-1 sm:flex" aria-hidden>
        {items.map((item, i) =>
          item === "…" ? (
            <li
              key={`gap-${i}`}
              className="px-2 text-sm text-muted-foreground"
            >
              …
            </li>
          ) : (
            <li key={item}>
              <Link
                href={hrefFor(item)}
                aria-current={item === page ? "page" : undefined}
                className={`inline-flex size-9 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                  item === page
                    ? "bg-running text-running-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item}
              </Link>
            </li>
          ),
        )}
      </ul>

      <p className="text-sm text-muted-foreground sm:hidden">
        Strona <span className="text-foreground">{page}</span> z {totalPages}
      </p>

      {next ? (
        <Link
          href={hrefFor(next)}
          rel="next"
          className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-running/40"
        >
          Następna →
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-muted px-4 py-2 text-sm text-muted-foreground/60">
          Następna →
        </span>
      )}
    </nav>
  );
}
