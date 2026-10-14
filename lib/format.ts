import type { Locale } from "./i18n";

export function formatPrice(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "sq" ? "de-DE" : "en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function href(locale: Locale, path = ""): string {
  return `/${locale}${path}`;
}
