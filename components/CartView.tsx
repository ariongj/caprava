"use client";

import Link from "next/link";
import { formatPrice, href } from "@/lib/format";
import { CartLines } from "./CartLines";
import { useCart } from "./CartProvider";
import { useI18n } from "./I18nProvider";

export function CartView() {
  const { locale, t } = useI18n();
  const { lines, ready, subtotal } = useCart();
  if (!ready) return null;
  if (lines.length === 0) {
    return (
      <div className="empty-state">
        <p>{t.cart.empty}</p>
        <Link href={href(locale, "/shop")} className="button">
          {t.common.shopNow}
        </Link>
      </div>
    );
  }
  return (
    <div className="cart-page">
      <CartLines />
      <div className="cart-page-summary">
        <div className="summary-row">
          <span>{t.cart.subtotal}</span>
          <strong>{formatPrice(subtotal, locale)}</strong>
        </div>
        <div className="summary-row muted">
          <span>{t.cart.shipping}</span>
          <span>{t.cart.shippingAtCheckout}</span>
        </div>
        <p className="muted small">{t.common.vatIncluded}</p>
        <Link href={href(locale, "/checkout")} className="button button-full">
          {t.cart.checkout}
        </Link>
        <Link href={href(locale, "/shop")} className="text-link center">
          {t.cart.continue}
        </Link>
      </div>
    </div>
  );
}
