/** Production default when VITE_SITE_URL is unset (robots/sitemap/canonical). */
export const DEFAULT_SITE_URL = "https://cashoutfx.com";

/** Runtime + route head canonical base (inlined at Vite build). */
export function getSiteUrl(): string {
  const fromEnv = import.meta.env.VITE_SITE_URL?.trim().replace(/\/$/, "");
  return fromEnv || DEFAULT_SITE_URL;
}

/** Build-time base for generated crawl files (Vite plugin). */
export function getBuildSiteUrl(): string {
  if (typeof process !== "undefined" && process.env.VITE_SITE_URL?.trim()) {
    return process.env.VITE_SITE_URL.trim().replace(/\/$/, "");
  }
  return DEFAULT_SITE_URL;
}

export function canonicalUrl(path: string): string {
  const base = getSiteUrl();
  if (path === "/") return `${base}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
