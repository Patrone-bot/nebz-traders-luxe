/** Stable public branding assets (served from /public/branding on Vercel). */
export const BRAND_NAME = "CashoutFX";

export const BRANDING = {
  logo: "/branding/logo.webp",
  favicon16: "/branding/favicon-16x16.png",
  favicon32: "/branding/favicon-32x32.png",
  appleTouchIcon: "/branding/apple-touch-icon.png",
  ogImage: "/branding/og-card.png",
} as const;

/** Absolute URL for metadata / crawlers when VITE_SITE_URL is set at build time. */
export function absoluteBrandUrl(path: string): string {
  const base = import.meta.env.VITE_SITE_URL?.replace(/\/$/, "") ?? "";
  return base ? `${base}${path}` : path;
}
