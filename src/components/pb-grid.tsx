"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
  type Variants,
} from "motion/react";
import { useEffect, useRef } from "react";
import { formatSecondsAsTime, parseTimeToSeconds } from "@/lib/time";

export type PB = {
  distance: string;
  time: string;
  year?: string;
};

function AnimatedTime({ time, play }: { time: string; play: boolean }) {
  const { seconds, hasHours } = parseTimeToSeconds(time);
  const value = useMotionValue(0);
  const display = useTransform(value, (v) => formatSecondsAsTime(v, hasHours));

  useEffect(() => {
    if (!play) return;
    const controls = animate(value, seconds, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [play, seconds, value]);

  return <motion.span>{display}</motion.span>;
}

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export function PBGrid({ items }: { items: PB[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.ul
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className="grid grid-cols-2 gap-3 sm:grid-cols-3"
    >
      {items.map((pb) => (
        <motion.li
          key={pb.distance}
          variants={itemVariants}
          className="rounded-xl border border-border bg-card p-4"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {pb.distance}
          </p>
          <p className="mt-1 font-mono text-2xl font-semibold tabular-nums">
            <AnimatedTime time={pb.time} play={inView} />
          </p>
          {pb.year ? (
            <p className="mt-1 text-xs text-muted-foreground">{pb.year}</p>
          ) : null}
        </motion.li>
      ))}
    </motion.ul>
  );
}
