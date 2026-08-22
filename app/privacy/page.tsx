import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { legalInfo, legalPages } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: legalPages.privacy.description,
  path: "/privacy",
});

const contactLine = legalInfo.contactEmail ? (
  <>
    email{" "}
    <a className="legal-link" href={`mailto:${legalInfo.contactEmail}`}>
      {legalInfo.contactEmail}
    </a>
  </>
) : (
  <>
    send a request through the{" "}
    <Link className="legal-link" href="/contact">
      enquiry form
    </Link>
  </>
);

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow={legalPages.privacy.eyebrow}
      title={legalPages.privacy.title}
      intro={legalPages.privacy.description}
      sections={[
        {
          heading: "Who We Are",
          body: (
            <p>
              {legalInfo.entityName} (&ldquo;UPSTACK&rdquo;, &ldquo;we&rdquo;)
              designs Shopify storefronts and implements Odoo operational
              systems. We operate from {legalInfo.location} and are the
              controller of the personal data described in this policy.
            </p>
          ),
        },
        {
          heading: "What We Collect",
          body: (
            <>
              <p>
                When you send an enquiry, we collect only what the form asks
                for:
              </p>
              <ul className="legal-list">
                <li>Your name</li>
                <li>Your phone number</li>
                <li>Your email address</li>
                <li>Your indicated budget range</li>
                <li>Your website address, if you choose to provide it</li>
                <li>
                  Whatever you write in the free-text field, if you choose to
                  write anything
                </li>
              </ul>
              <p>
                We do not ask for, and you should not send, passwords, API
                credentials, payment details, or your own customers&rsquo;
                personal data.
              </p>
            </>
          ),
        },
        {
          heading: "Why We Collect It",
          body: (
            <p>
              We use your contact details for one purpose: to respond to your
              enquiry and to hold the conversation you asked for. We do not sell
              your data, we do not share it with advertisers, and we do not add
              you to a marketing list without asking you first.
            </p>
          ),
        },
        {
          heading: "Analytics And Cookies",
          body: (
            <>
              <p>
                This site uses privacy-oriented product analytics (PostHog) and,
                where enabled, Google Analytics 4, to understand which pages
                people read and whether the enquiry form works. These tools set
                cookies or equivalent local storage and record technical data
                such as your approximate location derived from IP address,
                device type, browser, referring page, and the pages you view.
              </p>
              <p>
                We use this in aggregate to improve the site. We do not use it to
                build advertising profiles of individuals. You can block these
                tools with any standard browser privacy setting, content
                blocker, or a Global Privacy Control signal, and the site will
                continue to work normally.
              </p>
            </>
          ),
        },
        {
          heading: "Where It Is Stored",
          body: (
            <>
              <p>
                Enquiries are stored in a Cloudflare D1 database and forwarded to
                us by email. This means your data is processed by our
                infrastructure and email providers acting on our instructions.
                Data may be processed outside {legalInfo.jurisdiction}, including
                in the United States and the European Union.
              </p>
              <p>
                We keep enquiries for as long as the commercial conversation is
                live, and for up to 24 months afterwards so we can pick the
                thread back up. After that we delete them.
              </p>
            </>
          ),
        },
        {
          heading: "Your Rights",
          body: (
            <p>
              You can ask us for a copy of the data we hold about you, ask us to
              correct it, or ask us to delete it. To do any of that, {contactLine}
              . We will action the request within 30 days and we will not ask you
              to justify it.
            </p>
          ),
        },
        {
          heading: "Changes",
          body: (
            <p>
              If this policy changes in a way that affects what we do with your
              data, we will update the date at the top of this page. Continued
              use of the site after a change means you accept the updated
              policy.
            </p>
          ),
        },
      ]}
    />
  );
}
