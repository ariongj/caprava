import { asset } from "./asset";
import type { Locale } from "./i18n";

type T = Record<Locale, string>;

export type NoteKey =
  | "bergamot"
  | "raspberry"
  | "cardamom"
  | "nutmeg"
  | "saffron"
  | "jasmine"
  | "rose"
  | "orangeBlossom"
  | "neroli"
  | "lavender"
  | "vanilla"
  | "tonka"
  | "labdanum"
  | "cedarwood"
  | "sandalwood"
  | "cashmeran"
  | "vetiver"
  | "ambroxan"
  | "ambrettolide";

export type Tier = "top" | "middle" | "base";

// The CAPRAVA ingredient palette, as described in "ADN-ja e CAPRAVA-s".
export const notes: Record<NoteKey, { tier: Tier; family: T; name: T; trait: T }> = {
  bergamot: { tier: "top", family: { sq: "Citrus", en: "Citrus" }, name: { sq: "Bergamot", en: "Bergamot" }, trait: { sq: "Freski", en: "Freshness" } },
  raspberry: { tier: "top", family: { sq: "Fruta", en: "Fruit" }, name: { sq: "Mjedër", en: "Raspberry" }, trait: { sq: "Frutore", en: "Fruity" } },
  cardamom: { tier: "top", family: { sq: "Erëzore", en: "Spice" }, name: { sq: "Kardamom", en: "Cardamom" }, trait: { sq: "Pikant", en: "Piquant" } },
  nutmeg: { tier: "top", family: { sq: "Erëzore", en: "Spice" }, name: { sq: "Arrëmyshk", en: "Nutmeg" }, trait: { sq: "Ngrohtësi", en: "Warmth" } },
  saffron: { tier: "top", family: { sq: "Erëzore", en: "Spice" }, name: { sq: "Shafran", en: "Saffron" }, trait: { sq: "I sofistikuar", en: "Sophisticated" } },
  jasmine: { tier: "middle", family: { sq: "Lule", en: "Floral" }, name: { sq: "Jasemin", en: "Jasmine" }, trait: { sq: "Sensual", en: "Sensual" } },
  rose: { tier: "middle", family: { sq: "Lule", en: "Floral" }, name: { sq: "Trëndafil", en: "Rose" }, trait: { sq: "Romantike", en: "Romantic" } },
  orangeBlossom: { tier: "middle", family: { sq: "Lule", en: "Floral" }, name: { sq: "Lule portokalli", en: "Orange blossom" }, trait: { sq: "E ëmbël", en: "Sweet" } },
  neroli: { tier: "middle", family: { sq: "Lule", en: "Floral" }, name: { sq: "Neroli", en: "Neroli" }, trait: { sq: "Freski", en: "Freshness" } },
  lavender: { tier: "middle", family: { sq: "Lule", en: "Floral" }, name: { sq: "Livando", en: "Lavender" }, trait: { sq: "Qetësues", en: "Calming" } },
  vanilla: { tier: "base", family: { sq: "Gourmand", en: "Gourmand" }, name: { sq: "Vanilje", en: "Vanilla" }, trait: { sq: "Kremoze", en: "Creamy" } },
  tonka: { tier: "base", family: { sq: "Gourmand", en: "Gourmand" }, name: { sq: "Fasule tonka", en: "Tonka bean" }, trait: { sq: "Bajamesore", en: "Almond-like" } },
  labdanum: { tier: "base", family: { sq: "Balsamike", en: "Balsamic" }, name: { sq: "Labdanum", en: "Labdanum" }, trait: { sq: "Rrëshinore", en: "Resinous" } },
  cedarwood: { tier: "base", family: { sq: "Drurore", en: "Woody" }, name: { sq: "Kedër", en: "Cedarwood" }, trait: { sq: "I thatë", en: "Dry" } },
  sandalwood: { tier: "base", family: { sq: "Drurore", en: "Woody" }, name: { sq: "Sandal", en: "Sandalwood" }, trait: { sq: "Kremoz", en: "Creamy" } },
  cashmeran: { tier: "base", family: { sq: "Drurore", en: "Woody" }, name: { sq: "Cashmeran", en: "Cashmeran" }, trait: { sq: "Druror", en: "Woody" } },
  vetiver: { tier: "base", family: { sq: "Drurore", en: "Woody" }, name: { sq: "Vetiver", en: "Vetiver" }, trait: { sq: "Tokësor", en: "Earthy" } },
  ambroxan: { tier: "base", family: { sq: "Amberike", en: "Amber" }, name: { sq: "Ambroxan", en: "Ambroxan" }, trait: { sq: "Amberik", en: "Ambery" } },
  ambrettolide: { tier: "base", family: { sq: "Musk", en: "Musk" }, name: { sq: "Ambrettolide", en: "Ambrettolide" }, trait: { sq: "E pastër", en: "Clean" } },
};

