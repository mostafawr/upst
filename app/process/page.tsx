import {
  CTABlock,
  EditorialImage,
} from "@/components/EditorialPrimitives";
import { processPage, processSteps } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Process",
  description:
    "UPSTACK's six-stage process for discovering, architecting, designing, building, integrating, and growing Shopify and Odoo commerce systems.",
  path: "/process",
});

// One image per stage. Design and Build show real client storefronts; the
// remaining stages stay editorial because no client screenshot depicts them.
const processImages = [
  "/images/reports-desk.jpg",
  "/images/integration-cables.jpg",
  "/images/work-dress-code-collection.jpg",
  "/images/work-more-cottons-catalogue.jpg",
  "/images/odoo-operations.jpg",
  "/images/shopify-storefront.jpg",
];

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
            src="/images/integration-cables.jpg"
            alt="Structured cabling and technical equipment representing planned commerce infrastructure"
            caption="A clear sequence, with evidence improving at every stage."
            credit="Process / 01–06"
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
                  src={processImages[index]}
                  alt={`Illustration for the ${step.title.toLowerCase()} stage of UPSTACK's delivery process`}
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
