import Link from "next/link";
import { site } from "@/lib/config";
import { href } from "@/lib/format";
import type { Dictionary, Locale } from "@/lib/i18n";
import { SparkleIcon } from "./Sparkle";

export function Footer({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href={href(locale)} className="wordmark">
            CAPRAVA
          </Link>
          <p className="muted">{t.footer.tagline}</p>
          <p className="footer-from">
            <SparkleIcon className="inline-star" /> {t.footer.from}
          </p>
        </div>
        <div>
          <h3>{t.footer.shop}</h3>
          <Link href={href(locale, "/shop")}>{t.common.all}</Link>
          <Link href={href(locale, "/shop?for=her")}>{t.nav.her}</Link>
          <Link href={href(locale, "/shop?for=him")}>{t.nav.him}</Link>
          <Link href={href(locale, "/shop/souverian")}>Souverian</Link>
          <Link href={href(locale, "/shop/tittara")}>Tittara</Link>
        </div>
        <div>
          <h3>{t.footer.brand}</h3>
          <Link href={href(locale, "/story")}>{t.nav.story}</Link>
          <Link href={href(locale, "/partners")}>{t.nav.partners}</Link>
          <Link href={href(locale, "/contact")}>{t.nav.contact}</Link>
          <a href={site.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href={site.tiktok} target="_blank" rel="noreferrer">
            TikTok
          </a>
        </div>
        <div>
          <h3>{t.footer.help}</h3>
          <Link href={href(locale, "/legal/shipping")}>{t.footer.shippingReturns}</Link>
          <Link href={href(locale, "/legal/terms")}>{t.footer.terms}</Link>
          <Link href={href(locale, "/legal/privacy")}>{t.footer.privacy}</Link>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>
          © {new Date().getFullYear()} CAPRAVA. {t.footer.rights}
        </p>
        <p>Greatest Of All Time 🐐</p>
      </div>
    </footer>
  );
}
