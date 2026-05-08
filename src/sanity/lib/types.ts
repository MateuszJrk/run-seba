import type { PortableTextBlock } from "next-sanity";

export type SanityImage = {
  _type: "image";
  asset: {
    _id: string;
    url: string;
    metadata?: {
      dimensions?: { width: number; height: number };
      lqip?: string;
    };
  };
  alt?: string;
  hotspot?: { x: number; y: number; height: number; width: number };
};

export type SanityPost = {
  _id: string;
  _type: "post";
  slug: string;
  title: string;
  description: string;
  date: string;
  tags?: string[];
  cover?: SanityImage;
  body?: PortableTextBlock[];
};

export type GalleryLayout = "grid-2" | "grid-3" | "mosaic";

export type GalleryBlockData = {
  _type: "gallery";
  _key: string;
  images: Array<SanityImage & { caption?: string }>;
  layout?: GalleryLayout;
};

export type AuthorPB = {
  distance: string;
  time: string;
  year?: string;
};

export type AuthorLinkType =
  | "instagram"
  | "strava"
  | "facebook"
  | "youtube"
  | "website";

export type AuthorLink = {
  label?: string;
  type: AuthorLinkType;
  url: string;
};

export type SanityAuthor = {
  _id: string;
  name: string;
  role?: string;
  klub?: string;
  shortBio?: string;
  bio?: PortableTextBlock[];
  personalBests?: AuthorPB[];
  links?: AuthorLink[];
  avatar?: SanityImage;
};
