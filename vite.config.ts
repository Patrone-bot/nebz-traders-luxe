import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "node:path";
import { seoCrawlFilesPlugin } from "./vite/seo-crawl-files-plugin";

/** Replaces %VITE_SITE_URL% in index.html (absolute OG URLs for social crawlers). */
function injectSiteUrlMeta(): Plugin {
  return {
    name: "inject-site-url-meta",
    transformIndexHtml(html) {
      const siteUrl = process.env.VITE_SITE_URL?.trim().replace(/\/$/, "") ?? "";
      return html.replaceAll("%VITE_SITE_URL%", siteUrl);
    },
  };
}

export default defineConfig({
  plugins: [
    TanStackRouterVite({ routesDirectory: "./src/routes", generatedRouteTree: "./src/routeTree.gen.ts" }),
    react(),
    tsconfigPaths(),
    tailwindcss(),
    injectSiteUrlMeta(),
    seoCrawlFilesPlugin(__dirname),
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    host: "::",
    port: 8080,
  },
});
