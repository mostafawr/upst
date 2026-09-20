import {
  CTABlock,
  EditorialImage,
} from "@/components/EditorialPrimitives";
import { processPage, processSteps } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "How We Build Shopify & Odoo Systems",
  description:
    "UPSTACK's six-stage process for discovering, architecting, designing, building, integrating, and growing Shopify and Odoo commerce systems.",
  path: "/process",
});

// One image per stage: real client storefronts for the customer-facing stages,
// the Odoo interface for the operational ones. Alt text describes the actual
// screenshot rather than the stage, so it is useful to a screen reader.
const processStageImages = [
  { src: "/images/odoo-sales-orders.jpg", mobileSrc: undefined, mobileKind: undefined, alt: "A list of sales orders in Odoo, with customer, salesperson, total, and status" },
  { src: "/images/odoo-inventory-overview.jpg", mobileSrc: "/images/mobile/odoo-delivery-orders.jpg", mobileKind: "panel" as const, alt: "The Odoo inventory overview, showing receipts, delivery orders, and manufacturing" },
  { src: "/images/work-dress-code-collection.jpg", mobileSrc: "/images/mobile/dress-code-collection.jpg", mobileKind: "phone" as const, alt: "The Dress Code collection page built by UPSTACK" },
  { src: "/images/work-more-cottons-catalogue.jpg", mobileSrc: "/images/mobile/more-cottons-catalogue.jpg", mobileKind: "phone" as const, alt: "The More Cottons product catalogue, with filtering and sort" },
  { src: "/images/odoo-accounting-dashboard.jpg", mobileSrc: "/images/mobile/odoo-bank.jpg", mobileKind: "panel" as const, alt: "The Odoo accounting dashboard, showing sales, purchases, and bank reconciliation" },
  { src: "/images/work-surur-architecture.jpg", mobileSrc: "/images/mobile/surur-collection.jpg", mobileKind: "phone" as const, alt: "The Surur collection page, with filters for type, stock, price, fabric, and finish" },
]
export default function ProcessPage() {
  return (
    <>
      <header className="page-hero">
        <div className="page-hero__copy">
          <div>
            <p className="eyebrow">{processPage.eyebrow}</p>
            <h1 className="page-title">From Strategy to Scale.</h1>
          </div>
          <p className="lede">{processPage.description}</p>
        </div>
        <div className="page-hero__image">
          <EditorialImage
            className="editorial-image--hero"
            src="/images/work-dress-code-best-sellers.jpg"
            mobileSrc="/images/mobile/dress-code-best-sellers.jpg"
            alt="The Dress Code best sellers collection, with availability, price, and size filters"
            caption="A clear sequence, with evidence improving at every stage."
            credit="Dress Code / Shopify"
            priority
            sizes="(max-width: 960px) 100vw, 52vw"
          />
        </div>
      </header>

      <section className="section section--ruled" aria-labelledby="process-ledger-title">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">The Delivery Ledger</p>
            <h2 className="section-title" id="process-ledger-title">
              Six Stages. One Throughline.
            </h2>
          </div>
          <p className="body-large muted">{processPage.note}</p>
        </div>

        <div className="process-ledger">
          {processSteps.map((step, index) => (
            <article className="process-step" id={step.id} key={step.id}>
              <span className="process-step__number">{step.number}</span>
              <div className="process-step__title">
                <h3>{step.title}.</h3>
              </div>
              <div className="process-step__copy">
                <div>
                  <p className="body-large">{step.summary}</p>
                  <p className="section-label">Working Outputs</p>
                  <ul className="deliverable-list">
                    {step.outputs.map((output) => (
                      <li key={output}>{output}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="process-step__image">
                <EditorialImage
                  src={processStageImages[index].src}
                  mobileSrc={processStageImages[index].mobileSrc}
                  mobileKind={processStageImages[index].mobileKind}
                  alt={processStageImages[index].alt}
                  sizes="(max-width: 720px) 100vw, (max-width: 960px) 70vw, 30vw"
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--ruled" aria-labelledby="delivery-principles-title">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Delivery Principles</p>
            <h2 className="section-title" id="delivery-principles-title">
              No Black Box.
            </h2>
          </div>
          <p className="body-large muted">
            The work should leave the team with a stronger system and a clearer
            understanding of how it operates.
          </p>
        </div>
        <div className="principle-grid">
          <article className="principle-card">
            <span className="card-label">01 / Scope</span>
            <h3>Visible Decisions</h3>
            <p>Priorities, tradeoffs, dependencies, and changes are documented as the work moves.</p>
          </article>
          <article className="principle-card">
            <span className="card-label">02 / Quality</span>
            <h3>Test the Handoffs</h3>
            <p>The seams between storefront, operations, data, and people receive deliberate attention.</p>
          </article>
          <article className="principle-card">
            <span className="card-label">03 / Adoption</span>
            <h3>Build for the Team</h3>
            <p>Documentation, training, and maintainability are part of delivery—not an afterthought.</p>
          </article>
          <article className="principle-card">
            <span className="card-label">04 / Growth</span>
            <h3>Measure What Matters</h3>
            <p>The next improvement should be informed by evidence and connected to a commercial objective.</p>
          </article>
        </div>
      </section>

      <CTABlock
        eyebrow="Begin with Discovery"
        headline="Bring Us the Constraint."
        body={<p>We will map the customer journey, operational reality, and systems required to move forward with confidence.</p>}
        primaryAction={{ label: "Book a Strategy Call", href: "/contact" }}
        secondaryAction={{ label: "Review Capabilities", href: "/capabilities" }}
      />
    </>
  );
}
