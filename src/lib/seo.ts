import { canonicalUrl } from "@/lib/site-url";

export const NOINDEX_ROBOTS = { name: "robots", content: "noindex,nofollow" } as const;

export function canonicalLink(path: "/" | "/get-started") {
  return { rel: "canonical", href: canonicalUrl(path) };
}
