// Store-wide settings. Values marked TODO are placeholders to confirm before launch.

export const site = {
  name: "CAPRAVA",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  // TODO: confirm the real contact details and social handles.
  email: "info@caprava.com",
  phone: "",
  location: "Kosovë",
  instagram: "https://www.instagram.com/caprava",
  tiktok: "https://www.tiktok.com/@caprava",
  // When true, product buttons read "Pre-order" and a notice explains that
  // orders ship once production starts.
  preorder: false,
};

export const currency = "EUR";

// Prices include VAT (TVSH 18%).
export const vatRate = 0.18;

export const sizes = [
  { ml: 15, price: 28, label: { sq: "Eksperiencë", en: "Experience" } },
  { ml: 75, price: 149, label: { sq: "Prezencë", en: "Presence" } },
] as const;

export type SizeMl = (typeof sizes)[number]["ml"];

export function priceFor(ml: number): number | undefined {
  return sizes.find((s) => s.ml === ml)?.price;
}

// Launch markets from the 2027 plan. TODO: confirm shipping prices with the courier.
export const shipping = {
  freeFrom: 100,
  countries: [
    { code: "XK", name: { sq: "Kosovë", en: "Kosovo" }, cost: 2.5 },
    { code: "AL", name: { sq: "Shqipëri", en: "Albania" }, cost: 5 },
    { code: "MK", name: { sq: "Maqedoni e Veriut", en: "North Macedonia" }, cost: 5 },
    { code: "ME", name: { sq: "Mal i Zi", en: "Montenegro" }, cost: 5 },
  ],
} as const;

export type CountryCode = (typeof shipping.countries)[number]["code"];

export function shippingCost(country: string, subtotal: number): number | undefined {
  const c = shipping.countries.find((x) => x.code === country);
  if (!c) return undefined;
  return subtotal >= shipping.freeFrom ? 0 : c.cost;
}

export const maxQtyPerLine = 10;