export type Gender = "her" | "him";

export type Product = {
  slug: string;
  name: T;
  // Whether the fragrance has its final public name. Until then the site shows
  // its character ("Pasion", "Elegancë"…) as the name.
  named: boolean;
  gender: Gender;
  available: boolean;
  color: T;
  character: T;
  // Bottle colours: liquid, glass highlight and the accent used around the product.
  hex: { liquid: string; glow: string; accent: string };
  // Brand wordmark for the fragrance name (public/brand), with its width/height ratio.
  wordmark?: { src: string; ratio: number };
  tagline: T;
  description: T;
  notes: { top: NoteKey[]; middle: NoteKey[]; base: NoteKey[] };
};

// TODO: the per-fragrance note pyramids below are drafts built from the CAPRAVA
// ingredient palette. Replace them with the final formulas from the chemist.
export const products: Product[] = [
  {
    slug: "souverian",
    name: { sq: "Souverian", en: "Souverian" },
    named: true,
    gender: "him",
    available: true,
    color: { sq: "E zezë", en: "Black" },
    character: { sq: "Mister", en: "Mystery" },
    hex: { liquid: "#151314", glow: "#8a8486", accent: "#b8a27a" },
    wordmark: { src: "/brand/souverian.svg", ratio: 4112 / 684 },
    tagline: {
      sq: "Prezenca që nuk ka nevojë të flasë.",
      en: "A presence that never needs to speak.",
    },
    description: {
      sq: "Souverian është fragranca e misterit. Hapet me freski bergamoti dhe nxehtësi kardamomi, kalon në një zemër të qetë livandoje dhe neroli, dhe mbyllet në një bazë të thellë drurore e amberike që qëndron gjatë pasi ti largohesh.",
      en: "Souverian is the fragrance of mystery. It opens with bright bergamot and the heat of cardamom, settles into a calm heart of lavender and neroli, and closes on a deep woody, ambery base that lingers long after you leave the room.",
    },
    notes: {
      top: ["bergamot", "cardamom", "saffron"],
      middle: ["lavender", "neroli"],
      base: ["ambroxan", "cedarwood", "vetiver", "labdanum"],
    },
  },
  {
    slug: "tittara",
    name: { sq: "Tittara", en: "Tittara" },
    named: true,
    gender: "her",
    available: true,
    color: { sq: "Vjollcë", en: "Violet" },
    character: { sq: "Aristokraci", en: "Aristocracy" },
    hex: { liquid: "#5b2a86", glow: "#a77fd1", accent: "#c9a6e8" },
    wordmark: { src: "/brand/tittara.svg", ratio: 2736 / 600 },
    tagline: {
      sq: "Elegancë që lind me ty.",
      en: "Elegance you were born with.",
    },
    description: {
      sq: "Tittara është fragranca e aristokracisë. Mjedra dhe bergamoti hapin një zemër lulesh — jasemin, trëndafil dhe lule portokalli — mbi një bazë kremoze vaniljeje, tonke dhe sandali. E butë, e sigurt dhe e paharrueshme.",
      en: "Tittara is the fragrance of aristocracy. Raspberry and bergamot open onto a floral heart of jasmine, rose and orange blossom, resting on a creamy base of vanilla, tonka and sandalwood. Soft, assured and unforgettable.",
    },
    notes: {
      top: ["raspberry", "bergamot"],
      middle: ["jasmine", "rose", "orangeBlossom"],
      base: ["vanilla", "tonka", "sandalwood", "ambrettolide"],
    },
  },
  {
    slug: "pasion",
    name: { sq: "Pasion", en: "Passion" },
    named: false,
    gender: "her",
    available: false,
    color: { sq: "E kuqja", en: "Red" },
    character: { sq: "Pasion", en: "Passion" },
    hex: { liquid: "#8e1b24", glow: "#e0606a", accent: "#e0606a" },
    tagline: { sq: "Së shpejti.", en: "Coming soon." },
    description: {
      sq: "Fragranca e pasionit — e ngrohtë, e guximshme dhe e pamohueshme. Pjesë e koleksionit të ardhshëm të CAPRAVA-s.",
      en: "The fragrance of passion — warm, bold and undeniable. Part of the upcoming CAPRAVA collection.",
    },
    notes: { top: [], middle: [], base: [] },
  },
  {
    slug: "feminitet",
    name: { sq: "Feminitet", en: "Femininity" },
    named: false,
    gender: "her",
    available: false,
    color: { sq: "Rozë", en: "Pink" },
    character: { sq: "Feminitet", en: "Femininity" },
    hex: { liquid: "#c9728f", glow: "#f2b3c8", accent: "#f2b3c8" },
    tagline: { sq: "Së shpejti.", en: "Coming soon." },
    description: {
      sq: "Fragranca e feminitetit — e butë, e ndritshme dhe plot hijeshi. Pjesë e koleksionit të ardhshëm të CAPRAVA-s.",
      en: "The fragrance of femininity — soft, luminous and full of grace. Part of the upcoming CAPRAVA collection.",
    },
    notes: { top: [], middle: [], base: [] },
  },
  {
    slug: "pasterti",
    name: { sq: "Pastërti", en: "Purity" },
    named: false,
    gender: "her",
    available: false,
    color: { sq: "E bardha", en: "White" },
    character: { sq: "Pastërti", en: "Purity" },
    hex: { liquid: "#e9e4d8", glow: "#ffffff", accent: "#e9e4d8" },
    tagline: { sq: "Së shpejti.", en: "Coming soon." },
    description: {
      sq: "Fragranca e pastërtisë — e qartë, e lehtë dhe e sinqertë. Pjesë e koleksionit të ardhshëm të CAPRAVA-s.",
      en: "The fragrance of purity — clear, light and sincere. Part of the upcoming CAPRAVA collection.",
    },
    notes: { top: [], middle: [], base: [] },
  },
  {
    slug: "elegance",
    name: { sq: "Elegancë", en: "Elegance" },
    named: false,
    gender: "him",
    available: false,
    color: { sq: "E kaltër", en: "Blue" },
    character: { sq: "Elegancë", en: "Elegance" },
    hex: { liquid: "#1f3f78", glow: "#6f95d8", accent: "#7fa3e3" },
    tagline: { sq: "Së shpejti.", en: "Coming soon." },
    description: {
      sq: "Fragranca e elegancës — e ftohtë, e pastër dhe e përmbajtur. Pjesë e koleksionit të ardhshëm të CAPRAVA-s.",
      en: "The fragrance of elegance — cool, clean and composed. Part of the upcoming CAPRAVA collection.",
    },
    notes: { top: [], middle: [], base: [] },
  },
  {
    slug: "ngrohtesi",
    name: { sq: "Ngrohtësi", en: "Warmth" },
    named: false,
    gender: "him",
    available: false,
    color: { sq: "Portokalli", en: "Orange" },
    character: { sq: "Ngrohtësi", en: "Warmth" },
    hex: { liquid: "#b8561b", glow: "#f29a5b", accent: "#f29a5b" },
    tagline: { sq: "Së shpejti.", en: "Coming soon." },
    description: {
      sq: "Fragranca e ngrohtësisë — erëzore, e afërt dhe mikpritëse. Pjesë e koleksionit të ardhshëm të CAPRAVA-s.",
      en: "The fragrance of warmth — spiced, close and welcoming. Part of the upcoming CAPRAVA collection.",
    },
    notes: { top: [], middle: [], base: [] },
  },
  {
    slug: "freski",
    name: { sq: "Freski", en: "Freshness" },
    named: false,
    gender: "him",
    available: false,
    color: { sq: "E gjelbra", en: "Green" },
    character: { sq: "Freski", en: "Freshness" },
    hex: { liquid: "#1f5a3d", glow: "#6fc095", accent: "#7cc9a0" },
    tagline: { sq: "Së shpejti.", en: "Coming soon." },
    description: {
      sq: "Fragranca e freskisë — e gjallë, e gjelbër dhe plot energji. Pjesë e koleksionit të ardhshëm të CAPRAVA-s.",
      en: "The fragrance of freshness — vivid, green and full of energy. Part of the upcoming CAPRAVA collection.",
    },
    notes: { top: [], middle: [], base: [] },
  },
];

// Studio photo (with backdrop) and the cut-out bottle used across the site.
export function productImage(slug: string): string {
  return asset(`/products/${slug}.jpg`);
}

export function productCutout(slug: string, width?: 360): string {
  return asset(`/products/cutout/${slug}${width ? `-${width}` : ""}.webp`);
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
