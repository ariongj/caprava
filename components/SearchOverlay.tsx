"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { href } from "@/lib/format";
import { notes, products } from "@/lib/products";
import { Bottle } from "./Bottle";
import { Icon } from "./Icon";
import { useI18n } from "./I18nProvider";

const fold = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { locale, t } = useI18n();
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setTimeout(() => input.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Every fragrance is searchable by name, character, colour and notes in both languages.
  const index = useMemo(
    () =>
      products.map((p) => ({
        p,
        text: fold(
          [
            p.name.sq, p.name.en, p.character.sq, p.character.en, p.color.sq, p.color.en,
            ...[...p.notes.top, ...p.notes.middle, ...p.notes.base].flatMap((k) => [notes[k].name.sq, notes[k].name.en, notes[k].family.sq, notes[k].family.en]),
          ].join(" "),
        ),
      })),
    [],
  );
  const words = fold(q).split(/\s+/).filter(Boolean);
  const results = (words.length ? index.filter((x) => words.every((w) => x.text.includes(w))) : index).map((x) => x.p);

  return (
    <div className={`search-root${open ? " is-open" : ""}`} aria-hidden={!open}>
      <div className="search-backdrop" onClick={onClose} />
      <div className="search-panel" role="dialog" aria-modal="true" aria-label={t.search.title}>
        <div className="search-bar container">
          <Icon name="search" />
          <input
            ref={input}
            id="site-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.search.placeholder}
            aria-label={t.search.placeholder}
            tabIndex={open ? 0 : -1}
          />
          <button type="button" className="icon-button" onClick={onClose} aria-label={t.nav.close} tabIndex={open ? 0 : -1}>
            <Icon name="close" />
          </button>
        </div>
        <div className="container search-results">
          {!q && <p className="muted small">{t.search.hint}</p>}
          {results.length === 0 ? (
            <p className="muted">{t.search.noResults}</p>
          ) : (
            <ul>
              {results.map((p) => (
                <li key={p.slug} style={{ "--glow": p.hex.glow } as React.CSSProperties}>
                  <Link href={href(locale, `/shop/${p.slug}`)} onClick={onClose} tabIndex={open ? 0 : -1}>
                    <span className="search-thumb bottle-glow">
                      <Bottle product={p} sizes="80px" />
                    </span>
                    <span>
                      <strong>{p.named ? p.name[locale] : p.character[locale]}</strong>
                      <span className="muted small">
                        {p.gender === "her" ? t.common.forHer : t.common.forHim} · {p.color[locale]}
                        {!p.available && ` · ${t.common.comingSoon}`}
                      </span>
                    </span>
                    <Icon name="arrow" className="search-arrow" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
