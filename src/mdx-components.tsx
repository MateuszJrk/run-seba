import type { MDXComponents } from "mdx/types";
import { type ImageProps } from "next/image";
import Link from "next/link";
import { LightboxImage } from "@/components/lightbox-image";

const components: MDXComponents = {
  img: (props) => (
    <LightboxImage
      sizes="(max-width: 768px) 100vw, 768px"
      className="rounded-lg"
      {...(props as ImageProps)}
      width={(props as ImageProps).width ?? 1600}
      height={(props as ImageProps).height ?? 900}
      alt={props.alt ?? ""}
    />
  ),
  a: ({ href = "", children, ...rest }) => {
    const isInternal = href.startsWith("/") || href.startsWith("#");
    if (isInternal) {
      return (
        <Link href={href} {...rest}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  },
};

export function useMDXComponents(): MDXComponents {
  return components;
}
