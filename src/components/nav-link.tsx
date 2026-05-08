"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive =
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`relative rounded-md px-3 py-2 transition-colors ${
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
      {isActive ? (
        <motion.span
          layoutId="nav-active"
          className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-running"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      ) : null}
    </Link>
  );
}
