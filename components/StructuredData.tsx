import { legalInfo, siteMeta, workEntries } from "@/lib/content";

interface StructuredDataProps {
  /** Absolute site origin, e.g. https://upstack.example. */
  origin: string;
}

/**
 * Organization and WebSite schema. Search engines and ad platforms use this to
 * verify that the site belongs to a real, identifiable business.
 */
export default function StructuredData({ origin }: StructuredDataProps) {
  const graph = [
    {
      "@type": "Organization",
      "@id": `${origin}/#organization`,
      name: siteMeta.name,
      legalName: legalInfo.entityName,
      description: siteMeta.description,
      url: origin,
      logo: `${origin}/og.jpg`,
      image: `${origin}/og.jpg`,
      slogan: siteMeta.positioning,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Cairo",
        addressCountry: "EG",
      },
      ...(legalInfo.contactEmail
        ? {
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "sales",
              email: legalInfo.contactEmail,
              availableLanguage: ["en", "ar"],
            },
          }
        : {}),
      knowsAbout: [
        "Shopify storefront design",
        "Shopify development",
        "Odoo implementation",
        "Shopify Odoo integration",
        "Ecommerce conversion optimization",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      name: siteMeta.name,
      description: siteMeta.description,
      url: origin,
      publisher: { "@id": `${origin}/#organization` },
      inLanguage: "en",
    },
    {
      "@type": "ProfessionalService",
      "@id": `${origin}/#service`,
      name: `${siteMeta.name} ${siteMeta.descriptor}`,
      description: siteMeta.platformLine,
      provider: { "@id": `${origin}/#organization` },
      areaServed: "Worldwide",
      serviceType: [
        "Shopify storefront design and development",
        "Odoo implementation",
        "Commerce platform integration",
        "Conversion optimization",
      ],
    },
    // Names the main sections explicitly, which is what search engines read
    // when deciding whether to show sitelinks under the brand result.
    {
      "@type": "SiteNavigationElement",
      "@id": `${origin}/#navigation`,
      name: ["Capabilities", "Work", "Process", "About", "Contact"],
      url: [
        `${origin}/capabilities`,
        `${origin}/work`,
        `${origin}/process`,
        `${origin}/about`,
        `${origin}/contact`,
      ],
    },
    // Each live client build, so the work claims are machine-readable too.
    ...workEntries.map((entry) => ({
      "@type": "CreativeWork",
      "@id": `${origin}/work#${entry.id}`,
      name: entry.title,
      abstract: entry.summary,
      url: entry.liveUrl,
      creator: { "@id": `${origin}/#organization` },
      about: entry.category,
    })),
  ];

  return (
    <script
      type="application/ld+json"
      // Serialized server-side from static content; no user input reaches this.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}
