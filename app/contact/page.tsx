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
            src="/images/reports-desk.jpg"
            alt="Project reports and planning materials prepared for a commerce systems review"
            caption="A focused first conversation begins with useful context."
            credit="Project Brief / Edition 01"
            priority
            sizes="(max-width: 960px) 100vw, 52vw"
          />
        </div>
      </header>

      <section className="section contact-layout" aria-labelledby="project-brief-title">
        <aside className="contact-sidebar">
          <div className="contact-sidebar__sticky">
            <p className="eyebrow">Before the Call</p>
            <h2 className="subsection-title" id="project-brief-title">
              {contactPage.aside.title}
            </h2>
            <p className="muted">
              A concise brief helps us understand whether the priority begins in the
              storefront, the operation, or the connection between them.
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
            <p className="microcopy">
              Do not include passwords, credentials, or sensitive customer data.
            </p>
          </div>
        </aside>

        <div className="contact-form-wrap">
          <div className="section-heading-row contact-form-heading">
            <div>
              <p className="eyebrow">Project Brief</p>
              <h2 className="section-title">Tell Us What Must Work Better.</h2>
            </div>
            <p className="muted">
              Fields marked with an asterisk are required. Phone and budget are optional.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
