import { siteConfig } from "@/constants/site";
import { buildFaqSchema } from "@/constants/faqs";

export function buildOrganizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    name: siteConfig.name,
    url: siteConfig.url,
    ...(siteConfig.email ? { email: siteConfig.email } : {}),
    description: siteConfig.description,
    logo: `${siteConfig.url}/opengraph-image`,
    sameAs: Object.values(siteConfig.socials),
    priceRange: "Rp 500 rb - custom",
    areaServed: "ID",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+6285775149968",
      contactType: "sales",
      availableLanguage: ["id"],
    },
  };
}

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(buildOrganizationSchema()),
      }}
    />
  );
}

export function JsonLdFaq() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema()) }}
    />
  );
}

export type JsonLdLinkItem = { name: string; url?: string };

function resolveUrl(url: string): string {
  return new URL(url, siteConfig.url).toString();
}

function buildListItems(items: JsonLdLinkItem[]) {
  return items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    ...(item.url ? { url: resolveUrl(item.url) } : {}),
  }));
}

export function buildBreadcrumbList(items: JsonLdLinkItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: resolveUrl(item.url) } : {}),
    })),
  };
}

export function buildItemList(items: JsonLdLinkItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: buildListItems(items),
  };
}

export function JsonLdData({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}