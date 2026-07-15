import {
  CTABlock,
  EditorialImage,
} from "@/components/EditorialPrimitives";
import { workEntries, workPage } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Work",
  description:
    "Concept case studies and representative Shopify, Odoo, integration, data, and optimization engagements—presented without fabricated results.",
  path: "/work",
});

const workImages: Record<string, string> = {
  "connected-commerce-foundation": "/images/hero-workstation.jpg",
  "storefront-performance-system": "/images/shopify-storefront.jpg",
  "operational-control-layer": "/images/odoo-operations.jpg",
  "commerce-intelligence-layer": "/images/reports-desk.jpg",
};

function MetaList({ label, items }: { label: string; items: readonly string[] }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{items.join(" · ")}</dd>
    </div>
  );
}

export default function WorkPage() {
  const featured =
    workEntries.find((entry) => "featured" in entry && entry.featured) ?? workEntries[0];
  const projects = workEntries.filter((entry) => entry.id !== featured.id);

  return (
    <>
      <header className="page-hero">
        <div className="page-hero__copy">
          <div>
            <p className="eyebrow">{workPage.eyebrow}</p>
            <h1 className="page-title">Selected Systems.</h1>
          </div>
          <p className="lede">{workPage.description}</p>
        </div>
        <div className="page-hero__image">
          <EditorialImage
            className="editorial-image--hero"
            src="/images/reports-desk.jpg"
            alt="Printed ecommerce and operational reports arranged beside office equipment"
            caption="Work is described by scope and outcome area—not invented numbers."
            credit="Selected Work / Edition 01"
            priority
            sizes="(max-width: 960px) 100vw, 52vw"
          />
        </div>
      </header>

      <section className="section section--ruled" aria-labelledby="featured-case-title">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">The Lead Record</p>
            <h2 className="section-title" id="featured-case-title">
              One Connected Foundation.
            </h2>
          </div>
          <p className="body-large muted">{workPage.disclosure}</p>
        </div>

        <article className="featured-case">
          <div className="featured-case__visual">
            <EditorialImage
              className="editorial-image--wide"
              src={workImages[featured.id]}
              alt="Vintage desktop workstation representing a connected Shopify and Odoo system"
              caption={featured.disclosure}
              credit={featured.category}
              sizes="(max-width: 960px) 100vw, 68vw"
            />
          </div>
          <div className="featured-case__copy">
            <p className="card-label">Featured / {featured.disclosure}</p>
            <h3 className="subsection-title">{featured.title}</h3>
            <p className="body-large">{featured.summary}</p>
            <p className="muted">{featured.evidenceNote}</p>
            <dl className="case-meta-grid">
              <MetaList label={workPage.servicesLabel} items={featured.services} />
              <MetaList label={workPage.outcomeLabel} items={featured.outcomeAreas} />
              <MetaList label={workPage.technologyLabel} items={featured.technology} />
              <MetaList label="Category" items={[featured.category]} />
            </dl>
          </div>
        </article>
      </section>

      <section className="section section--ruled" aria-labelledby="project-grid-title">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Additional Records</p>
            <h2 className="section-title" id="project-grid-title">
              Systems by Scope.
            </h2>
          </div>
          <p className="body-large muted">
            Each record makes the service mix, technology, and intended outcome areas
            explicit so the nature of the engagement is easy to understand.
          </p>
        </div>

        <div className="case-study-grid">
          {projects.map((project) => (
            <article className="case-study-card" key={project.id}>
              <div className="case-study-card__content">
                <span className="card-label">
                  {project.disclosure} / {project.category}
                </span>
                <h3 className="subsection-title">{project.title}</h3>
                <p>{project.summary}</p>
                <p className="microcopy muted">{project.evidenceNote}</p>
                <ul className="tag-list" aria-label={`${project.title} technologies`}>
                  {project.technology.map((technology) => (
                    <li className="tag" key={technology}>
                      {technology}
                    </li>
                  ))}
                </ul>
                <div>
                  <p className="section-label">Services</p>
                  <ul className="bullet-list case-study-card__services">
                    {project.services.map((service) => (
                      <li key={service}>{service}</li>
                    ))}
                  </ul>
                  <p className="section-label">Outcome Areas</p>
                  <ul className="bullet-list">
                    {project.outcomeAreas.map((outcome) => (
                      <li key={outcome}>{outcome}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <EditorialImage
                src={workImages[project.id]}
                alt={`Editorial image representing ${project.category.toLowerCase()}`}
                sizes="(max-width: 720px) 100vw, (max-width: 1180px) 50vw, 25vw"
              />
            </article>
          ))}
        </div>
      </section>

      <section className="section section--ruled" aria-labelledby="outcomes-title">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">How Work Is Evaluated</p>
            <h2 className="section-title" id="outcomes-title">
              Evidence Before Claims.
            </h2>
          </div>
          <p className="body-large muted">
            Real engagements should begin with a measurement plan, baseline, and clear
            definition of what improvement means for the business.
          </p>
        </div>
        <div className="system-map">
          <article className="system-map__item">
            <span className="card-label">Commerce</span>
            <h3 className="subsection-title">Customer Experience</h3>
            <p>Discovery, clarity, speed, checkout confidence, and conversion quality.</p>
          </article>
          <article className="system-map__item">
            <span className="card-label">Operations</span>
            <h3 className="subsection-title">Control & Efficiency</h3>
            <p>Process consistency, data quality, visibility, and dependable execution.</p>
          </article>
          <article className="system-map__item">
            <span className="card-label">Growth</span>
            <h3 className="subsection-title">Commercial Yield</h3>
            <p>Margin, customer value, inventory productivity, and scalable improvement.</p>
          </article>
        </div>
      </section>

      <CTABlock
        eyebrow="Your Record"
        headline="Define the Next Engagement."
        body={<p>Bring the system, the constraint, and the business priority. We will help establish the right scope.</p>}
        primaryAction={{ label: "Book a Strategy Call", href: "/contact" }}
        secondaryAction={{ label: "Review Capabilities", href: "/capabilities" }}
      />
    </>
  );
}
