import Link from "next/link";
import {
  ArrowGlyph,
  CTABlock,
  EditorialImage,
} from "@/components/EditorialPrimitives";
import { capabilitiesPage, capabilityDetails } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Shopify Development & Odoo Implementation",
  description:
    "Shopify design and development, Odoo implementation, platform integration, conversion optimization, reporting, and ongoing systems support.",
  path: "/capabilities",
});

export default function CapabilitiesPage() {
  return (
    <>
      <header className="page-hero">
        <div className="page-hero__copy">
          <div>
            <p className="eyebrow">{capabilitiesPage.eyebrow}</p>
            <h1 className="page-title">Commerce, Connected End to End.</h1>
          </div>
          <p className="lede">{capabilitiesPage.description}</p>
        </div>
        <div className="page-hero__image">
          <EditorialImage
            className="editorial-image--hero"
            src="/images/work-dress-code-product.jpg"
            mobileSrc="/images/mobile/dress-code-product.jpg"
            alt="A Dress Code product page built by UPSTACK, with size, colour, and instalment options"
            caption="Size, colour, and instalment options resolved on one page."
            credit="Dress Code / Shopify"
            priority
            sizes="(max-width: 960px) 100vw, 52vw"
          />
        </div>
      </header>

      <section className="section section--ruled" aria-labelledby="capability-ledger-title">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">The Capability Ledger</p>
            <h2 className="section-title" id="capability-ledger-title">
              Six Connected Disciplines.
            </h2>
          </div>
          <p className="body-large muted">{capabilitiesPage.editorialNote}</p>
        </div>

        <div className="capability-ledger">
          {capabilityDetails.map((capability) => (
            <article
              className="capability-ledger__row"
              id={capability.id}
              key={capability.id}
            >
              <span className="capability-ledger__index">{capability.index}</span>
              <div className="capability-ledger__heading">
                <p className="card-label">{capability.deck}</p>
                <h3 className="subsection-title">{capability.title}</h3>
                <Link className="text-link" href={capability.cta.href}>
                  {capability.cta.label} <ArrowGlyph />
                </Link>
              </div>
              <div className="capability-ledger__copy">
                <p className="section-label">What It Is</p>
                <p>{capability.whatItIs}</p>
                <p className="section-label">The Problem It Solves</p>
                <p className="muted">{capability.problemItSolves}</p>
              </div>
              <div className="capability-ledger__deliverables">
                <p className="section-label">Typical Deliverables</p>
                <ul className="deliverable-list">
                  {capability.deliverables.map((deliverable) => (
                    <li key={deliverable}>{deliverable}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--ruled" aria-labelledby="system-map-title">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Commerce Operating Model</p>
            <h2 className="section-title" id="system-map-title">
              Three Layers. One System.
            </h2>
          </div>
          <p className="body-large muted">
            Each layer has a distinct job. The value comes from designing the handoffs,
            decisions, and data flows between them.
          </p>
        </div>

        <div className="system-map">
          <article className="system-map__item">
            <span className="card-label">Customer Layer / 01</span>
            <h3 className="subsection-title">Shopify Storefront</h3>
            <p>Discovery, merchandising, buying, checkout, and customer confidence.</p>
          </article>
          <article className="system-map__item">
            <span className="card-label">Connection Layer / 02</span>
            <h3 className="subsection-title">Integration</h3>
            <p>Products, customers, orders, inventory, payments, and status data.</p>
          </article>
          <article className="system-map__item">
            <span className="card-label">Operational Layer / 03</span>
            <h3 className="subsection-title">Odoo Operations</h3>
            <p>Sales, stock, finance, fulfillment, CRM, manufacturing, and reporting.</p>
          </article>
        </div>
      </section>

      <section className="section section--ruled">
        <EditorialImage
          className="editorial-image--strip"
          src="/images/odoo-inventory-overview.jpg"
          mobileSrc="/images/mobile/odoo-delivery-orders.jpg"
          mobileKind="panel"
          alt="The Odoo inventory interface, where incoming receipts hand off to outgoing deliveries"
          caption="Reliable systems are built at the handoffs."
          credit="Odoo interface"
          variant="wide"
          sizes="100vw"
        />
      </section>

      <CTABlock
        eyebrow="Define the System"
        headline="Choose the Right Starting Point."
        body={
          <p>
            Begin with the storefront, the operation, or the connection between them.
            The architecture should still account for the whole.
          </p>
        }
        primaryAction={{ label: "Book a Strategy Call", href: "/contact" }}
        secondaryAction={{ label: "Review Selected Work", href: "/work" }}
        className="capabilities-cta"
      />
    </>
  );
}
