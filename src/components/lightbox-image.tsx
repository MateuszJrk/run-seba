"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

type LightboxImageProps = Omit<ImageProps, "onClick"> & {
  caption?: string;
};

export function LightboxImage({ caption, ...imageProps }: LightboxImageProps) {
  const [open, setOpen] = useState(false);
  const src = typeof imageProps.src === "string" ? imageProps.src : "";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full cursor-zoom-in p-0 transition-opacity hover:opacity-95 focus-visible:opacity-95"
        aria-label={
          imageProps.alt
            ? `Otwórz zdjęcie: ${imageProps.alt}`
            : "Otwórz zdjęcie"
        }
      >
        <Image {...imageProps} alt={imageProps.alt ?? ""} />
      </button>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        plugins={[Zoom, Captions]}
        slides={[
          {
            src,
            alt: imageProps.alt ?? "",
            description: caption ?? imageProps.alt ?? undefined,
          },
        ]}
        carousel={{ finite: true }}
        zoom={{ maxZoomPixelRatio: 3 }}
        controller={{ closeOnBackdropClick: true }}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.92)" },
        }}
      />
    </>
  );
}
