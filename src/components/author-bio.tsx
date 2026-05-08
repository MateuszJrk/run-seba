import Image from "next/image";
import Link from "next/link";
import { InstagramIcon } from "@/components/icons/instagram-icon";

export function AuthorBio() {
  return (
    <aside className="mt-16 flex flex-col items-start gap-5 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-7">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-full sm:size-24">
        <Image
          src="/posts/witaj-na-blogu.jpg"
          alt="Seba"
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>
      <div className="flex-1 space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Autor
        </p>
        <h3 className="text-xl font-semibold tracking-tight">Seba</h3>
        <p className="text-sm text-muted-foreground">
          Biegacz KS Ultra, ambasador{" "}
          <Link
            href="https://instagram.com/butyjana"
            target="_blank"
            rel="noopener noreferrer"
            className="text-running underline underline-offset-2 hover:opacity-80"
          >
            @butyjana
          </Link>
          . PB:{" "}
          <span className="font-mono tabular-nums text-foreground">
            HM 1:22:52
          </span>
          ,{" "}
          <span className="font-mono tabular-nums text-foreground">
            10 km 36:59
          </span>
          ,{" "}
          <span className="font-mono tabular-nums text-foreground">
            5 km 17:39
          </span>
          .
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link
            href="https://instagram.com/run_seba"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:border-running/40"
          >
            <InstagramIcon className="size-3.5" />
            @run_seba
          </Link>
          <Link
            href="/o-mnie"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:border-running/40"
          >
            Więcej o mnie
          </Link>
        </div>
      </div>
    </aside>
  );
}
