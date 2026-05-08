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
