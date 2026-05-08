"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/counter.css";
import { urlForImage } from "@/sanity/lib/image";
import type {
  GalleryBlockData,
  GalleryLayout,
  SanityImage,
} from "@/sanity/lib/types";

function gridClasses(layout: GalleryLayout | undefined): string {
  switch (layout) {
    case "grid-3":
      return "grid grid-cols-2 gap-2 sm:grid-cols-3";
    case "mosaic":
      return "grid grid-cols-2 gap-2 sm:grid-cols-4";
    case "grid-2":
    default:
      return "grid grid-cols-2 gap-2";
  }
}

function tileClasses(
  layout: GalleryLayout | undefined,
  index: number,
  total: number,
): string {
  if (layout !== "mosaic") return "";
  // pierwszy obraz na większy rozmiar w mozaice (col-span-2 row-span-2)
  if (index === 0 && total >= 4) return "sm:col-span-2 sm:row-span-2";
  return "";
}

export function GalleryBlock({
  images,
  layout,
}: Pick<GalleryBlockData, "images" | "layout">) {
  const [index, setIndex] = useState(-1);

  const slides = images.map((img: SanityImage & { caption?: string }) => ({
    src: urlForImage(img).width(2200).quality(85).url(),
    alt: img.alt ?? "",
    description: img.caption ?? img.alt ?? undefined,
  }));

  return (
    <figure className="my-8 not-prose">
      <div className={gridClasses(layout)}>
        {images.map((img, i) => {
          const dims = img.asset.metadata?.dimensions;
          const url = urlForImage(img).width(800).quality(75).url();
          const isMosaicHero =
            layout === "mosaic" && i === 0 && images.length >= 4;
          const aspectClass = isMosaicHero
            ? "aspect-square sm:aspect-[4/5]"
            : "aspect-square";

          return (
            <button
              key={img.asset._id + i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={
                img.alt ? `Zobacz: ${img.alt}` : `Zobacz zdjęcie ${i + 1}`
              }
              className={`group relative overflow-hidden rounded-lg ${aspectClass} ${tileClasses(layout, i, images.length)} cursor-zoom-in`}
            >
              <Image
                src={url}
                alt={img.alt ?? ""}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                placeholder={img.asset.metadata?.lqip ? "blur" : undefined}
                blurDataURL={img.asset.metadata?.lqip}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          );
        })}
      </div>

      <Lightbox
        open={index >= 0}
        index={Math.max(0, index)}
        close={() => setIndex(-1)}
        slides={slides}
        plugins={[Zoom, Captions, Counter]}
        carousel={{ finite: false }}
        zoom={{ maxZoomPixelRatio: 3 }}
        controller={{ closeOnBackdropClick: true }}
        styles={{ container: { backgroundColor: "rgba(0, 0, 0, 0.93)" } }}
      />
    </figure>
  );
}
