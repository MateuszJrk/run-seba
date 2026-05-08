import {
  PortableText as PortableTextRaw,
  type PortableTextComponents,
  type PortableTextBlock,
} from "next-sanity";
import Link from "next/link";
import { urlForImage } from "@/sanity/lib/image";
import type { GalleryBlockData, SanityImage } from "@/sanity/lib/types";
import { LightboxImage } from "@/components/lightbox-image";
import { GalleryBlock } from "@/components/gallery-block";
import { EmbedBlock } from "@/components/embed-block";

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
          <LightboxImage
            src={url}
            alt={value.alt ?? ""}
            width={width}
            height={height}
            sizes="(max-width: 768px) 100vw, 768px"
            placeholder={value.asset.metadata?.lqip ? "blur" : undefined}
            blurDataURL={value.asset.metadata?.lqip}
            className="rounded-lg"
            caption={value.caption}
          />
          {value.caption ? (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
    gallery: ({ value }: { value: GalleryBlockData }) => {
      if (!value?.images?.length) return null;
      return <GalleryBlock images={value.images} layout={value.layout} />;
    },
    embed: ({ value }: { value: { url: string; caption?: string } }) => {
      if (!value?.url) return null;
      return <EmbedBlock url={value.url} caption={value.caption} />;
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
