"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site, shipping } from "@/lib/config";
import { fill } from "@/lib/i18n";
import { formatPrice, href } from "@/lib/format";
import { useCart } from "./CartProvider";
import { useI18n } from "./I18nProvider";
import { LangSwitch } from "./LangSwitch";

export function Header() {
  const { locale, t } = useI18n();
  const { count, ready, setOpen } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const links = [
    { href: href(locale, "/shop"), label: t.nav.shop },
    { href: href(locale, "/shop?for=her"), label: t.nav.her },
    { href: href(locale, "/shop?for=him"), label: t.nav.him },
    { href: href(locale, "/story"), label: t.nav.story },
    { href: href(locale, "/partners"), label: t.nav.partners },
    { href: href(locale, "/contact"), label: t.nav.contact },
  ];

  return (
    <>
      <div className="announce">
        {site.preorder ? t.preorderNotice : fill(t.announce, { amount: formatPrice(shipping.freeFrom, locale) })}
      </div>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="container header-inner">
          <button
            className="icon-button menu-toggle"
            aria-label={menuOpen ? t.nav.close : t.nav.menu}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className={`burger${menuOpen ? " is-open" : ""}`} />
          </button>
          <nav className="nav-desktop" aria-label="Main">
            {links.slice(0, 3).map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href={href(locale)} className="wordmark" aria-label="CAPRAVA">
            CAPRAVA
          </Link>
          <div className="header-actions">
            <nav className="nav-desktop" aria-label="Brand">
              {links.slice(3).map((l) => (
                <Link key={l.href} href={l.href}>
                  {l.label}
                </Link>
              ))}
            </nav>
            <LangSwitch />
            <button className="icon-button cart-button" onClick={() => setOpen(true)} aria-label={`${t.nav.cart} (${count})`}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 8h12l-1 12H7L6 8Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              {ready && count > 0 && <span className="cart-count">{count}</span>}
            </button>
          </div>
        </div>
      </header>
      <div className={`mobile-menu${menuOpen ? " is-open" : ""}`} aria-hidden={!menuOpen}>
        <nav aria-label="Mobile">
          {links.map((l) => (
            <Link key={l.href} href={l.href} tabIndex={menuOpen ? 0 : -1}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
