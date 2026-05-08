import {
  PortableText as PortableTextRaw,
  type PortableTextComponents,
  type PortableTextBlock,
} from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { urlForImage } from "@/sanity/lib/image";
import type { SanityImage } from "@/sanity/lib/types";

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImage & { caption?: string } }) => {
      if (!value?.asset) return null;
      const dims = value.asset.metadata?.dimensions;
      const width = dims?.width ?? 1600;
      const height = dims?.height ?? Math.round(width * 0.5625);
      const url = urlForImage(value).width(1600).quality(80).url();

      return (
        <figure className="my-8">
          <Image
            src={url}
            alt={value.alt ?? ""}
            width={width}
            height={height}
            sizes="(max-width: 768px) 100vw, 768px"
            placeholder={value.asset.metadata?.lqip ? "blur" : undefined}
            blurDataURL={value.asset.metadata?.lqip}
            className="rounded-lg"
          />
          {value.caption ? (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
  marks: {
    link: ({ value, children }) => {
      const href = (value?.href as string) ?? "#";
      const isInternal = href.startsWith("/") || href.startsWith("#");
      if (isInternal) {
        return <Link href={href}>{children}</Link>;
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    },
  },
};

export function PortableTextBody({ value }: { value: PortableTextBlock[] }) {
  return <PortableTextRaw value={value} components={components} />;
}
