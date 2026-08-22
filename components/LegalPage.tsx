import type { ReactNode } from "react";
import { legalInfo } from "@/lib/content";

export interface LegalSection {
  heading: string;
  body: ReactNode;
}

export interface LegalPageProps {
  eyebrow: string;
  title: string;
  intro: string;
  sections: readonly LegalSection[];
}

/** Shared editorial layout for the privacy and terms documents. */
export default function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
}: LegalPageProps) {
  return (
    <>
      <header className="legal-hero">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="page-title">{title}</h1>
        <p className="lede legal-hero__lede">{intro}</p>
        <p className="microcopy legal-hero__meta">
          Last updated {legalInfo.lastUpdated} · {legalInfo.entityName} ·{" "}
          {legalInfo.location}
        </p>
      </header>

      <section className="section legal-body">
        {sections.map((section, index) => (
          <article className="legal-body__section" key={section.heading}>
            <span className="card-label legal-body__index">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="legal-body__content">
              <h2 className="subsection-title">{section.heading}</h2>
              {section.body}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
