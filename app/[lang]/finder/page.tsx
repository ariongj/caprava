import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Finder } from "@/components/Finder";
import { SectionTitle } from "@/components/Sparkle";
import { getDictionary, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return { title: t.finder.title, description: t.finderCta.text, alternates: { canonical: `/${lang}/finder` } };
}

export default async function FinderPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <>
      <section className="page-hero">
        <div className="smoke" aria-hidden="true" />
        <div className="container">
          <SectionTitle as="h1" title={t.finder.title} text={t.finder.lead} />
        </div>
      </section>
      <div className="container page finder-page">
        <Finder />
      </div>
    </>
  );
}
