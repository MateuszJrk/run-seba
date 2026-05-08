import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { FacebookIcon } from "@/components/icons/facebook-icon";
import { InstagramFeed } from "@/components/instagram-feed";
import { PBGrid, type PB } from "@/components/pb-grid";
import { PortableTextBody } from "@/components/portable-text";
import { urlForImage } from "@/sanity/lib/image";
import { getAuthor } from "@/lib/author";
import type { AuthorLink, AuthorLinkType } from "@/sanity/lib/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "O mnie",
  description:
    "Seba — biegacz KS Ultra, ambasador butyjana. PB: HM 1:22:52, 10 km 36:59, 5 km 17:39.",
};

const LIGHTWIDGET_ID = process.env.NEXT_PUBLIC_LIGHTWIDGET_ID ?? "";

const LINK_LABEL: Record<AuthorLinkType, string> = {
  instagram: "Instagram",
  strava: "Strava",
  facebook: "Facebook",
  youtube: "YouTube",
  website: "Strona",
};

function LinkIcon({ type }: { type: AuthorLinkType }) {
  if (type === "instagram") return <InstagramIcon className="size-4" />;
  if (type === "facebook") return <FacebookIcon className="size-4" />;
  return null;
}

function AuthorLinkButton({ link }: { link: AuthorLink }) {
  const label = link.label ?? LINK_LABEL[link.type];
  return (
    <Link
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-running/40"
    >
      <LinkIcon type={link.type} />
      <span>{label}</span>
    </Link>
  );
}

export default async function AboutPage() {
  const author = await getAuthor();

  const personalBests: PB[] = author.personalBests.map((pb) => ({
    distance: pb.distance,
    time: pb.time,
    year: pb.year,
  }));

  const avatarUrl = author.avatar?.asset
    ? urlForImage(author.avatar).width(400).quality(85).url()
    : "/posts/witaj-na-blogu.jpg";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          O mnie
        </p>
        <div className="mt-4 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-full sm:size-28">
            <Image
              src={avatarUrl}
              alt={author.avatar?.alt ?? author.name}
              fill
              sizes="112px"
              className="object-cover"
              priority
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {author.name}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {author.role}
            </p>
          </div>
        </div>
      </header>

      <section className="mb-12">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Rekordy życiowe
        </h2>
        <PBGrid items={personalBests} />
      </section>

      <div className="prose-running">
        {author.bio ? (
          <PortableTextBody value={author.bio} />
        ) : (
          <>
            <p>
              Cześć, jestem {author.name}. Biegam, bo to najprostszy sposób,
              żeby uciec od ekranu i wrócić do siebie. Tu zapisuję, co mi z
              tego biegania wychodzi — relacje z tras, treningi i
              przemyślenia o sprzęcie.
            </p>

            <h2>Klub i współprace</h2>
            <ul>
              {author.klub ? (
                <li>
                  <strong>{author.klub}</strong> — mój klub.
                </li>
              ) : null}
              <li>
                Ambasador{" "}
                <Link href="https://instagram.com/butyjana">@butyjana</Link>{" "}
                — polskiej marki butów do biegania.
              </li>
            </ul>

            <h2>Co tu znajdziesz</h2>
            <ul>
              <li>Relacje z biegów i opisy tras</li>
              <li>Plany treningowe, które testuję na sobie</li>
              <li>Recenzje sprzętu — głównie butów</li>
              <li>Notki z przygotowań do startów</li>
            </ul>
          </>
        )}
      </div>

      {author.links.length > 0 ? (
        <div className="mt-12 flex flex-wrap gap-3">
          {author.links.map((link, i) => (
            <AuthorLinkButton key={`${link.url}-${i}`} link={link} />
          ))}
          <Link
            href="/kontakt"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-running/40"
          >
            Napisz do mnie
          </Link>
        </div>
      ) : null}

      {LIGHTWIDGET_ID ? <InstagramFeed widgetId={LIGHTWIDGET_ID} /> : null}
    </div>
  );
}
