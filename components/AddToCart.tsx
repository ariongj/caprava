"use client";

import { useState } from "react";
import { site, sizes } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import { useCart } from "./CartProvider";
import { useI18n } from "./I18nProvider";

export function AddToCart({ slug }: { slug: string }) {
  const { locale, t } = useI18n();
  const { add } = useCart();
  const [ml, setMl] = useState<number>(sizes[1].ml);
  const selected = sizes.find((s) => s.ml === ml)!;

  return (
    <div className="add-to-cart">
      <p className="field-label">{t.common.size}</p>
      <div className="size-options" role="radiogroup" aria-label={t.common.size}>
        {sizes.map((s) => (
          <button
            key={s.ml}
            role="radio"
            aria-checked={s.ml === ml}
            className={`size-option${s.ml === ml ? " is-selected" : ""}`}
            onClick={() => setMl(s.ml)}
          >
            <span className="size-ml">{s.ml} ML</span>
            <span className="size-label">{s.label[locale]}</span>
            <span className="size-price">{formatPrice(s.price, locale)}</span>
          </button>
        ))}
      </div>
      <button className="button button-full button-large" onClick={() => add(slug, ml)}>
        {site.preorder ? t.common.preorder : t.common.addToCart} — {formatPrice(selected.price, locale)}
      </button>
      <p className="muted small">{site.preorder ? t.preorderNotice : t.common.vatIncluded}</p>
    </div>
  );
}
