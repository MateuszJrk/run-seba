import Link from "next/link";
import { InstagramIcon } from "@/components/icons/instagram-icon";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} run-seba.pl — bieganie, trasy, treningi.
        </p>
        <div className="flex items-center gap-4 text-sm">
          <Link
            href="https://instagram.com/run_seba"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <InstagramIcon className="size-4" />
            @run_seba
          </Link>
          <Link
            href="/kontakt"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Kontakt
          </Link>
        </div>
      </div>
    </footer>
  );
}
