import { BRAND_NAME, BRANDING } from "@/lib/branding";
import { canonicalUrl, getSiteUrl } from "@/lib/site-url";

/** Matches the homepage route meta description (do not change independently). */
const HOME_DESCRIPTION =
  "From a school dropout and a waitress to building a trading empire. Nebz & Nyathira help ordinary people begin their journey for free.";

function brandingAssetUrl(path: string): string {
  return `${getSiteUrl()}${path}`;
}

export function homepageStructuredDataGraph() {
  const siteUrl = canonicalUrl("/");
  const organizationId = `${siteUrl}#organization`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: BRAND_NAME,
        url: siteUrl,
        logo: brandingAssetUrl(BRANDING.logo),
        description: HOME_DESCRIPTION,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        name: BRAND_NAME,
        url: siteUrl,
        publisher: { "@id": organizationId },
      },
    ],
  };
}

export function homepageStructuredDataMeta() {
  return { "script:ld+json": homepageStructuredDataGraph() };
}
