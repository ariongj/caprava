"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { site, shipping } from "@/lib/config";
import { fill } from "@/lib/i18n";
import { formatPrice, href } from "@/lib/format";
import { useCart } from "./CartProvider";
import { Icon, type IconName } from "./Icon";
import { useI18n } from "./I18nProvider";
import { LangSwitch } from "./LangSwitch";
import { SearchOverlay } from "./SearchOverlay";
import { useWishlist } from "./WishlistProvider";
import { Logo } from "./Wordmark";

export function Header() {
  const { locale, t } = useI18n();
  const { count, ready, setOpen } = useCart();
  const wishlist = useWishlist();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
  }, [menuOpen, searchOpen]);

  const left = [
    { href: href(locale, "/shop"), label: t.nav.shop },
    { href: href(locale, "/shop?for=her"), label: t.nav.her },
    { href: href(locale, "/shop?for=him"), label: t.nav.him },
    { href: href(locale, "/finder"), label: t.nav2.finder, optional: true },
  ];
  const right = [
    { href: href(locale, "/story"), label: t.nav.story },
    { href: href(locale, "/partners"), label: t.nav.partners },
    { href: href(locale, "/contact"), label: t.nav.contact, optional: true },
  ];
  const mobile: { href: string; label: string; icon: IconName }[] = [
    { href: href(locale, "/shop"), label: t.nav.shop, icon: "bag" },
    { href: href(locale, "/shop?for=her"), label: t.nav.her, icon: "floral" },
    { href: href(locale, "/shop?for=him"), label: t.nav.him, icon: "woody" },
    { href: href(locale, "/finder"), label: t.nav2.finder, icon: "compass" },
    { href: href(locale, "/wishlist"), label: t.nav2.wishlist, icon: "heart" },
    { href: href(locale, "/story"), label: t.nav.story, icon: "book" },
    { href: href(locale, "/partners"), label: t.nav.partners, icon: "star" },
    { href: href(locale, "/faq"), label: t.nav2.faq, icon: "sparkle" },
    { href: href(locale, "/contact"), label: t.nav.contact, icon: "mail" },
  ];
  const wishCount = wishlist.ready ? wishlist.slugs.length : 0;

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
            {left.map((l) => (
              <Link key={l.href} href={l.href} className={"optional" in l ? "nav-optional" : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href={href(locale)} className="wordmark" aria-label="CAPRAVA">
            <Logo />
          </Link>
          <div className="header-actions">
            <nav className="nav-desktop" aria-label="Brand">
              {right.map((l) => (
                <Link key={l.href} href={l.href} className={"optional" in l ? "nav-optional" : undefined}>
                  {l.label}
                </Link>
              ))}
            </nav>
            <LangSwitch />
            <button className="icon-button" onClick={() => setSearchOpen(true)} aria-label={t.nav2.search}>
              <Icon name="search" />
            </button>
            <Link href={href(locale, "/wishlist")} className="icon-button header-wish" aria-label={`${t.nav2.wishlist} (${wishCount})`}>
              <Icon name="heart" />
              {wishCount > 0 && <span className="cart-count">{wishCount}</span>}
            </Link>
            <button className="icon-button cart-button" onClick={() => setOpen(true)} aria-label={`${t.nav.cart} (${count})`}>
              <Icon name="bag" />
              {ready && count > 0 && <span className="cart-count">{count}</span>}
            </button>
          </div>
        </div>
      </header>
      <div className={`mobile-menu${menuOpen ? " is-open" : ""}`} aria-hidden={!menuOpen}>
        <nav aria-label="Mobile">
          {mobile.map((l) => (
            <Link key={l.href} href={l.href} tabIndex={menuOpen ? 0 : -1}>
              <Icon name={l.icon} />
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mobile-menu-foot">
          <a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" tabIndex={menuOpen ? 0 : -1}>
            <Icon name="instagram" />
          </a>
          <a href={site.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok" tabIndex={menuOpen ? 0 : -1}>
            <Icon name="tiktok" />
          </a>
          <a href={`mailto:${site.email}`} tabIndex={menuOpen ? 0 : -1}>
            <Icon name="mail" />
            {site.email}
          </a>
        </div>
      </div>
      <SearchOverlay open={searchOpen} onClose={closeSearch} />
    </>
  );
}
