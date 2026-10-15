import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { ShopView } from "@/components/ShopView";
import { SectionTitle } from "@/components/Sparkle";
import { getDictionary, isLocale } from "@/lib/i18n";
import { products } from "@/lib/products";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return { title: t.shop.title, description: t.shop.text, alternates: { canonical: `/${lang}/shop` } };
}

export default async function Shop({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <div className="container page">
      <SectionTitle as="h1" title={t.shop.title} text={t.shop.text} />
      <ShopView
        items={products.map((p) => ({
          slug: p.slug,
          gender: p.gender,
          available: p.available,
          card: <ProductCard product={p} locale={lang} t={t} />,
        }))}
      />
    </div>
  );
}
