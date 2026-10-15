// When the site is exported as static files (GitHub Pages) it lives under a
// sub-path and has no server: no API routes, so orders and forms are only
// previewed there.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

export function asset(path: string): string {
  return `${basePath}${path}`;
}
