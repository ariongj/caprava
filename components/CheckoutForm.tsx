"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { shipping, shippingCost } from "@/lib/config";
import { fill } from "@/lib/i18n";
import { formatPrice, href } from "@/lib/format";
import { CartLines } from "./CartLines";
import { useCart } from "./CartProvider";
import { useI18n } from "./I18nProvider";

export function CheckoutForm({ cardEnabled }: { cardEnabled: boolean }) {
  const { locale, t } = useI18n();
  const { lines, ready, subtotal, clear } = useCart();
  const router = useRouter();
  const [country, setCountry] = useState<string>(shipping.countries[0].code);
  const [payment, setPayment] = useState<"cod" | "card">("cod");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!ready) return null;
  if (lines.length === 0) {
    return (
      <div className="empty-state">
        <p>{t.checkout.emptyCart}</p>
        <Link href={href(locale, "/shop")} className="button">
          {t.common.shopNow}
        </Link>
      </div>
    );
  }

  const ship = shippingCost(country, subtotal) ?? 0;
  const [termsBefore, termsMid, termsAfter] = t.checkout.terms.split(/\{terms\}|\{privacy\}/);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const customer = Object.fromEntries(Array.from(new FormData(e.currentTarget).entries()).map(([k, v]) => [k, String(v)]));
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, payment, lines, customer }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "checkout failed");
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      clear();
      router.push(href(locale, `/checkout/success?order=${encodeURIComponent(data.orderId)}`));
    } catch {
      setError(t.checkout.error);
      setBusy(false);
    }
  }

  return (
    <form className="checkout" onSubmit={onSubmit}>
      <div className="checkout-main">
        <fieldset>
          <legend>{t.checkout.contact}</legend>
          <div className="form-row">
            <label className="field">
              <span>{t.checkout.email}</span>
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label className="field">
              <span>{t.checkout.phone}</span>
              <input name="phone" type="tel" required autoComplete="tel" placeholder="+383 …" />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>{t.checkout.delivery}</legend>
          <div className="form-row">
            <label className="field">
              <span>{t.checkout.firstName}</span>
              <input name="firstName" required autoComplete="given-name" />
            </label>
            <label className="field">
              <span>{t.checkout.lastName}</span>
              <input name="lastName" required autoComplete="family-name" />
            </label>
          </div>
          <label className="field">
            <span>{t.checkout.address}</span>
            <input name="address" required autoComplete="street-address" />
          </label>
          <div className="form-row form-row-3">
            <label className="field">
              <span>{t.checkout.city}</span>
              <input name="city" required autoComplete="address-level2" />
            </label>
            <label className="field">
              <span>{t.checkout.postalCode}</span>
              <input name="postalCode" autoComplete="postal-code" />
            </label>
            <label className="field">
              <span>{t.checkout.country}</span>
              <select name="country" value={country} onChange={(e) => setCountry(e.target.value)} autoComplete="country">
                {shipping.countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name[locale]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="field">
            <span>{t.checkout.note}</span>
            <textarea name="note" rows={3} />
          </label>
        </fieldset>

        <fieldset>
          <legend>{t.checkout.payment}</legend>
          <div className="payment-options">
            <label className={`payment-option${payment === "cod" ? " is-selected" : ""}`}>
              <input type="radio" name="payment" value="cod" checked={payment === "cod"} onChange={() => setPayment("cod")} />
              <span>
                <strong>{t.checkout.cod}</strong>
                <span className="muted small">{t.checkout.codText}</span>
              </span>
            </label>
            {cardEnabled && (
              <label className={`payment-option${payment === "card" ? " is-selected" : ""}`}>
                <input type="radio" name="payment" value="card" checked={payment === "card"} onChange={() => setPayment("card")} />
                <span>
                  <strong>{t.checkout.card}</strong>
                  <span className="muted small">{t.checkout.cardText}</span>
                </span>
              </label>
            )}
          </div>
        </fieldset>

        <label className="checkbox">
          <input type="checkbox" required />
          <span>
            {termsBefore}
            <Link href={href(locale, "/legal/terms")} target="_blank">
              {t.checkout.termsLink}
            </Link>
            {termsMid}
            <Link href={href(locale, "/legal/privacy")} target="_blank">
              {t.checkout.privacyLink}
            </Link>
            {termsAfter}
          </span>
        </label>
      </div>

      <aside className="checkout-summary">
        <h2>{t.checkout.summary}</h2>
        <CartLines compact readOnly />
        <div className="summary-row">
          <span>{t.cart.subtotal}</span>
          <span>{formatPrice(subtotal, locale)}</span>
        </div>
        <div className="summary-row">
          <span>{t.cart.shipping}</span>
          <span>{ship === 0 ? t.cart.free : formatPrice(ship, locale)}</span>
        </div>
        {ship > 0 && <p className="muted small">{fill(t.cart.freeShippingLeft, { amount: formatPrice(shipping.freeFrom - subtotal, locale) })}</p>}
        <div className="summary-row summary-total">
          <span>{t.cart.total}</span>
          <strong>{formatPrice(subtotal + ship, locale)}</strong>
        </div>
        <p className="muted small">{t.common.vatIncluded}</p>
        <button className="button button-full button-large" disabled={busy}>
          {busy ? t.checkout.processing : payment === "card" ? t.checkout.payNow : t.checkout.placeOrder}
        </button>
        {error && <p className="form-error">{error}</p>}
      </aside>
    </form>
  );
}
