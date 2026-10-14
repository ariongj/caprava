import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PartnerForm } from "@/components/Forms";
import { Divider, SectionTitle } from "@/components/Sparkle";
import { getDictionary, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return { title: t.partners.title, description: t.partners.lead, alternates: { canonical: `/${lang}/partners` } };
}

export default async function Partners({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <div className="container page">
      <SectionTitle as="h1" title={t.partners.title} text={t.partners.lead} />
      <div className="partner-types">
        {Object.entries(t.partners.types).map(([key, v], i) => (
          <div key={key} className="pillar">
            <span className="pillar-num">0{i + 1}</span>
            <h3>{v.title}</h3>
            <p className="muted">{v.text}</p>
          </div>
        ))}
      </div>
      <section className="section form-section">
        <Divider />
        <SectionTitle title={t.partners.formTitle} text={t.partners.formText} />
        <PartnerForm />
      </section>
    </div>
  );
}
