import { writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Plugin } from "vite";
import { getBuildSiteUrl } from "../src/lib/site-url";
import { renderRobotsTxt, renderSitemapXml } from "../src/lib/seo-crawl-files";

/** Writes robots.txt + sitemap.xml to public/ (build) and serves them in dev. */
export function seoCrawlFilesPlugin(rootDir: string): Plugin {
  const publicDir = join(rootDir, "public");

  const serveCrawlFile = (url: string | undefined): { body: string; type: string } | null => {
    const siteUrl = getBuildSiteUrl();
    if (url === "/robots.txt") {
      return { body: renderRobotsTxt(siteUrl), type: "text/plain" };
    }
    if (url === "/sitemap.xml") {
      return { body: renderSitemapXml(siteUrl), type: "application/xml" };
    }
    return null;
  };

  return {
    name: "seo-crawl-files",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const file = serveCrawlFile(req.url?.split("?")[0]);
        if (!file) {
          next();
          return;
        }
        res.setHeader("Content-Type", file.type);
        res.end(file.body);
      });
    },
    buildStart() {
      const siteUrl = getBuildSiteUrl();
      writeFileSync(join(publicDir, "robots.txt"), renderRobotsTxt(siteUrl));
      writeFileSync(join(publicDir, "sitemap.xml"), renderSitemapXml(siteUrl));
    },
  };
}
