import ContactForm from "@/components/ContactForm";
import { EditorialImage } from "@/components/EditorialPrimitives";
import { contactPage } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Book a Strategy Call",
  description:
    "Tell UPSTACK about your Shopify, Odoo, platform integration, conversion optimization, or ongoing systems support priorities.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <header className="page-hero">
        <div className="page-hero__copy">
          <div>
            <p className="eyebrow">{contactPage.eyebrow}</p>
            <h1 className="page-title">Start with the System.</h1>
          </div>
          <p className="lede">{contactPage.description}</p>
        </div>
        <div className="page-hero__image">
          <EditorialImage
            className="editorial-image--hero"
            src="/images/work-more-cottons-bathrobes.jpg"
            mobileSrc="/images/mobile/more-cottons-bathrobes.jpg"
            alt="The More Cottons bathrobe collection, with filtering, compare, and sort"
            caption="Work we have shipped. Tell us what you need next."
            credit="More Cottons / Shopify"
            priority
            sizes="(max-width: 960px) 100vw, 52vw"
          />
        </div>
      </header>

      <section className="section contact-layout" aria-labelledby="project-brief-title">
        <aside className="contact-sidebar">
          <div className="contact-sidebar__sticky">
            <p className="eyebrow">After You Send</p>
            <h2 className="subsection-title" id="project-brief-title">
              {contactPage.aside.title}
            </h2>
            <p className="muted">
              We read every enquiry ourselves. No queue, no gatekeeper, no
              automated qualification sequence.
            </p>
            <div className="editorial-list">
              {contactPage.aside.items.map((item, index) => (
                <div className="editorial-list__item" key={item}>
                  <span className="card-label">0{index + 1}</span>
                  <div>
                    <h3>{item}</h3>
                  </div>
                </div>
              ))}
            </div>
            <p className="microcopy">{contactPage.form.privacyNote}</p>
          </div>
        </aside>

        <div className="contact-form-wrap">
          <div className="section-heading-row contact-form-heading">
            <div>
              <p className="eyebrow">Enquiry</p>
              <h2 className="section-title">Tell Us What Must Work Better.</h2>
            </div>
            <p className="muted">{contactPage.form.description}</p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
