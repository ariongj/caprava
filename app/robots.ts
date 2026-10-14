import type { MetadataRoute } from "next";
import { site } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/sq/checkout", "/en/checkout", "/sq/cart", "/en/cart"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
