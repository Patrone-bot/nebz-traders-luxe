const DISALLOWED_PATHS = [
  "/admin",
  "/dashboard",
  "/verify",
  "/verify-existing",
  "/verify-new",
] as const;

const SITEMAP_PATHS = ["/", "/get-started"] as const;

export function renderRobotsTxt(siteUrl: string): string {
  const disallowLines = DISALLOWED_PATHS.map((path) => `Disallow: ${path}`).join("\n");
  return `User-agent: *
Allow: /

${disallowLines}

Sitemap: ${siteUrl}/sitemap.xml
`;
}

export function renderSitemapXml(siteUrl: string): string {
  const urls = SITEMAP_PATHS.map((path) => {
    const loc = path === "/" ? `${siteUrl}/` : `${siteUrl}${path}`;
    return `  <url>\n    <loc>${loc}</loc>\n  </url>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}
