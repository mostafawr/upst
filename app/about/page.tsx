import {
  CTABlock,
  EditorialImage,
} from "@/components/EditorialPrimitives";
import {
  aboutAudiences,
  aboutPage,
  aboutPrinciples,
  aboutReasons,
  platformExpertise,
} from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "About",
  description:
    "UPSTACK is a specialized commerce systems partner connecting customer-facing Shopify experiences with Odoo operations.",
  path: "/about",
});

function EditorialList({
  items,
  prefix,
}: {
  items: readonly { title: string; description: string }[];
  prefix: string;
}) {
  return (
    <div className="editorial-list">
      {items.map((item, index) => (
        <article className="editorial-list__item" key={item.title}>
          <span className="card-label">{prefix}{index + 1}</span>
          <div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <header className="page-hero">
        <div className="page-hero__copy">
          <div>
            <p className="eyebrow">{aboutPage.eyebrow}</p>
            <h1 className="page-title">One Partner for the Full Commerce System.</h1>
          </div>
          <p className="lede">{aboutPage.description}</p>
        </div>
        <div className="page-hero__image">
          <EditorialImage
            className="editorial-image--hero"
            src="/images/work-more-cottons-product.jpg"
            alt="A More Cottons product page, with variants, size guide, and instalment payments"
            caption="Customer experience and business operations, designed together."
            credit="More Cottons / Shopify"
            priority
            sizes="(max-width: 960px) 100vw, 52vw"
          />
        </div>
      </header>

      <section className="section section--ruled" aria-labelledby="what-we-do-title">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">{aboutPage.whatWeDo.title}</p>
            <h2 className="section-title" id="what-we-do-title">
              Experience in Front. Operations Behind.
            </h2>
          </div>
          <p className="body-large muted">{aboutPage.whatWeDo.description}</p>
        </div>

        <div className="about-grid">
          {platformExpertise.map((area, index) => (
            <article className="about-card" key={area.title}>
              <span className="card-label">0{index + 1}</span>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
            </article>
          ))}
          <article className="about-card">
            <span className="card-label">04</span>
            <h3>Continuous Improvement</h3>
            <p>Conversion, performance, automation, reporting, and support organized around a practical roadmap.</p>
          </article>
        </div>
      </section>

      <section className="section section--ruled" aria-labelledby="mission-title">
        <article className="about-feature">
          <div className="about-feature__copy">
            <p className="eyebrow">The Aim</p>
            <h2 className="pull-quote" id="mission-title">
              “{aboutPage.statement}”
            </h2>
          </div>
          <div className="about-feature__visual">
            <EditorialImage
              className="editorial-image--wide"
              src="/images/work-surur-architecture.jpg"
              alt="The Surur collection page, showing the filter and sort system UPSTACK built"
              caption="A clearer buying experience: filters, stock, and sort built into the storefront."
              credit="Surur / Shopify"
              sizes="(max-width: 960px) 100vw, 60vw"
            />
          </div>
        </article>
      </section>

      <section className="section section--ruled" aria-labelledby="principles-title">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Principles</p>
            <h2 className="section-title" id="principles-title">
              How We Think.
            </h2>
          </div>
          <p className="body-large muted">
            Clear systems come from clear decisions: what to connect, what to simplify,
            what to measure, and what the team can confidently operate.
          </p>
        </div>
        <div className="principle-grid">
          {aboutPrinciples.map((principle, index) => (
            <article className="principle-card" key={principle.title}>
              <span className="card-label">0{index + 1}</span>
              <h3>{principle.title}</h3>
              <p>{principle.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--ruled" aria-labelledby="serve-title">
        <div className="audience-reasons">
          <div>
            <p className="eyebrow">Who We Serve</p>
            <h2 className="subsection-title" id="serve-title">
              Commerce Businesses Ready for a Stronger System.
            </h2>
            <EditorialList items={aboutAudiences} prefix="A0" />
          </div>
          <div>
            <p className="eyebrow">Why Clients Engage</p>
            <h2 className="subsection-title">Both Sides of the Commerce Equation.</h2>
            <EditorialList items={aboutReasons} prefix="B0" />
          </div>
        </div>
      </section>

      <section className="section section--ruled">
        <EditorialImage
          className="editorial-image--strip"
          src="/images/odoo-inventory-overview.jpg"
          alt="The Odoo inventory interface, showing receipts, delivery orders, and manufacturing"
          caption="Receipts, deliveries, and manufacturing tracked in one operational view."
          credit="Odoo interface"
          variant="wide"
          sizes="100vw"
        />
      </section>

      <CTABlock
        eyebrow="A Specialized Partner"
        headline="Design the Whole System."
        body={<p>Shopify in front. Odoo behind. One delivery partner accountable for the connection.</p>}
        primaryAction={{ label: "Book a Strategy Call", href: "/contact" }}
        secondaryAction={{ label: "Review the Process", href: "/process" }}
      />
    </>
  );
}
