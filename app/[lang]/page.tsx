import Link from "next/link";
import { notFound } from "next/navigation";
import { Bottle } from "@/components/Bottle";
import { EmailCapture } from "@/components/Forms";
import { NotesPalette } from "@/components/Notes";
import { ProductName } from "@/components/Wordmark";
import { Divider, SectionTitle, SparkleIcon } from "@/components/Sparkle";
import { sizes } from "@/lib/config";
import { formatPrice, href } from "@/lib/format";
import { getDictionary, isLocale } from "@/lib/i18n";
import { products } from "@/lib/products";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const launch = products.filter((p) => p.available);
  const her = products.filter((p) => p.gender === "her");
  const him = products.filter((p) => p.gender === "him");

  return (
    <>
      <section className="hero">
        <div className="smoke" aria-hidden="true" />
        <div className="container hero-inner">
          <blockquote className="hero-quote">
            <span className="quote-mark" aria-hidden="true">“</span>
            <p>{t.home.quote}</p>
            <p className="hero-answer">{t.home.quoteAnswer}</p>
          </blockquote>
          <div className="hero-bottles">
            <Link href={href(lang, `/shop/${launch[1].slug}`)} className="hero-tile hero-tile-back" style={{ "--glow": launch[1].hex.glow } as React.CSSProperties}>
              <Bottle product={launch[1]} eager />
            </Link>
            <Link href={href(lang, `/shop/${launch[0].slug}`)} className="hero-tile hero-tile-front" style={{ "--glow": launch[0].hex.glow } as React.CSSProperties}>
              <Bottle product={launch[0]} eager />
            </Link>
          </div>
          <div className="hero-claim">
            <p className="hero-line1">{t.home.heroLine1}</p>
            <h1 className="hero-line2">{t.home.heroLine2}</h1>
            <div className="hero-ctas">
              <Link href={href(lang, "/shop")} className="button">
                {t.home.heroCta}
              </Link>
              <Link href={href(lang, "/story")} className="button button-ghost">
                {t.home.heroSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <Divider />
        <SectionTitle eyebrow={t.home.launchEyebrow} title={t.home.launchTitle} text={t.home.launchText} />
        <div className="launch-grid">
          {launch.map((p) => (
            <Link
              key={p.slug}
              href={href(lang, `/shop/${p.slug}`)}
              className="launch-card"
              style={{ "--accent": p.hex.accent, "--glow": p.hex.glow } as React.CSSProperties}
            >
              <div className="launch-media">
                <Bottle product={p} className="launch-bottle" />
              </div>
              <div className="launch-body">
                <p className="eyebrow">
                  {p.gender === "her" ? t.common.forHer : t.common.forHim} · {p.color[lang]}
                </p>
                <h3>
                  <ProductName product={p} name={p.name[lang]} />
                </h3>
                <p className="launch-character">{p.character[lang]}</p>
                <p className="muted">{p.tagline[lang]}</p>
                <p className="launch-price">
                  {sizes.map((s) => `${s.ml} ML — ${formatPrice(s.price, lang)}`).join("  ·  ")}
                </p>
                <span className="text-link">{t.common.discover} →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container">
        <Divider side="right" />
        <SectionTitle title={t.home.pillarsTitle} />
        <div className="pillars">
          {t.home.pillars.map((p, i) => (
            <div key={p.title} className="pillar">
              <span className="pillar-num">0{i + 1}</span>
              <h3>{p.title}</h3>
              <p className="muted">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section container">
        <Divider />
        <SectionTitle eyebrow={t.home.collectionEyebrow} title={t.home.collectionTitle} text={t.home.collectionText} />
        <div className="collection">
          {[
            { label: t.common.forHer, items: her },
            { label: t.common.forHim, items: him },
          ].map((group) => (
            <div key={group.label} className="collection-group">
              <p className="collection-label">{group.label}</p>
              <div className="collection-row">
                {group.items.map((p) => (
                  <Link key={p.slug} href={href(lang, `/shop/${p.slug}`)} className="collection-item">
                    <span className="collection-media">
                      <Bottle product={p} className="collection-bottle" />
                    </span>
                    <span className="collection-color">{p.color[lang]}</span>
                    <span className="collection-character">{p.named ? p.name[lang] : p.character[lang]}</span>
                    {!p.available && <span className="badge badge-quiet">{t.common.comingSoon}</span>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section container">
        <Divider side="right" />
        <SectionTitle eyebrow={t.dna.eyebrow} title={t.dna.title} text={t.dna.text} />
        <NotesPalette locale={lang} t={t} />
      </section>

      <section className="section container">
        <Divider />
        <SectionTitle title={t.home.formatsTitle} />
        <div className="formats">
          {t.home.formats.map((f) => {
            const size = sizes.find((s) => s.ml === f.ml)!;
            return (
              <div key={f.ml} className="format">
                <Bottle product={launch[0]} ml={f.ml} className="format-bottle" />
                <div>
                  <p className="format-ml">{f.ml} ML</p>
                  <h3>{f.title}</h3>
                  <p className="muted">{f.text}</p>
                  <p className="format-price">{formatPrice(size.price, lang)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="goat">
        <div className="smoke smoke-soft" aria-hidden="true" />
        <div className="container goat-inner">
          <SparkleIcon className="goat-star" />
          <h2>{t.home.goatTitle}</h2>
          <p>{t.home.goatText}</p>
        </div>
      </section>

      <section className="section container newsletter">
        <SectionTitle title={t.home.newsletterTitle} text={t.home.newsletterText} />
        <EmailCapture kind="newsletter" placeholder={t.home.newsletterPlaceholder} cta={t.home.newsletterCta} thanks={t.home.newsletterThanks} />
      </section>
    </>
  );
}
