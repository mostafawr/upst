import { pageMetadata } from "@/lib/metadata";
import RetroTVCarousel from "@/components/RetroTVCarousel";
import type { TVChannel } from "@/components/RetroTVCarousel";

export const metadata = pageMetadata({
  title: "Work",
  description:
    "Explore UPSTACK's portfolio of Shopify storefronts and commerce systems — presented as mockup websites inside a retro CRT television.",
  path: "/work",
});

const tvChannels: TVChannel[] = [
  {
    id: "saint-supply",
    brand: "Saint Supply Skincare",
    tagline: "Ritual Made Simple.",
    subtitle:
      "A clean-beauty DTC brand that needed a Shopify storefront matching the quality of its formulas — clinical, minimal, and conversion-focused.",
    category: "Shopify Storefront",
    services: [
      "Commerce Strategy",
      "UX & Store Architecture",
      "Custom Shopify Theme",
      "Checkout Optimization",
      "Performance Tuning",
    ],
    technology: ["Shopify", "Liquid", "Headless CMS", "Analytics"],
    image: "/images/mockup-skincare.png",
  },
  {
    id: "forma-home",
    brand: "Forma Home",
    tagline: "Designed for How You Live.",
    subtitle:
      "A contemporary furniture brand bridging online discovery with showroom-grade presentation — built for clarity, scale, and operational flow.",
    category: "Shopify + Odoo Integration",
    services: [
      "Commerce Strategy",
      "Shopify UX Design",
      "Odoo Inventory Setup",
      "Shopify–Odoo Integration",
      "Reporting Dashboard",
    ],
    technology: ["Shopify", "Odoo", "API Integration", "Analytics"],
    image: "/images/mockup-furniture.png",
  },
  {
    id: "ember-roasters",
    brand: "Ember Roasters",
    tagline: "Craft in Every Cup.",
    subtitle:
      "A specialty coffee roaster scaling from farmers markets to nationwide DTC — with subscriptions, wholesale, and inventory connected through one system.",
    category: "Shopify + Subscriptions",
    services: [
      "Subscription Architecture",
      "Shopify Development",
      "Wholesale Portal",
      "Odoo Inventory & Fulfillment",
      "Measurement Planning",
    ],
    technology: ["Shopify", "Odoo", "Subscription API", "Reporting"],
    image: "/images/mockup-coffee.png",
  },
  {
    id: "maison-noir",
    brand: "Maison Noir",
    tagline: "Quiet Luxury.",
    subtitle:
      "A European-crafted fashion label launching its DTC channel — demanding editorial-level design with full operational infrastructure behind it.",
    category: "Full Commerce System",
    services: [
      "Brand Commerce Strategy",
      "Editorial Shopify Design",
      "Odoo ERP Implementation",
      "Multi-currency Setup",
      "Continuous Optimization",
    ],
    technology: ["Shopify", "Odoo", "Multi-currency", "CRM", "Analytics"],
    image: "/images/mockup-fashion.png",
  },
];

export default function WorkPage() {
  return (
    <section className="retro-tv-page" aria-labelledby="work-title">
      <h1 className="sr-only" id="work-title">Selected Work by UPSTACK</h1>
      <RetroTVCarousel channels={tvChannels} />
    </section>
  );
}
