import type { NextConfig } from "next";

// STATIC_EXPORT=1 builds plain files for GitHub Pages (see scripts/export-static.mjs).
const staticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Keep the static export's build files apart from the normal build.
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
  ...(staticExport ? { output: "export", trailingSlash: true, basePath, images: { unoptimized: true } } : {}),
};

export default nextConfig;
