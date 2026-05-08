"use client";

import { motion, type Variants } from "motion/react";
import { PostCard } from "@/components/post-card";
import type { PostMeta } from "@/lib/posts";

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function PostsList({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) {
    return (
      <p className="text-muted-foreground">
        Jeszcze nic tu nie ma — pierwszy bieg zaraz, pierwszy wpis tuż po nim.
      </p>
    );
  }

  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="grid gap-6 sm:grid-cols-2"
    >
      {posts.map((post) => (
        <motion.li key={post.slug} variants={itemVariants}>
          <PostCard post={post} />
        </motion.li>
      ))}
    </motion.ul>
  );
}
