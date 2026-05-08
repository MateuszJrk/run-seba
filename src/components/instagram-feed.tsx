"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useEffect } from "react";
import { InstagramIcon } from "@/components/icons/instagram-icon";

type InstagramFeedProps = {
  widgetId: string;
  username?: string;
  title?: string;
};

export function InstagramFeed({
  widgetId,
  username = "run_seba",
  title = "Z Instagrama",
}: InstagramFeedProps) {
  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://cdn.lightwidget.com/widgets/lightwidget.js"]',
    );
    if (existing) return;
    const script = document.createElement("script");
    script.src = "https://cdn.lightwidget.com/widgets/lightwidget.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  if (!widgetId) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mt-16"
    >
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </h2>
          <p className="mt-1 text-lg font-semibold tracking-tight">
            @{username}
          </p>
        </div>
        <Link
          href={`https://instagram.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-foreground/20"
        >
          <InstagramIcon className="size-4" />
          Otwórz profil
        </Link>
      </header>

      <iframe
        src={`https://cdn.lightwidget.com/widgets/${widgetId}.html`}
        scrolling="no"
        allowTransparency
        title={`@${username} na Instagramie`}
        className="lightwidget-widget w-full rounded-xl border border-border"
        style={{ width: "100%", border: 0, overflow: "hidden" }}
      />
    </motion.section>
  );
}
