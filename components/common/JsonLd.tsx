import { siteConfig } from "@/constants/site";
import { faqs } from "@/constants/faqs";

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
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}