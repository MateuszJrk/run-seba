"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import heroImage from "../../public/hero.jpg";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative -mt-px h-[78vh] min-h-[520px] w-full overflow-hidden border-b border-border"
    >
      <motion.div
        style={{ y }}
        className="absolute inset-0 -z-10 will-change-transform"
      >
        <Image
          src={heroImage}
          alt="Seba na trasie biegu w terenie, jesień, fot. Katarzyna Gogler"
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          className="object-cover object-center"
        />
        <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-background from-35% via-background/85 via-65% to-transparent" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto flex h-full max-w-5xl flex-col justify-end px-4 pb-16 sm:px-6 sm:pb-24"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-sm font-medium uppercase tracking-[0.2em] text-foreground/80"
        >
          run-seba.pl
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
        >
          Bieganie, trasy, własne tempo.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.25 }}
          className="mt-4 max-w-2xl text-lg text-foreground/80"
        >
          Blog Seby — biegacza KS Ultra, ambasadora{" "}
          <Link
            href="https://instagram.com/butyjana"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 transition-opacity hover:opacity-80"
          >
            @butyjana
          </Link>
          . PB:{" "}
          <span className="font-mono tabular-nums text-foreground">
            HM 1:22:52
          </span>
          ,{" "}
          <span className="font-mono tabular-nums text-foreground">
            10 km 36:59
          </span>
          ,{" "}
          <span className="font-mono tabular-nums text-foreground">
            5 km 17:39
          </span>
          .
        </motion.p>
      </motion.div>

      <motion.div
        style={{ opacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute inset-x-0 bottom-6 z-10 mx-auto flex justify-center"
        aria-hidden
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{
            duration: 1.8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="flex flex-col items-center gap-1.5 text-foreground/70"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.2em]">
            Scroll
          </span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <path d="M6 9 L12 15 L18 9" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
