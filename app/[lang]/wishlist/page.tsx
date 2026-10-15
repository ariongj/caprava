import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/Sparkle";
import { WishlistView } from "@/components/WishlistView";
import { getDictionary, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getDictionary(lang).wishlist.title, robots: { index: false } };
}

export default async function WishlistPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <div className="container page">
      <SectionTitle as="h1" title={t.wishlist.title} text={t.wishlist.lead} />
      <WishlistView />
    </div>
  );
}
