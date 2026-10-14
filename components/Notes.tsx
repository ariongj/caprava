import type { Dictionary, Locale } from "@/lib/i18n";
import { notes, type NoteKey, type Product, type Tier } from "@/lib/products";

const tiers: Tier[] = ["top", "middle", "base"];

// The full CAPRAVA palette grouped by tier and family.
export function NotesPalette({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <div className="notes-grid">
      {tiers.map((tier) => {
        const families = new Map<string, NoteKey[]>();
        for (const [key, n] of Object.entries(notes) as [NoteKey, (typeof notes)[NoteKey]][]) {
          if (n.tier !== tier) continue;
          const fam = n.family[locale];
          families.set(fam, [...(families.get(fam) ?? []), key]);
        }
        return (
          <div key={tier} className="notes-col">
            <h3>{t.dna[tier].title}</h3>
            <p className="notes-sub">{t.dna[tier].subtitle}</p>
            {[...families.entries()].map(([family, keys]) => (
              <div key={family} className="notes-family">
                <p className="notes-family-name">{family}</p>
                <ul>
                  {keys.map((k) => (
                    <li key={k}>
                      <span>{notes[k].name[locale]}</span> <em>{notes[k].trait[locale]}</em>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// One fragrance's pyramid.
export function NotesPyramid({ product, locale, t }: { product: Product; locale: Locale; t: Dictionary }) {
  return (
    <div className="pyramid">
      {tiers.map((tier) => (
        <div key={tier} className="pyramid-tier">
          <div>
            <p className="pyramid-title">{t.dna[tier].title}</p>
            <p className="muted small">{t.dna[tier].subtitle}</p>
          </div>
          <ul>
            {product.notes[tier].map((k) => (
              <li key={k}>
                {notes[k].name[locale]} <em>{notes[k].trait[locale]}</em>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
