import { maxQtyPerLine, priceFor, shipping, shippingCost } from "./config";
import { formatPrice } from "./format";
import type { Locale } from "./i18n";
import { getProduct } from "./products";

export type CartLine = { slug: string; ml: number; qty: number };

export type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  note: string;
};

export type PricedLine = CartLine & { name: string; unitPrice: number; total: number };

export type PricedOrder = {
  lines: PricedLine[];
  subtotal: number;
  shipping: number;
  total: number;
};

const round = (n: number) => Math.round(n * 100) / 100;

// Prices always come from the catalogue on the server; the client only sends
// what it wants, never what it costs.
export function priceOrder(lines: unknown, country: string, locale: Locale): PricedOrder | string {
  if (!Array.isArray(lines) || lines.length === 0) return "empty cart";
  if (lines.length > 20) return "too many lines";
  const priced: PricedLine[] = [];
  for (const raw of lines) {
    const line = raw as Partial<CartLine>;
    const product = typeof line.slug === "string" ? getProduct(line.slug) : undefined;
    if (!product || !product.available) return `unknown product ${String(line.slug)}`;
    const unitPrice = typeof line.ml === "number" ? priceFor(line.ml) : undefined;
    if (unitPrice === undefined) return `unknown size ${String(line.ml)}`;
    const qty = line.qty;
    if (typeof qty !== "number" || !Number.isInteger(qty) || qty < 1 || qty > maxQtyPerLine) return "bad quantity";
    priced.push({
      slug: product.slug,
      ml: line.ml!,
      qty,
      name: `${product.name[locale]} ${line.ml} ML`,
      unitPrice,
      total: round(unitPrice * qty),
    });
  }
  const subtotal = round(priced.reduce((s, l) => s + l.total, 0));
  const ship = shippingCost(country, subtotal);
  if (ship === undefined) return "unsupported country";
  return { lines: priced, subtotal, shipping: ship, total: round(subtotal + ship) };
}

const fields: (keyof Customer)[] = ["firstName", "lastName", "email", "phone", "address", "city", "postalCode", "country", "note"];
const optional = new Set<keyof Customer>(["postalCode", "note"]);

export function parseCustomer(raw: unknown): Customer | string {
  if (!raw || typeof raw !== "object") return "missing customer";
  const src = raw as Record<string, unknown>;
  const out = {} as Customer;
  for (const f of fields) {
    const value = typeof src[f] === "string" ? (src[f] as string).trim().slice(0, f === "note" ? 1000 : 200) : "";
    if (!value && !optional.has(f)) return `missing ${f}`;
    out[f] = value;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(out.email)) return "invalid email";
  if (!shipping.countries.some((c) => c.code === out.country)) return "unsupported country";
  return out;
}

export function newOrderId(): string {
  const d = new Date();
  const date = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CPR-${date}-${rand}`;
}

export function orderSummaryText(order: PricedOrder, locale: Locale): string {
  const lines = order.lines.map((l) => `${l.qty} × ${l.name} — ${formatPrice(l.total, locale)}`);
  return [
    ...lines,
    `Subtotal: ${formatPrice(order.subtotal, locale)}`,
    `Shipping: ${formatPrice(order.shipping, locale)}`,
    `Total: ${formatPrice(order.total, locale)}`,
  ].join("\n");
}
