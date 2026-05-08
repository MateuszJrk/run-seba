import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      aria-label="run-seba.pl — strona główna"
      className="group inline-flex items-center gap-2.5"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-6 text-foreground"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M3 18 L8 13 L12 16 L21 7" />
        <path d="M15 7 L21 7 L21 13" />
      </svg>
      <span className="font-heading text-base font-extrabold tracking-tight">
        run<span className="text-muted-foreground">·</span>seba
      </span>
      <span className="ml-1 hidden h-px w-6 bg-foreground/40 transition-all duration-300 group-hover:w-10 group-hover:bg-foreground sm:inline-block" />
    </Link>
  );
}
