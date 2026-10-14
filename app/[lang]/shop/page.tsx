import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { SectionTitle } from "@/components/Sparkle";
import { href } from "@/lib/format";
import { getDictionary, isLocale } from "@/lib/i18n";
import { products, type Gender } from "@/lib/products";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return { title: t.shop.title, description: t.shop.text, alternates: { canonical: `/${lang}/shop` } };
}

export default async function Shop({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ for?: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const filter = (await searchParams).for;
  const gender: Gender | undefined = filter === "her" || filter === "him" ? filter : undefined;
  const list = products.filter((p) => !gender || p.gender === gender);
  const available = list.filter((p) => p.available);
  const upcoming = list.filter((p) => !p.available);

  const tabs = [
    { key: undefined, label: t.common.all },
    { key: "her", label: t.common.forHer },
    { key: "him", label: t.common.forHim },
  ];

  return (
    <div className="container page">
      <SectionTitle as="h1" title={t.shop.title} text={t.shop.text} />
      <nav className="tabs" aria-label={t.shop.title}>
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            href={href(lang, tab.key ? `/shop?for=${tab.key}` : "/shop")}
            className={tab.key === gender ? "is-active" : undefined}
            aria-current={tab.key === gender ? "page" : undefined}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      <h2 className="group-title">{t.shop.available}</h2>
      {available.length ? (
        <div className="product-grid">
          {available.map((p) => (
            <ProductCard key={p.slug} product={p} locale={lang} t={t} />
          ))}
        </div>
      ) : (
        <p className="muted">{t.shop.empty}</p>
      )}

      {upcoming.length > 0 && (
        <>
          <h2 className="group-title">{t.shop.upcoming}</h2>
          <p className="muted group-text">{t.shop.upcomingText}</p>
          <div className="product-grid product-grid-small">
            {upcoming.map((p) => (
              <ProductCard key={p.slug} product={p} locale={lang} t={t} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
