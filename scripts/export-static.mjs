// Builds the site as plain static files in out/ for GitHub Pages.
//   node scripts/export-static.mjs [/caprava]
// The server-only parts (middleware, API routes) are set aside during the
// build; orders and forms on the static site are previews only.
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const basePath = process.argv[2] ?? "/caprava";
const stash = path.join(root, ".export-stash");
const aside = ["middleware.ts", "app/api"];

fs.rmSync(stash, { recursive: true, force: true });
fs.mkdirSync(stash);
const moved = [];
try {
  for (const p of aside) {
    const from = path.join(root, p);
    if (!fs.existsSync(from)) continue;
    const to = path.join(stash, p.replaceAll("/", "__"));
    fs.renameSync(from, to);
    moved.push([from, to]);
  }
  execSync("npx next build", {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, STATIC_EXPORT: "1", NEXT_PUBLIC_STATIC_EXPORT: "1", NEXT_PUBLIC_BASE_PATH: basePath, NEXT_DIST_DIR: "out" },
  });
} finally {
  for (const [from, to] of moved) fs.renameSync(to, from);
  fs.rmSync(stash, { recursive: true, force: true });
}

const out = path.join(root, "out");
// GitHub Pages must not run Jekyll, or it drops the _next folder.
fs.writeFileSync(path.join(out, ".nojekyll"), "");
// The bare address picks a language the way the middleware does on a server.
const redirect = `<!doctype html><html><head><meta charset="utf-8"><title>CAPRAVA</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>
  var saved = (document.cookie.match(/(?:^|; )lang=(sq|en)/) || [])[1];
  var nav = (navigator.language || "").toLowerCase();
  var lang = saved || (nav.indexOf("en") === 0 ? "en" : "sq");
  location.replace("${basePath}/" + lang + "/" + location.hash);
</script>
<noscript><meta http-equiv="refresh" content="0; url=${basePath}/sq/"></noscript>
</head><body style="background:#050505"></body></html>`;
fs.writeFileSync(path.join(out, "index.html"), redirect);
fs.writeFileSync(path.join(out, "404.html"), redirect);
console.log(`Static site written to ${out} (base path ${basePath || "/"})`);
