import { isStaticExport } from "@/lib/asset";
import type { Dictionary } from "@/lib/i18n";

// Shown only on the static (GitHub Pages) build, where nothing is sent.
export function PreviewBar({ t }: { t: Dictionary }) {
  if (!isStaticExport) return null;
  return (
    <>
      <div className="preview-spacer" aria-hidden="true" />
      <div className="preview-bar">{t.preview.bar}</div>
    </>
  );
}
