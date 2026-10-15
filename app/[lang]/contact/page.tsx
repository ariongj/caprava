import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/Forms";
import { Icon } from "@/components/Icon";
import { SectionTitle } from "@/components/Sparkle";
import { site } from "@/lib/config";
import { getDictionary, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return { title: t.contact.title, description: t.contact.lead, alternates: { canonical: `/${lang}/contact` } };
}

export default async function Contact({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <div className="container page">
      <SectionTitle as="h1" title={t.contact.title} text={t.contact.lead} />
      <div className="contact-grid">
        <ContactForm />
        <aside className="contact-aside">
          <div>
            <p className="eyebrow">
              <Icon name="mail" /> {t.contact.emailUs}
            </p>
            <a href={`mailto:${site.email}`} className="contact-big">
              {site.email}
            </a>
          </div>
          {site.phone && (
            <div>
              <p className="eyebrow">{t.checkout.phone}</p>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="contact-big">
                {site.phone}
              </a>
            </div>
          )}
          <div>
            <p className="eyebrow">
              <Icon name="instagram" /> {t.contact.follow}
            </p>
            <p>
              <a href={site.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>{" "}
              ·{" "}
              <a href={site.tiktok} target="_blank" rel="noreferrer">
                TikTok
              </a>
            </p>
          </div>
          <div>
            <p className="eyebrow">
              <Icon name="pin" /> {t.contact.based}
            </p>
            <p>{site.location}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
