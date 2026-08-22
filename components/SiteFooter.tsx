import Link from "next/link";
import { ArrowGlyph, Rule } from "./EditorialPrimitives";

const FOOTER_LINKS = [
  { href: "/work", label: "Work" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/process", label: "Process" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Book a Call" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Rule className="site-footer__rule" />

      <div className="site-footer__primary">
        <div className="site-footer__brand-block">
          <Link className="site-footer__brand" href="/" aria-label="Upstack home">
            UPSTACK
          </Link>
          <p className="site-footer__positioning">
            Shopify storefronts that convert. Odoo systems that operate the
            business.
          </p>
        </div>

        <nav className="site-footer__navigation" aria-label="Footer navigation">
          <ul className="site-footer__nav-list">
            {FOOTER_LINKS.map((item) => (
              <li className="site-footer__nav-item" key={item.href}>
                <Link className="site-footer__nav-link" href={item.href}>
                  <span>{item.label}</span>
                  {item.href === "/contact" ? <ArrowGlyph /> : null}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-footer__callout">
          <p className="site-footer__callout-copy">
            Systems that connect. Data that informs. Operations that scale.
          </p>
          <Link className="site-footer__callout-link" href="/contact">
            <span>Book a Strategy Call</span>
            <ArrowGlyph />
          </Link>
        </div>
      </div>

      <Rule className="site-footer__rule" />

      <div className="site-footer__legal">
        <span>Upstack Commerce Systems</span>
        <nav className="site-footer__legal-links" aria-label="Legal">
          <Link className="site-footer__legal-link" href="/privacy">
            Privacy Policy
          </Link>
          <Link className="site-footer__legal-link" href="/terms">
            Terms of Use
          </Link>
        </nav>
        <span>© {new Date().getFullYear()} Upstack</span>
      </div>
    </footer>
  );
}

export default SiteFooter;

