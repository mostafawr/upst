import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { legalInfo, legalPages } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description: legalPages.terms.description,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow={legalPages.terms.eyebrow}
      title={legalPages.terms.title}
      intro={legalPages.terms.description}
      sections={[
        {
          heading: "About These Terms",
          body: (
            <p>
              This website is operated by {legalInfo.entityName}. By using it you
              accept these terms. If you do not accept them, please do not use
              the site.
            </p>
          ),
        },
        {
          heading: "What This Site Is",
          body: (
            <p>
              This site describes services we offer: Shopify storefront design
              and development, Odoo implementation, platform integration, and
              ongoing commerce optimization. Nothing on it is a binding offer, a
              quotation, or a guarantee of a particular commercial outcome. Any
              engagement is governed by a separate written agreement.
            </p>
          ),
        },
        {
          heading: "Client Work Shown Here",
          body: (
            <p>
              The storefronts shown on the{" "}
              <Link className="legal-link" href="/work">
                work
              </Link>{" "}
              page are live sites that UPSTACK built or operates. The brands
              named there own their own trademarks, brand assets, and product
              imagery; they are shown to identify the work, not to imply that
              those brands endorse UPSTACK. If you are a rights holder and want
              a reference removed, contact us and we will remove it.
            </p>
          ),
        },
        {
          heading: "Enquiries",
          body: (
            <p>
              Sending an enquiry does not create a contract or a professional
              relationship. Do not send confidential information, credentials,
              or third-party personal data through the form. How we handle what
              you do send is set out in our{" "}
              <Link className="legal-link" href="/privacy">
                privacy policy
              </Link>
              .
            </p>
          ),
        },
        {
          heading: "Our Content",
          body: (
            <p>
              The text, layout, design system, and code of this site belong to
              UPSTACK. You may read, link to, and quote it with attribution. You
              may not republish it wholesale or present it as your own.
            </p>
          ),
        },
        {
          heading: "Third-Party Names",
          body: (
            <p>
              Shopify and Odoo are trademarks of their respective owners. UPSTACK
              is an independent practice and is not affiliated with, endorsed
              by, or acting as an agent of either company.
            </p>
          ),
        },
        {
          heading: "Liability",
          body: (
            <p>
              We keep this site accurate but we do not warrant that it is
              complete, current, or uninterrupted. To the extent permitted by
              law, we are not liable for loss arising from reliance on the
              website&rsquo;s general information. Nothing here limits liability
              that cannot lawfully be limited.
            </p>
          ),
        },
        {
          heading: "Governing Law",
          body: (
            <p>
              These terms are governed by the laws of {legalInfo.jurisdiction},
              and the courts of {legalInfo.jurisdiction} have jurisdiction over
              any dispute arising from them.
            </p>
          ),
        },
      ]}
    />
  );
}
