import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { InstagramIcon } from "@/components/icons/instagram-icon";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Jak się ze mną skontaktować.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-4xl font-bold tracking-tight">Kontakt</h1>
      <p className="mt-2 text-muted-foreground">
        Najszybciej złapiesz mnie na Instagramie. Mailowo też można.
      </p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        <li>
          <Link
            href="https://instagram.com/run_seba"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/20"
          >
            <InstagramIcon className="size-6" />
            <div>
              <p className="font-medium">Instagram</p>
              <p className="text-sm text-muted-foreground">@run_seba</p>
            </div>
          </Link>
        </li>
        <li>
          <a
            href="mailto:s.knapikk@gmail.com"
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/20"
          >
            <Mail className="size-6" />
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-muted-foreground">s.knapikk@gmail.com</p>
            </div>
          </a>
        </li>
      </ul>
    </div>
  );
}
