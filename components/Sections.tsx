import Link from "next/link";
import { href } from "@/lib/format";
import type { Dictionary, Locale } from "@/lib/i18n";
import { products } from "@/lib/products";
import { Bottle } from "./Bottle";
import { Icon, type IconName } from "./Icon";
import { SparkleIcon } from "./Sparkle";

// Delivery, payment, authenticity and returns at a glance.
export function TrustBar({ t, compact = false }: { t: Dictionary; compact?: boolean }) {
  return (
    <ul className={`trust${compact ? " is-compact" : ""}`}>
      {t.trust.map((item) => (
        <li key={item.title}>
          <span className="trust-icon">
            <Icon name={item.icon as IconName} />
          </span>
          <span>
            <strong>{item.title}</strong>
            <span className="muted small">{item.text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

// The brand words, drifting slowly across the page.
export function Marquee({ t }: { t: Dictionary }) {
  const words = [...t.marquee, ...t.marquee];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <span key={copy} className="marquee-group">
            {words.map((w, i) => (
              <span key={`${copy}-${i}`} className="marquee-item">
                {w}
                <SparkleIcon className="marquee-star" />
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Milestones({ t }: { t: Dictionary }) {
  return (
    <ol className="milestones">
      {t.milestones.items.map((m, i) => (
        <li key={m.year} className={i === 2 ? "is-now" : undefined}>
          <span className="milestone-dot" aria-hidden="true" />
          <span className="milestone-year">{m.year}</span>
          <strong>{m.title}</strong>
          <span className="muted">{m.text}</span>
        </li>
      ))}
    </ol>
  );
}

// Invitation to the fragrance finder, with the whole collection fanned out.
export function FinderCta({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <section className="finder-cta">
      <div className="finder-cta-bottles" aria-hidden="true">
        {products.map((p, i) => (
          <span key={p.slug} className="finder-cta-bottle" style={{ "--i": i, "--glow": p.hex.glow } as React.CSSProperties}>
            <Bottle product={p} sizes="120px" />
          </span>
        ))}
      </div>
      <div className="finder-cta-body">
        <p className="eyebrow">
          <Icon name="compass" /> {t.finderCta.eyebrow}
        </p>
        <h2>{t.finderCta.title}</h2>
        <p className="lead">{t.finderCta.text}</p>
        <Link href={href(locale, "/finder")} className="button">
          {t.finderCta.cta} <Icon name="arrow" />
        </Link>
      </div>
    </section>
  );
}
