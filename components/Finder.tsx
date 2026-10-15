"use client";

import Link from "next/link";
import { useState } from "react";
import { fill } from "@/lib/i18n";
import { href } from "@/lib/format";
import { getProduct, type Product } from "@/lib/products";
import { Bottle } from "./Bottle";
import { Icon, type IconName } from "./Icon";
import { useI18n } from "./I18nProvider";
import { ProductName } from "./Wordmark";

// Which upcoming fragrance matches each scent family, per collection.
const upcomingFor: Record<"her" | "him", Record<string, string>> = {
  her: { fresh: "pasterti", floral: "feminitet", warm: "pasion", woody: "pasion", sweet: "feminitet" },
  him: { fresh: "freski", floral: "elegance", warm: "ngrohtesi", woody: "elegance", sweet: "ngrohtesi" },
};

export function Finder() {
  const { locale, t } = useI18n();
  const f = t.finder;
  const [answers, setAnswers] = useState<string[]>([]);
  const step = answers.length;
  const done = step >= f.questions.length;

  if (done) {
    const gender = answers[0] === "him" ? "him" : "her";
    const main = getProduct(gender === "him" ? "souverian" : "tittara") as Product;
    const extra = getProduct(upcomingFor[gender][answers[2]] ?? "") as Product | undefined;
    const moment = answers[1] as "day" | "night" | "always";
    return (
      <div className="finder-result" style={{ "--glow": main.hex.glow, "--accent": main.hex.accent } as React.CSSProperties}>
        <div className="finder-result-media bottle-glow reflect">
          <Bottle product={main} eager className="shine-auto" sizes="(max-width: 700px) 60vw, 26vw" />
        </div>
        <div className="finder-result-body">
          <p className="eyebrow">{f.resultEyebrow}</p>
          <h2 className="pdp-name">
            <ProductName product={main} name={main.name[locale]} />
          </h2>
          <p className="pdp-character">{main.character[locale]}</p>
          <p className="lead">{f.resultText} {f[moment]}</p>
          <div className="hero-ctas">
            <Link href={href(locale, `/shop/${main.slug}`)} className="button">
              {f.shop} <Icon name="arrow" />
            </Link>
            <button type="button" className="button button-ghost" onClick={() => setAnswers([])}>
              {f.restart}
            </button>
          </div>
          {extra && (
            <Link href={href(locale, `/shop/${extra.slug}`)} className="finder-extra" style={{ "--glow": extra.hex.glow } as React.CSSProperties}>
              <span className="finder-extra-media bottle-glow">
                <Bottle product={extra} sizes="80px" />
              </span>
              <span>
                <span className="muted small">{f.alsoUpcoming}</span>
                <strong>{extra.character[locale]}</strong>
                <span className="muted small">
                  {extra.color[locale]} · {t.common.comingSoon}
                </span>
              </span>
            </Link>
          )}
        </div>
      </div>
    );
  }

  const q = f.questions[step];
  return (
    <div className="finder-quiz">
      <div className="finder-progress" aria-hidden="true">
        {f.questions.map((_, i) => (
          <span key={i} className={i <= step ? "is-on" : undefined} />
        ))}
      </div>
      <p className="eyebrow">{fill(f.step, { n: String(step + 1), total: String(f.questions.length) })}</p>
      <h2>{q.q}</h2>
      <div className={`finder-options${q.options.length > 3 ? " is-many" : ""}`}>
        {q.options.map((o) => (
          <button key={o.id} type="button" className="finder-option" onClick={() => setAnswers([...answers, o.id])}>
            <Icon name={o.icon as IconName} />
            <span>{o.label}</span>
          </button>
        ))}
      </div>
      {step > 0 && (
        <button type="button" className="text-link" onClick={() => setAnswers(answers.slice(0, -1))}>
          ← {f.back}
        </button>
      )}
    </div>
  );
}
