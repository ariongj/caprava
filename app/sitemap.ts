import type { MetadataRoute } from "next";
import { site } from "@/lib/config";
import { locales } from "@/lib/i18n";
import { legalDocs } from "@/lib/legal";
import { products } from "@/lib/products";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/shop", "/story", "/partners", "/contact", "/finder", "/faq", ...products.map((p) => `/shop/${p.slug}`), ...Object.keys(legalDocs).map((d) => `/legal/${d}`)];
  return locales.flatMap((lang) => paths.map((p) => ({ url: `${site.url}/${lang}${p}`, changeFrequency: "weekly" as const })));
}
