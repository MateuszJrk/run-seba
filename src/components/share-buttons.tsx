"use client";

import { useEffect, useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { FacebookIcon } from "@/components/icons/facebook-icon";

type Props = {
  url: string;
  title: string;
};

export function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false);
  const [igCopied, setIgCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn("Copy failed:", e);
    }
  }

  async function handleInstagram() {
    // IG nie ma web share URL — na mobile native share, na desktop copy
    if (canNativeShare) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User canceled — fallthrough to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setIgCopied(true);
      setTimeout(() => setIgCopied(false), 2400);
    } catch {}
  }

  async function handleNativeShare() {
    if (!canNativeShare) return;
    try {
      await navigator.share({ title, url });
    } catch {}
  }

  return (
    <section className="mt-12 border-t border-border pt-6">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Udostępnij
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={fbShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-running/40"
          aria-label="Udostępnij na Facebooku"
        >
          <FacebookIcon className="size-4" />
          <span>Facebook</span>
        </a>

        <button
          type="button"
          onClick={handleInstagram}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-running/40"
          aria-label="Udostępnij na Instagramie"
        >
          <InstagramIcon className="size-4" />
          <span>{igCopied ? "Wklej w Instagrama!" : "Instagram"}</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-running/40"
          aria-label={copied ? "Skopiowano" : "Kopiuj link"}
        >
          {copied ? (
            <>
              <Check className="size-4 text-running" />
              <span>Skopiowano!</span>
            </>
          ) : (
            <>
              <Link2 className="size-4" />
              <span>Kopiuj link</span>
            </>
          )}
        </button>

        {canNativeShare ? (
          <button
            type="button"
            onClick={handleNativeShare}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-running/40 sm:hidden"
            aria-label="Udostępnij"
          >
            <Share2 className="size-4" />
            <span>Więcej...</span>
          </button>
        ) : null}
      </div>
    </section>
  );
}
