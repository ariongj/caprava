import type { MetadataRoute } from "next";
import { site } from "@/lib/config";
import { locales } from "@/lib/i18n";
import { legalDocs } from "@/lib/legal";
import { products } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/shop", "/story", "/partners", "/contact", ...products.map((p) => `/shop/${p.slug}`), ...Object.keys(legalDocs).map((d) => `/legal/${d}`)];
  return locales.flatMap((lang) => paths.map((p) => ({ url: `${site.url}/${lang}${p}`, changeFrequency: "weekly" as const })));
}
