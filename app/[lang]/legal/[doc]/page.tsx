import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/Sparkle";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { legalDocs } from "@/lib/legal";

export function generateStaticParams() {
  return locales.flatMap((lang) => Object.keys(legalDocs).map((doc) => ({ lang, doc })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; doc: string }> }): Promise<Metadata> {
  const { lang, doc } = await params;
  if (!isLocale(lang) || !legalDocs[doc]) return {};
  return { title: legalDocs[doc][lang].title };
}

export default async function LegalPage({ params }: { params: Promise<{ lang: string; doc: string }> }) {
  const { lang, doc } = await params;
  if (!isLocale(lang) || !legalDocs[doc]) notFound();
  const t = getDictionary(lang);
  const content = legalDocs[doc][lang];
  return (
    <div className="container page page-narrow">
      <SectionTitle as="h1" title={content.title} />
      <p className="draft-note">{t.legal.draft}</p>
      <div className="prose">
        {content.sections.map((s) => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            {s.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
