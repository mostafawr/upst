import { CTABlock } from "@/components/EditorialPrimitives";
import RetroTVCarousel from "@/components/RetroTVCarousel";
import type { TVChannel } from "@/components/RetroTVCarousel";
import { workPage } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Work",
  description:
    "Explore UPSTACK's portfolio of Shopify storefronts and commerce systems — presented as mockup websites inside a retro CRT television.",
  path: "/work",
});

const tvChannels: TVChannel[] = [
  {
    id: "surur",
    brand: "Surur",
    tagline: "The Mood of Wood.",
    subtitle:
      "A modern furniture retailer selling across rooms and collections. Built as a bilingual Shopify storefront where browsing by room and by collection both lead cleanly to the product.",
    category: "Shopify Storefront",
    services: [
      "Store Architecture",
      "Shopify Theme Build",
      "Bilingual EN/AR Setup",
      "Collection & Navigation Design",
      "Product Merchandising",
    ],
    technology: ["Shopify", "Liquid", "Bilingual Storefront"],
    image: "/images/work-surur.jpg",
    mobileImage: "/images/mobile/surur-product.jpg",
    href: "https://surureg.com",
  },
  {
    id: "dress-code",
    brand: "Dress Code",
    tagline: "New Collection.",
    subtitle:
      "An Egyptian fashion label running frequent drops and promotions. Built as a Shopify storefront where new arrivals, campaign offers, and instalment payments stay clear at every step.",
    category: "Shopify Storefront",
    services: [
      "Store Architecture",
      "Shopify Theme Build",
      "Campaign & Promotion Setup",
      "Instalment Payment Integration",
      "Collection Merchandising",
    ],
    technology: ["Shopify", "Liquid", "Sympl Instalments"],
    image: "/images/work-dress-code.jpg",
    mobileImage: "/images/mobile/dress-code-product.jpg",
    href: "https://dresscodeme.com",
  },
  {
    id: "more-cottons",
    brand: "More Cottons",
    tagline: "Five-Star Softness at Home.",
    subtitle:
      "A home textiles retailer with a deep catalogue across bedroom, bathroom, and bridal. UPSTACK runs the Shopify storefront and the Odoo operation behind it, so the catalogue and the warehouse agree.",
    category: "Shopify + Odoo",
    services: [
      "Storefront Management",
      "Catalogue & Merchandising",
      "Odoo Implementation",
      "Inventory & Fulfillment Operations",
      "Reporting",
    ],
    technology: ["Shopify", "Odoo", "Inventory", "Reporting"],
    image: "/images/work-more-cottons.jpg",
    mobileImage: "/images/mobile/more-cottons-catalogue.jpg",
    href: "https://morecottons.com",
  },
];

export default function WorkPage() {
  return (
    <>
      <header className="work-hero">
        <div className="work-hero__copy">
          <p className="eyebrow">{workPage.eyebrow}</p>
          <h1 className="page-title" id="work-title">
            Selected Systems.
          </h1>
        </div>
        <p className="lede work-hero__lede">
          Shopify storefronts and connected Odoo operations, built end to end.
          Change the channel to walk through each build.
        </p>
      </header>

      <section className="retro-tv-page" aria-labelledby="work-title">
        <RetroTVCarousel channels={tvChannels} />
      </section>

      <CTABlock
        eyebrow="Start the Conversation"
        headline="Build the Next One."
        body={
          <p>
            Tell us where the storefront, the operation, or the connection
            between them is limiting the business.
          </p>
        }
        primaryAction={{ label: "Book a Strategy Call", href: "/contact" }}
        secondaryAction={{ label: "Review Capabilities", href: "/capabilities" }}
        className="work-cta"
      />
    </>
  );
}
