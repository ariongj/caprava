import { site } from "./config";

// On the static site (no server) orders and messages go out through the
// visitor's email app, addressed to the store.
export function mailtoHref(subject: string, lines: string[]): string {
  const body = lines.join("\n").slice(0, 1800);
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function openEmail(subject: string, lines: string[]): void {
  const a = document.createElement("a");
  a.href = mailtoHref(subject, lines);
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
