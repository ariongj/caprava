import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/CheckoutForm";
import { SectionTitle } from "@/components/Sparkle";
import { getDictionary, isLocale } from "@/lib/i18n";


export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getDictionary(lang).checkout.title, robots: { index: false } };
}

export default async function CheckoutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <div className="container page">
      <SectionTitle as="h1" title={t.checkout.title} />
      <CheckoutForm cardEnabled={Boolean(process.env.STRIPE_SECRET_KEY)} />
    </div>
  );
}
