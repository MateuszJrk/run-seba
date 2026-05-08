"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { FacebookIcon } from "@/components/icons/facebook-icon";

type Props = {
  url: string;
  title: string;
};

type ToastState = {
  message: string;
  hint?: string;
} | null;

export function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  async function copyToClipboard(): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch (e) {
      console.warn("Copy failed:", e);
      return false;
    }
  }

  async function handleCopy() {
    const ok = await copyToClipboard();
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setToast({ message: "Link skopiowany!" });
    }
  }

  async function handleInstagram() {
    // Mobile: native share sheet (iOS/Android pokazują IG jako jedną z opcji)
    if (canNativeShare) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User canceled — pokaż fallback
      }
    }

    // Desktop / brak Web Share API: kopiuj link + otwórz IG w nowej karcie
    const ok = await copyToClipboard();
    if (ok) {
      setToast({
        message: "Link skopiowany!",
        hint: "Otworzyłem Instagrama — wklej go w Stories albo wiadomość (Ctrl/⌘+V).",
      });
    } else {
      setToast({
        message: "Nie udało się skopiować",
        hint: "Skopiuj link ręcznie z paska adresu i wklej w Instagrama.",
      });
    }
    // Otwórz IG w nowej karcie (instagram.com — landing user, dalej sam)
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
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
          <span>Instagram</span>
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

      <AnimatePresence>
        {toast ? (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-6 left-1/2 z-50 max-w-sm -translate-x-1/2 rounded-xl border border-running/40 bg-background/95 px-4 py-3 shadow-lg backdrop-blur sm:bottom-8"
          >
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Check className="size-4 text-running" />
              {toast.message}
            </p>
            {toast.hint ? (
              <p className="mt-1 text-xs text-muted-foreground">
                {toast.hint}
              </p>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
