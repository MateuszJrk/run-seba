import { client } from "@/sanity/lib/client";
import { AUTHOR_QUERY } from "@/sanity/lib/queries";
import type { SanityAuthor, AuthorPB, AuthorLink } from "@/sanity/lib/types";

export type AuthorData = {
  name: string;
  role: string;
  klub?: string;
  shortBio: string;
  bio?: SanityAuthor["bio"];
  personalBests: AuthorPB[];
  links: AuthorLink[];
  avatar?: SanityAuthor["avatar"];
  isFromSanity: boolean;
};

const FALLBACK: AuthorData = {
  name: "Seba",
  role: "Biegacz KS Ultra, ambasador @butyjana",
  klub: "KS Ultra",
  shortBio:
    "Biegacz KS Ultra, ambasador @butyjana. Pisze o trasach, treningach i sprzęcie.",
  bio: undefined,
  personalBests: [
    { distance: "Półmaraton", time: "1:22:52", year: "2020" },
    { distance: "10 km", time: "36:59", year: "2022" },
    { distance: "5 km", time: "17:39", year: "2022" },
    { distance: "1500 m", time: "4:28", year: "2006" },
    { distance: "1 km", time: "2:47" },
  ],
  links: [
    { label: "@run_seba", type: "instagram", url: "https://instagram.com/run_seba" },
    { label: "@butyjana", type: "instagram", url: "https://instagram.com/butyjana" },
  ],
  avatar: undefined,
  isFromSanity: false,
};

export async function getAuthor(): Promise<AuthorData> {
  try {
    const author = await client.fetch<SanityAuthor | null>(
      AUTHOR_QUERY,
      {},
      { next: { revalidate: 60, tags: ["author"] } },
    );

    if (!author) return FALLBACK;

    return {
      name: author.name ?? FALLBACK.name,
      role: author.role ?? FALLBACK.role,
      klub: author.klub,
      shortBio: author.shortBio ?? FALLBACK.shortBio,
      bio: author.bio,
      personalBests:
        author.personalBests && author.personalBests.length > 0
          ? author.personalBests
          : FALLBACK.personalBests,
      links: author.links && author.links.length > 0 ? author.links : FALLBACK.links,
      avatar: author.avatar,
      isFromSanity: true,
    };
  } catch (error) {
    console.warn("Author fetch failed (using fallback):", error);
    return FALLBACK;
  }
}
