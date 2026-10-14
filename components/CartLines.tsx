"use client";

import Link from "next/link";
import { maxQtyPerLine, priceFor } from "@/lib/config";
import { formatPrice, href } from "@/lib/format";
import { getProduct } from "@/lib/products";
import { Bottle } from "./Bottle";
import { useCart } from "./CartProvider";
import { useI18n } from "./I18nProvider";

export function CartLines({ compact = false, readOnly = false }: { compact?: boolean; readOnly?: boolean }) {
  const { locale, t } = useI18n();
  const { lines, setQty, remove, setOpen } = useCart();

  return (
    <ul className={`cart-lines${compact ? " is-compact" : ""}`}>
      {lines.map((line) => {
        const product = getProduct(line.slug);
        if (!product) return null;
        const price = priceFor(line.ml) ?? 0;
        return (
          <li key={`${line.slug}-${line.ml}`} className="cart-line">
            <Link href={href(locale, `/shop/${product.slug}`)} className="cart-line-media" onClick={() => setOpen(false)}>
              <Bottle product={product} ml={line.ml} />
            </Link>
            <div className="cart-line-info">
              <p className="cart-line-name">{product.name[locale]}</p>
              <p className="muted small">
                {line.ml} ML · {product.character[locale]}
              </p>
              {readOnly ? (
                <p className="muted small">
                  {t.common.quantity}: {line.qty}
                </p>
              ) : (
                <div className="cart-line-controls">
                  <div className="qty">
                    <button onClick={() => setQty(line.slug, line.ml, line.qty - 1)} aria-label="−">
                      −
                    </button>
                    <span aria-label={t.common.quantity}>{line.qty}</span>
                    <button onClick={() => setQty(line.slug, line.ml, line.qty + 1)} disabled={line.qty >= maxQtyPerLine} aria-label="+">
                      +
                    </button>
                  </div>
                  <button className="text-link small" onClick={() => remove(line.slug, line.ml)}>
                    {t.common.remove}
                  </button>
                </div>
              )}
            </div>
            <p className="cart-line-price">{formatPrice(price * line.qty, locale)}</p>
          </li>
        );
      })}
    </ul>
  );
}
