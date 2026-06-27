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

/** Injects LCP hero preload into index.html (build: hashed URL; dev: source path). */
function preloadHeroLcp(): Plugin {
  return {
    name: "preload-hero-lcp",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        const asset = ctx.bundle
          ? Object.keys(ctx.bundle).find((name) => name.startsWith("assets/hero-") && name.endsWith(".webp"))
          : "src/assets/story/hero.webp";
        if (!asset) return html;
        const href = asset.startsWith("/") ? asset : `/${asset}`;
        const tag = `<link rel="preload" as="image" href="${href}" type="image/webp" fetchpriority="high" />`;
        return html.replace("</head>", `    ${tag}\n  </head>`);
      },
    },
  };
}

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
      autoCodeSplitting: true,
    }),
    react(),
    tsconfigPaths(),
    tailwindcss(),
    injectSiteUrlMeta(),
    preloadHeroLcp(),
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
