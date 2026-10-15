// Builds a single-file, shareable preview of the CAPRAVA store from the running
// Next.js server (server-rendered pages) plus a small client runtime.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";
import ts from "typescript";

// Usage: start the store (npm run build && npm start), then
//   node scripts/preview/build.mjs [http://localhost:3000]
// Writes preview/index.html, a standalone page that runs without a server.

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../..");
const base = process.argv[2] || "http://localhost:3000";

// Load the catalogue, prices and texts straight from lib/*.ts.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "caprava-preview-"));
for (const f of ["i18n", "config", "products"]) {
  const src = fs.readFileSync(path.join(repo, `lib/${f}.ts`), "utf8");
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  fs.writeFileSync(path.join(tmp, `${f}.mjs`), js.replace(/from "\.\/(\w+)"/g, 'from "./$1.mjs"'));
}
const { getDictionary, locales } = await import(path.join(tmp, "i18n.mjs"));
const { products } = await import(path.join(tmp, "products.mjs"));
const { sizes, shipping, maxQtyPerLine } = await import(path.join(tmp, "config.mjs"));

const routes = ["", "/shop", "/shop?for=her", "/shop?for=him", ...products.map((p) => `/shop/${p.slug}`), "/story", "/partners", "/contact", "/legal/shipping", "/legal/terms", "/legal/privacy"];

const keyOf = (p) => p.replace(/^\//, "").replace("?for=", "/for-").split("/").filter(Boolean).join("~");
const stripScripts = (s) => s.replace(/<script\b[\s\S]*?<\/script>/g, "");
const between = (html, start, end) => {
  const i = html.indexOf(start);
  const j = html.indexOf(end, i + start.length);
  if (i < 0 || j < 0) throw new Error(`marker not found: ${start}`);
  return html.slice(i, j);
};

// Photos and wordmarks are embedded so the page needs no other files.
const dataUri = (file, type) => `data:${type};base64,${fs.readFileSync(path.join(repo, "public", file)).toString("base64")}`;
const images = Object.fromEntries(products.map((p) => [p.slug, dataUri(`products/cutout/${p.slug}.webp`, "image/webp")]));
const brand = ["caprava", "tittara", "souverian"];
const localAssets = (html) =>
  html
    .replace(/src="\/products\/cutout\/([a-z]+)\.webp"/g, 'data-img="$1"')
    .replace(/url\(\/brand\/([a-z]+)\.svg\)/g, "var(--wm-$1)");

const pages = {};
const chrome = {};
for (const lang of locales) {
  for (const r of routes) {
    const url = `${base}/${lang}${r}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url} → ${res.status}`);
    const html = await res.text();
    const main = between(html, '<main id="main">', "</main>").slice('<main id="main">'.length);
    pages[keyOf(`/${lang}${r}`)] = localAssets(stripScripts(main));
    if (r === "") {
      chrome[lang] = {
        header: localAssets(stripScripts(between(html, '<div class="announce">', '<main id="main">'))),
        footer: localAssets(stripScripts(between(html, '<footer class="site-footer">', "</footer>") + "</footer>")),
      };
    }
  }
}

const data = {
  pages,
  chrome,
  t: Object.fromEntries(locales.map((l) => [l, getDictionary(l)])),
  products: products.map(({ slug, name, named, gender, available, character, hex }) => ({ slug, name, named, gender, available, character, hex })),
  images,
  sizes,
  shipping,
  maxQty: maxQtyPerLine,
  preview: {
    sq: {
      bar: "Pamje paraprake · porositë dhe formularët nuk dërgohen nga kjo lidhje",
      order: "Kjo është një pamje paraprake e dyqanit. Porosia nuk u dërgua dhe asnjë e dhënë nuk u ruajt. Dyqani i plotë me porosi reale funksionon pasi faqja të publikohet në hosting.",
      form: "Pamje paraprake — mesazhi nuk u dërgua.",
    },
    en: {
      bar: "Preview · orders and forms are not sent from this link",
      order: "This is a preview of the store. The order was not sent and no details were stored. Real orders work once the site is deployed to hosting.",
      form: "Preview — this message was not sent.",
    },
  },
};

const css =
  localAssets(fs.readFileSync(path.join(repo, "app/globals.css"), "utf8")) +
  `\n:root { ${brand.map((b) => `--wm-${b}: url("${dataUri(`brand/${b}.svg`, "image/svg+xml")}");`).join(" ")} }\n`;
const mistJs = ts
  .transpileModule(fs.readFileSync(path.join(repo, "lib/mist.ts"), "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } })
  .outputText.replace(/^export /gm, "");
const runtime = fs.readFileSync(path.join(here, "runtime.js"), "utf8");
const json = JSON.stringify(data).replace(/</g, "\\u003c");

const out = `<!doctype html>
<html lang="sq">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>CAPRAVA Store</title>
<meta name="description" content="CAPRAVA — premium fragrances from Kosovo.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@400;500;600&family=Sora:wght@400;600;700&display=swap">
<style>
${css}
/* preview-only additions */
:root { color-scheme: dark; }
.site-header { top: env(safe-area-inset-top, 0px); }
.preview-bar {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 70;
  padding: 8px max(16px, env(safe-area-inset-right, 0px)) calc(8px + env(safe-area-inset-bottom, 0px)) max(16px, env(safe-area-inset-left, 0px));
  background: var(--gold); color: #0a0908; text-align: center;
  font-size: 0.75rem; letter-spacing: 0.06em; font-weight: 600;
}
body { padding-bottom: 64px; }
.preview-note { padding: 16px 18px; border: 1px dashed var(--gold-deep); color: var(--gold); border-radius: var(--radius); }
</style>
</head>
<body>
<div id="chrome-top"></div>
<main id="main"></main>
<div id="chrome-foot"></div>
<div class="drawer-root" id="drawer" aria-hidden="true">
  <div class="drawer-backdrop" data-act="close-drawer"></div>
  <aside class="drawer" role="dialog" aria-modal="true" id="drawer-panel"></aside>
</div>
<div class="scent-tint" id="scent-tint" aria-hidden="true"></div>
<canvas class="scent-mist" id="scent-mist" aria-hidden="true"></canvas>
<div class="scent-stage" id="scent-stage" aria-hidden="true"></div>
<div class="preview-bar" id="preview-bar"></div>
<script id="store-data" type="application/json">${json}</script>
<script>
${runtime}
</script>
<script>
(function () {
${mistJs}
var data = JSON.parse(document.getElementById("store-data").textContent);
var order = ${JSON.stringify(["souverian", "pasion", "tittara", "elegance", "freski", "ngrohtesi", "feminitet", "pasterti"])};
startScentShow({
  canvas: document.getElementById("scent-mist"),
  stage: document.getElementById("scent-stage"),
  tint: document.getElementById("scent-tint"),
  scents: order.map(function (slug) {
    var p = data.products.find(function (x) { return x.slug === slug; });
    return { slug: slug, color: p.hex.glow, image: data.images[slug] };
  }),
  focus: focusedScent,
});
})();
</script>
</body>
</html>
`;
fs.mkdirSync(path.join(repo, "preview"), { recursive: true });
fs.writeFileSync(path.join(repo, "preview/index.html"), out);
fs.rmSync(tmp, { recursive: true, force: true });
console.log("pages", Object.keys(pages).length, "bytes", out.length);
