import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NotesPalette } from "@/components/Notes";
import { Divider, SectionTitle, SparkleIcon } from "@/components/Sparkle";
import { href } from "@/lib/format";
import { getDictionary, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return { title: t.story.title, description: t.story.lead, alternates: { canonical: `/${lang}/story` } };
}

export default async function Story({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const s = t.story;

  return (
    <>
      <section className="page-hero">
        <div className="smoke" aria-hidden="true" />
        <div className="container">
          <SectionTitle as="h1" title={s.title} text={s.lead} />
        </div>
      </section>

      <div className="container">
        <section className="section story-split">
          <Divider />
          <h2>{s.ideaTitle}</h2>
          <div className="prose">
            {s.idea.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <ul className="pillar-list">
              {t.home.pillars.map((p) => (
                <li key={p.title}>
                  <strong>{p.title}</strong> — {p.text}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section story-split">
          <Divider side="right" />
          <h2>{s.nameTitle}</h2>
          <div className="prose">
            {s.name.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        <section className="section">
          <Divider />
          <SectionTitle title={s.valuesTitle} />
          <div className="pillars">
            {s.values.map((v, i) => (
              <div key={v.title} className="pillar">
                <span className="pillar-num">0{i + 1}</span>
                <h3>{v.title}</h3>
                <p className="muted">{v.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section story-split">
          <Divider side="right" />
          <h2>{s.processTitle}</h2>
          <div className="prose">
            {s.process.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <h3>{s.bottleTitle}</h3>
            <p>{s.bottle}</p>
            <h3>{s.ambassadorsTitle}</h3>
            <p>{s.ambassadors}</p>
          </div>
        </section>

        <section className="section">
          <Divider />
          <SectionTitle eyebrow={t.dna.eyebrow} title={t.dna.title} text={t.dna.text} />
          <NotesPalette locale={lang} t={t} />
        </section>

        <section className="section">
          <Divider side="right" />
          <SectionTitle title={s.roadmapTitle} text={s.roadmapText} />
          <ol className="roadmap">
            {s.roadmap.map((r) => (
              <li key={r.year}>
                <span className="roadmap-year">{r.year}</span>
                <div>
                  <p className="roadmap-title">{r.title}</p>
                  <p className="muted small">{r.markets}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="goat">
        <div className="smoke smoke-soft" aria-hidden="true" />
        <div className="container goat-inner">
          <SparkleIcon className="goat-star" />
          <h2>{s.legacyTitle} 🐐</h2>
          {s.legacy.map((l) => (
            <p key={l} className="legacy-line">
              {l}
            </p>
          ))}
          <Link href={href(lang, "/shop")} className="button">
            {t.home.heroCta}
          </Link>
        </div>
      </section>
    </>
  );
}
