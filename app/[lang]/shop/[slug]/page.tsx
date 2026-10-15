import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { Bottle } from "@/components/Bottle";
import { EmailCapture } from "@/components/Forms";
import { NotesPyramid } from "@/components/Notes";
import { ProductCard } from "@/components/ProductCard";
import { Divider } from "@/components/Sparkle";
import { Icon } from "@/components/Icon";
import { TrustBar } from "@/components/Sections";
import { StickyBuyBar } from "@/components/StickyBuyBar";
import { WishButton } from "@/components/WishButton";
import { ProductName } from "@/components/Wordmark";
import { site, sizes } from "@/lib/config";
import { href } from "@/lib/format";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { getProduct, notes, products } from "@/lib/products";

export function generateStaticParams() {
  return locales.flatMap((lang) => products.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const product = getProduct(slug);
  if (!isLocale(lang) || !product) return {};
  const name = product.named ? product.name[lang] : product.character[lang];
  return {
    title: `${name} — ${product.character[lang]}`,
    description: product.description[lang],
    alternates: { canonical: `/${lang}/shop/${slug}`, languages: { sq: `/sq/shop/${slug}`, en: `/en/shop/${slug}` } },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const product = getProduct(slug);
  if (!isLocale(lang) || !product) notFound();
  const t = getDictionary(lang);
  const name = product.named ? product.name[lang] : product.character[lang];
  const related = products.filter((p) => p.slug !== product.slug && p.available).slice(0, 3);

  const jsonLd = product.available
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: `CAPRAVA ${name}`,
        brand: { "@type": "Brand", name: "CAPRAVA" },
        description: product.description[lang],
        offers: sizes.map((s) => ({
          "@type": "Offer",
          name: `${s.ml} ML`,
          price: s.price,
          priceCurrency: "EUR",
          availability: site.preorder ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
          url: `${site.url}/${lang}/shop/${product.slug}`,
        })),
      }
    : null;

  return (
    <div className="container page" data-mist-slug={product.slug} style={{ "--accent": product.hex.accent, "--glow": product.hex.glow } as React.CSSProperties}>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href={href(lang, "/shop")}>{t.nav.shop}</Link>
        <span aria-hidden="true">/</span>
        <Link href={href(lang, `/shop?for=${product.gender}`)}>{product.gender === "her" ? t.common.forHer : t.common.forHim}</Link>
        <span aria-hidden="true">/</span>
        <span>{name}</span>
      </nav>

      <div className="pdp">
        <div className="pdp-media">
          <div className="pdp-glow" aria-hidden="true" />
          <Bottle product={product} className="pdp-bottle shine-auto" eager sizes="(max-width: 860px) 80vw, 40vw" />
        </div>
        <div className="pdp-info">
          <p className="eyebrow">
            {product.gender === "her" ? t.common.forHer : t.common.forHim} · {product.color[lang]}
          </p>
          <h1 className="pdp-name">
            <ProductName product={product} name={name} />
          </h1>
          <p className="pdp-character">{product.named ? product.character[lang] : t.product.nameSoon}</p>
          <p className="pdp-tagline">{product.tagline[lang]}</p>
          <p className="pdp-description">{product.description[lang]}</p>

          {product.available ? (
            <AddToCart slug={product.slug} />
          ) : (
            <div className="notify-box">
              <h2>{t.product.notifyTitle}</h2>
              <p className="muted">{t.product.notifyText}</p>
              <EmailCapture kind="notify" product={product.slug} placeholder={t.home.newsletterPlaceholder} cta={t.common.notifyMe} thanks={t.product.notifyThanks} />
            </div>
          )}

          <WishButton slug={product.slug} withLabel className="pdp-wish" />

          <dl className="pdp-facts">
            <div>
              <dt>
                <Icon name="sparkle" /> {t.product.character}
              </dt>
              <dd>{product.character[lang]}</dd>
            </div>
            <div>
              <dt>
                <Icon name="drop" /> {t.product.color}
              </dt>
              <dd>{product.color[lang]}</dd>
            </div>
          </dl>

          <div className="accordion">
            {product.notes.top.length > 0 && (
              <details open>
                <summary>
                  <Icon name="leaf" /> {t.pdp.notes}
                </summary>
                <ul className="note-chips">
                  {[...product.notes.top, ...product.notes.middle, ...product.notes.base].map((k) => (
                    <li key={k}>{notes[k].name[lang]}</li>
                  ))}
                </ul>
              </details>
            )}
            <details>
              <summary>
                <Icon name="spray" /> {t.pdp.howTo}
              </summary>
              <ul className="accordion-list">
                {t.pdp.howToText.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </details>
            <details>
              <summary>
                <Icon name="truck" /> {t.pdp.delivery}
              </summary>
              <ul className="accordion-list">
                {t.pdp.deliveryText.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </details>
          </div>
        </div>
      </div>

      {product.available && (
        <>
          <div className="section">
            <TrustBar t={t} />
          </div>
          <StickyBuyBar slug={product.slug} name={name} />
        </>
      )}

      {product.notes.top.length > 0 && (
        <section className="section">
          <Divider />
          <h2 className="group-title">{t.product.notes}</h2>
          <NotesPyramid product={product} locale={lang} t={t} />
        </section>
      )}

      {related.length > 0 && (
        <section className="section">
          <Divider side="right" />
          <h2 className="group-title">{t.product.related}</h2>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} locale={lang} t={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
