import type { Dictionary, Locale } from "@/lib/i18n";
import { notes, type NoteKey, type Product, type Tier } from "@/lib/products";
import { familyIcon, Icon } from "./Icon";

const tiers: Tier[] = ["top", "middle", "base"];

function familiesOf(tier: Tier) {
  const families = new Map<string, NoteKey[]>();
  for (const [key, n] of Object.entries(notes) as [NoteKey, (typeof notes)[NoteKey]][]) {
    if (n.tier !== tier) continue;
    families.set(n.family.en, [...(families.get(n.family.en) ?? []), key]);
  }
  return [...families.entries()];
}

// The full CAPRAVA palette: each tier a column of ingredient-family cards.
export function NotesPalette({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <div className="notes-grid">
      {tiers.map((tier, ti) => (
        <div key={tier} className="notes-col">
          <div className="notes-head">
            <span className="notes-step">0{ti + 1}</span>
            <div>
              <h3>{t.dna[tier].title}</h3>
              <p className="notes-sub">{t.dna[tier].subtitle}</p>
            </div>
          </div>
          {familiesOf(tier).map(([family, keys]) => (
            <div key={family} className="note-card">
              <span className="note-card-icon">
                <Icon name={familyIcon[family] ?? "sparkle"} />
              </span>
              <div>
                <p className="note-card-family">{notes[keys[0]].family[locale]}</p>
                <ul className="note-chips">
                  {keys.map((k) => (
                    <li key={k}>
                      {notes[k].name[locale]}
                      <em>{notes[k].trait[locale]}</em>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// One fragrance's pyramid.
export function NotesPyramid({ product, locale, t }: { product: Product; locale: Locale; t: Dictionary }) {
  return (
    <div className="pyramid">
      {tiers.map((tier, i) => (
        <div key={tier} className="pyramid-tier" style={{ "--w": `${60 + i * 20}%` } as React.CSSProperties}>
          <div className="pyramid-label">
            <p className="pyramid-title">{t.dna[tier].title}</p>
            <p className="muted small">{t.dna[tier].subtitle}</p>
          </div>
          <ul className="note-chips">
            {product.notes[tier].map((k) => (
              <li key={k}>
                <Icon name={familyIcon[notes[k].family.en] ?? "sparkle"} />
                {notes[k].name[locale]}
                <em>{notes[k].trait[locale]}</em>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
