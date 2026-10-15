import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { TrustBar } from "@/components/Sections";
import { SectionTitle } from "@/components/Sparkle";
import { href } from "@/lib/format";
import { getDictionary, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return { title: t.faq.title, description: t.faq.lead, alternates: { canonical: `/${lang}/faq` } };
}

export default async function FaqPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
  return (
    <div className="container page page-narrow">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SectionTitle as="h1" title={t.faq.title} text={t.faq.lead} />
      <div className="accordion accordion-large">
        {t.faq.items.map((item, i) => (
          <details key={item.q} open={i === 0}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
      <div className="faq-more">
        <p>{t.faq.more}</p>
        <Link href={href(lang, "/contact")} className="button">
          <Icon name="mail" /> {t.contact.emailUs}
        </Link>
      </div>
      <div className="section">
        <TrustBar t={t} compact />
      </div>
    </div>
  );
}
