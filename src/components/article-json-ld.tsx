import type { PostMeta } from "@/lib/posts";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://run-seba.pl";

const AUTHOR = {
  "@type": "Person" as const,
  name: "Seba",
  url: `${SITE_URL}/o-mnie`,
  sameAs: [
    "https://instagram.com/run_seba",
    "https://domtel-sport.pl/statystykaLA/personal.php?page=profile&nr_zaw=16385",
  ],
};

const PUBLISHER = {
  "@type": "Organization" as const,
  name: "run-seba.pl",
  url: SITE_URL,
};

export function ArticleJsonLd({ post }: { post: PostMeta }) {
  const url = `${SITE_URL}/blog/${post.slug}`;

  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: post.date,
    dateModified: post.date,
    image: post.cover ?? `${url}/opengraph-image`,
    keywords: post.tags.join(", "),
    author: AUTHOR,
    publisher: PUBLISHER,
    inLanguage: "pl-PL",
  };

  return (
    <script
      type="application/ld+json"
      // Tag musi być surowy — JSON.stringify, nie React rendering.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
