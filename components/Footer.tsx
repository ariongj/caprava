import Link from "next/link";
import { site } from "@/lib/config";
import { href } from "@/lib/format";
import type { Dictionary, Locale } from "@/lib/i18n";
import { EmailCapture } from "./Forms";
import { Icon } from "./Icon";
import { SparkleIcon } from "./Sparkle";
import { Logo } from "./Wordmark";

export function Footer({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <Link href={href(locale)} className="wordmark footer-logo" aria-label="CAPRAVA">
            <Logo />
          </Link>
          <p className="muted">{t.footer.tagline}</p>
          <p className="footer-from">
            <SparkleIcon className="inline-star" /> {t.footer.from}
          </p>
        </div>
        <div className="footer-news">
          <h3>{t.footer2.newsletter}</h3>
          <p className="muted small">{t.home.newsletterText}</p>
          <EmailCapture kind="newsletter" placeholder={t.home.newsletterPlaceholder} cta={t.home.newsletterCta} thanks={t.home.newsletterThanks} />
        </div>
      </div>
      <div className="container footer-grid">
        <div>
          <h3>{t.footer.shop}</h3>
          <Link href={href(locale, "/shop")}>{t.common.all}</Link>
          <Link href={href(locale, "/shop?for=her")}>{t.nav.her}</Link>
          <Link href={href(locale, "/shop?for=him")}>{t.nav.him}</Link>
          <Link href={href(locale, "/finder")}>{t.nav2.finder}</Link>
          <Link href={href(locale, "/wishlist")}>{t.nav2.wishlist}</Link>
        </div>
        <div>
          <h3>{t.footer.brand}</h3>
          <Link href={href(locale, "/story")}>{t.nav.story}</Link>
          <Link href={href(locale, "/partners")}>{t.nav.partners}</Link>
          <Link href={href(locale, "/contact")}>{t.nav.contact}</Link>
        </div>
        <div>
          <h3>{t.footer.help}</h3>
          <Link href={href(locale, "/faq")}>{t.nav2.faq}</Link>
          <Link href={href(locale, "/legal/shipping")}>{t.footer.shippingReturns}</Link>
          <Link href={href(locale, "/legal/terms")}>{t.footer.terms}</Link>
          <Link href={href(locale, "/legal/privacy")}>{t.footer.privacy}</Link>
        </div>
        <div>
          <h3>{t.footer2.follow}</h3>
          <div className="footer-social">
            <a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <Icon name="instagram" />
            </a>
            <a href={site.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok">
              <Icon name="tiktok" />
            </a>
            <a href={`mailto:${site.email}`} aria-label={site.email}>
              <Icon name="mail" />
            </a>
          </div>
          <a href={`mailto:${site.email}`} className="small">
            {site.email}
          </a>
          <span className="muted small footer-loc">
            <Icon name="pin" /> {site.location}
          </span>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>
          © {new Date().getFullYear()} CAPRAVA. {t.footer.rights}
        </p>
        <div className="footer-pay" aria-label={t.footer2.pay}>
          <span>
            <Icon name="cash" /> {t.checkout.cod}
          </span>
          <span>
            <Icon name="card" /> Visa · Mastercard
          </span>
        </div>
        <p className="footer-goat">
          <Icon name="goat" /> Greatest Of All Time
        </p>
      </div>
    </footer>
  );
}
