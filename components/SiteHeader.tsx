"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowGlyph } from "./EditorialPrimitives";

interface NavigationItem {
  href: string;
  label: string;
  callToAction?: boolean;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  { href: "/work", label: "Work" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/process", label: "Process" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Book a Call", callToAction: true },
];

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function isCurrentRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface NavigationLinksProps {
  pathname: string;
  mobile?: boolean;
  onNavigate?: () => void;
}

function NavigationLinks({
  pathname,
  mobile = false,
  onNavigate,
}: NavigationLinksProps) {
  return (
    <ul className="site-header__nav-list">
      {NAVIGATION_ITEMS.map((item) => {
        const current = isCurrentRoute(pathname, item.href);

        return (
          <li className="site-header__nav-item" key={item.href}>
            <Link
              aria-current={current ? "page" : undefined}
              className={joinClasses(
                "site-header__nav-link",
                item.callToAction && "site-header__nav-link--cta",
                current && "site-header__nav-link--current",
              )}
              href={item.href}
              onClick={mobile ? onNavigate : undefined}
            >
              <span>{item.label}</span>
              {item.callToAction ? <ArrowGlyph /> : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuState, setMenuState] = useState({
    open: false,
    pathname,
  });
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const menuOpen = menuState.open && menuState.pathname === pathname;

  const closeMenu = useCallback((returnFocus = false) => {
    setMenuState({ open: false, pathname });
    if (returnFocus) {
      requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const main = document.getElementById("main-content");
    const footer = document.querySelector<HTMLElement>(".site-footer");
    main?.setAttribute("inert", "");
    footer?.setAttribute("inert", "");

    const frame = requestAnimationFrame(() => {
      mobileNavRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
        return;
      }

      if (event.key === "Tab") {
        const links = Array.from(
          mobileNavRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [],
        );
        const focusable = [menuButtonRef.current, ...links].filter(
          (item): item is HTMLAnchorElement | HTMLButtonElement => item !== null,
        );
        const currentIndex = focusable.indexOf(
          document.activeElement as HTMLAnchorElement | HTMLButtonElement,
        );

        if (focusable.length === 0) return;

        if (event.shiftKey && currentIndex <= 0) {
          event.preventDefault();
          focusable[focusable.length - 1]?.focus();
        } else if (!event.shiftKey && currentIndex === focusable.length - 1) {
          event.preventDefault();
          focusable[0]?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("site-menu-open");

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("site-menu-open");
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
    };
  }, [closeMenu, menuOpen]);

  return (
    <header className="site-header">
      <div className="site-header__metadata" aria-label="Upstack details">
        <span>Upstack Commerce Systems</span>
        <span>Shopify + Odoo</span>
        <span>Edition 01</span>
      </div>

      <div className="site-header__masthead-row">
        <Link className="site-header__masthead" href="/" aria-label="Upstack home">
          UPSTACK
        </Link>
      </div>

      <div className="site-header__navigation-row">
        <nav
          aria-label="Primary navigation"
          className="site-header__nav site-header__nav--desktop"
        >
          <NavigationLinks pathname={pathname} />
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          className="site-header__menu-button"
          aria-controls="site-header-mobile-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMenuState({ open: !menuOpen, pathname })}
        >
          <span className="site-header__menu-label" aria-hidden="true">
            {menuOpen ? "Close" : "Menu"}
          </span>
          <span className="site-header__menu-icon" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>

      <nav
        ref={mobileNavRef}
        id="site-header-mobile-navigation"
        aria-label="Mobile navigation"
        className="site-header__nav site-header__nav--mobile"
        data-open={menuOpen ? "true" : "false"}
        hidden={!menuOpen}
      >
        <NavigationLinks
          pathname={pathname}
          mobile
          onNavigate={() => closeMenu(false)}
        />
      </nav>
    </header>
  );
}

export default SiteHeader;
