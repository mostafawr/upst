import Link from "next/link";
import {
  ArrowGlyph,
  CTABlock,
  EditorialImage,
  ProofBand,
} from "@/components/EditorialPrimitives";
import {
  coreCapabilities,
  globalCta,
  homePage,
  processSteps,
  proofCategories,
  workEntries,
} from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Systems That Sell",
  description:
    "UPSTACK builds Shopify storefronts that convert, Odoo systems that run operations, and connected commerce infrastructure designed for growth.",
  path: "/",
});

const workImages: Record<string, string> = {
  "more-cottons": "/images/work-more-cottons.jpg",
  surur: "/images/work-surur.jpg",
  "dress-code": "/images/work-dress-code.jpg",
};

export default function Home() {
  const featured =
    workEntries.find((entry) => "featured" in entry && entry.featured) ?? workEntries[0];
  const secondaryWork = workEntries.filter((entry) => entry.id !== featured.id).slice(0, 3);

  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero__copy">
          <div>
            <p className="eyebrow">{homePage.hero.eyebrow}</p>
            <p className="lede">{homePage.hero.description}</p>
            <div className="button-row">
              <Link className="button button--filled" href={homePage.hero.primaryCta.href}>
                {homePage.hero.primaryCta.label} <ArrowGlyph />
              </Link>
              <Link className="text-link" href={homePage.hero.secondaryCta.href}>
                {homePage.hero.secondaryCta.label} <ArrowGlyph />
              </Link>
            </div>
          </div>

          <div className="home-hero__services" aria-label="UPSTACK service pillars">
            {homePage.hero.pillars.map((pillar, index) => (
              <div className="home-hero__service" key={pillar}>
                <span className="service-index">0{index + 1}</span>
                <span>{pillar}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="home-hero__visual">
          <div className="home-hero__statement">
            <h1 className="display-title" id="home-title">
              Systems
              <br />
              That Sell.
            </h1>
            <span className="microcopy">Shopify + Odoo / Connected</span>
          </div>
          <EditorialImage
            className="editorial-image--hero"
            src="/images/work-surur-product.jpg"
            alt="The Surur product page built by UPSTACK, showing variants and room context"
            caption="A Surur product page: variants, room context, and a clear path to checkout."
            credit="Surur / Shopify"
            sizes="(max-width: 960px) 100vw, 68vw"
            priority
          />
        </div>
      </section>

      <ProofBand
        items={proofCategories.map((item) => ({
          label: item.title,
          detail: item.description,
        }))}
        label="UPSTACK areas of expertise"
      />

      <section className="section section--ruled" aria-labelledby="system-heading">
        <div className="editorial-intro">
          <div className="editorial-intro__statement">
            <p className="eyebrow">One Commerce System</p>
            <h2 className="pull-quote" id="system-heading">
              The storefront earns the order. The operation keeps the promise.
            </h2>
          </div>
          <div className="editorial-intro__details">
            <p>
              Shopify is the customer-facing commerce layer. Odoo is the operational
              layer behind sales, inventory, finance, fulfillment, and reporting.
            </p>
            <p>
              UPSTACK designs both—and the connection between them—so growth does not
              create a larger gap between experience and execution.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--ruled" aria-labelledby="capabilities-heading">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">{homePage.capabilitiesIntro.eyebrow}</p>
            <h2 className="section-title" id="capabilities-heading">
              {homePage.capabilitiesIntro.title}
            </h2>
          </div>
          <p className="body-large muted">{homePage.capabilitiesIntro.description}</p>
        </div>

        <div className="capability-grid">
          {coreCapabilities.map((capability) => (
            <article className="capability-card" key={capability.id}>
              <span className="capability-card__index">{capability.index}</span>
              <h3 className="capability-card__title">{capability.title}</h3>
              <p className="capability-card__description">{capability.description}</p>
              <Link className="text-link" href={capability.href}>
                Examine Capability <ArrowGlyph />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--ruled" aria-labelledby="work-heading">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">{homePage.featuredWork.eyebrow}</p>
            <h2 className="section-title" id="work-heading">
              Live Systems.
            </h2>
          </div>
          <p className="body-large muted">
            Storefronts and operations running in production today. Every entry
            links to the live site.
          </p>
        </div>

        <article className="selected-work">
          <div className="selected-work__visual">
            <EditorialImage
              className="editorial-image--wide"
              src={workImages[featured.id]}
              alt={`The ${featured.title} storefront built by UPSTACK`}
              caption={featured.category}
              credit="Live in production"
              sizes="(max-width: 960px) 100vw, 66vw"
            />
          </div>
          <div className="selected-work__copy">
            <p className="card-label">Featured / {featured.category}</p>
            <h3 className="subsection-title">{featured.title}</h3>
            <p>{featured.summary}</p>
            <ul className="tag-list" aria-label="Featured engagement services">
              {featured.services.slice(0, 4).map((service) => (
                <li className="tag" key={service}>
                  {service}
                </li>
              ))}
            </ul>
            <Link className="text-link" href="/work">
              See the Build <ArrowGlyph />
            </Link>
          </div>
        </article>

        <div className="work-grid">
          {secondaryWork.map((entry) => (
            <article className="work-card" key={entry.id}>
              <span className="card-label">{entry.category}</span>
              <EditorialImage
                className="work-card__image editorial-image--card"
                src={workImages[entry.id]}
                alt={`The ${entry.title} storefront built by UPSTACK`}
                sizes="(max-width: 720px) 100vw, (max-width: 960px) 50vw, 33vw"
              />
              <h3 className="work-card__title">{entry.title}</h3>
              <p className="work-card__summary">{entry.summary}</p>
              <Link className="text-link" href="/work">
                Review the Build <ArrowGlyph />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--ruled" aria-labelledby="process-heading">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">How We Work</p>
            <h2 className="section-title" id="process-heading">
              From Strategy to Scale.
            </h2>
          </div>
          <p className="body-large muted">
            A disciplined process joins commerce experience, operational design, and
            technical delivery without losing sight of the commercial objective.
          </p>
        </div>
        <div className="process-preview">
          {processSteps.map((step) => (
            <div className="process-preview__row" key={step.id}>
              <span className="process-preview__index">{step.number}</span>
              <h3 className="process-preview__title">{step.title}</h3>
              <p className="process-preview__summary">{step.summary}</p>
            </div>
          ))}
        </div>
        <div className="button-row">
          <Link className="text-link" href="/process">
            Read the Process <ArrowGlyph />
          </Link>
        </div>
      </section>

      <CTABlock
        eyebrow={globalCta.eyebrow}
        headline={globalCta.title}
        body={<p>{globalCta.description}</p>}
        primaryAction={globalCta.primary}
        secondaryAction={globalCta.secondary}
      />
    </>
  );
}
