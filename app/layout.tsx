import type { Metadata } from "next";
import { headers } from "next/headers";
import { Cormorant_Garamond, Source_Serif_4 } from "next/font/google";
import Analytics from "@/components/Analytics";
import SiteFooter from "@/components/SiteFooter";
import StructuredData from "@/components/StructuredData";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const body = Source_Serif_4({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3001";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title: {
      default: "UPSTACK — Shopify Storefronts & Odoo Systems",
      template: "%s — UPSTACK",
    },
    description:
      "UPSTACK designs high-converting Shopify storefronts, implements Odoo operational systems, and connects commerce infrastructure for growth.",
    alternates: { canonical: new URL("/", metadataBase) },
    applicationName: "UPSTACK",
    category: "Commerce systems",
    keywords: [
      "Shopify design",
      "Shopify development",
      "Odoo implementation",
      "Shopify Odoo integration",
      "commerce systems",
    ],
    openGraph: {
      type: "website",
      title: "UPSTACK — Systems That Sell",
      description:
        "High-converting Shopify storefronts. Integrated Odoo operations. One commerce system built to scale.",
      siteName: "UPSTACK",
      url: new URL("/", metadataBase),
      images: [
        {
          url: new URL("/og.jpg", metadataBase).toString(),
          width: 1200,
          height: 630,
          alt: "UPSTACK — Systems That Sell",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "UPSTACK — Systems That Sell",
      description:
        "Shopify storefronts, Odoo operations, and connected commerce infrastructure.",
      images: [new URL("/og.jpg", metadataBase).toString()],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>
        <StructuredData origin={origin} />
        <Analytics
          posthogKey={process.env.POSTHOG_KEY}
          posthogHost={process.env.POSTHOG_HOST}
          gaMeasurementId={process.env.GA_MEASUREMENT_ID}
        />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <div className="site-frame">
          <SiteHeader />
          <main className="page-main" id="main-content">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
