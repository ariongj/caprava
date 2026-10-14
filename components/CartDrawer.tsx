"use client";

import Link from "next/link";
import { useEffect } from "react";
import { shipping } from "@/lib/config";
import { fill } from "@/lib/i18n";
import { formatPrice, href } from "@/lib/format";
import { CartLines } from "./CartLines";
import { useCart } from "./CartProvider";
import { useI18n } from "./I18nProvider";

export function CartDrawer() {
  const { locale, t } = useI18n();
  const { open, setOpen, lines, subtotal } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  const left = shipping.freeFrom - subtotal;

  return (
    <div className={`drawer-root${open ? " is-open" : ""}`} aria-hidden={!open}>
      <div className="drawer-backdrop" onClick={() => setOpen(false)} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={t.cart.title}>
        <div className="drawer-head">
          <h2>{t.cart.title}</h2>
          <button className="icon-button" onClick={() => setOpen(false)} aria-label={t.nav.close}>
            ✕
          </button>
        </div>
        {lines.length === 0 ? (
          <div className="drawer-empty">
            <p>{t.cart.empty}</p>
            <Link href={href(locale, "/shop")} className="button" onClick={() => setOpen(false)}>
              {t.common.shopNow}
            </Link>
          </div>
        ) : (
          <>
            <div className="free-ship">
              <p>{left > 0 ? fill(t.cart.freeShippingLeft, { amount: formatPrice(left, locale) }) : t.cart.freeShippingReached}</p>
              <div className="free-ship-bar">
                <span style={{ width: `${Math.min(100, (subtotal / shipping.freeFrom) * 100)}%` }} />
              </div>
            </div>
            <div className="drawer-lines">
              <CartLines compact />
            </div>
            <div className="drawer-foot">
              <div className="summary-row">
                <span>{t.cart.subtotal}</span>
                <strong>{formatPrice(subtotal, locale)}</strong>
              </div>
              <p className="muted small">{t.common.vatIncluded} {t.cart.shipping}: {t.cart.shippingAtCheckout.toLowerCase()}.</p>
              <Link href={href(locale, "/checkout")} className="button button-full" onClick={() => setOpen(false)}>
                {t.cart.checkout}
              </Link>
              <Link href={href(locale, "/cart")} className="text-link center" onClick={() => setOpen(false)}>
                {t.cart.title}
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
