"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { href } from "@/lib/format";
import type { Gender } from "@/lib/products";
import { useI18n } from "./I18nProvider";

type Item = { slug: string; gender: Gender; available: boolean; card: React.ReactNode };

function FromUrl({ items }: { items: Item[] }) {
  const f = useSearchParams().get("for");
  return <View items={items} gender={f === "her" || f === "him" ? f : undefined} />;
}

function View({ items, gender }: { items: Item[]; gender?: Gender }) {
  const { locale, t } = useI18n();
  const list = items.filter((p) => !gender || p.gender === gender);
  const available = list.filter((p) => p.available);
  const upcoming = list.filter((p) => !p.available);
  const tabs = [
    { key: undefined, label: t.common.all },
    { key: "her", label: t.common.forHer },
    { key: "him", label: t.common.forHim },
  ];
  return (
    <>
      <nav className="tabs" aria-label={t.shop.title}>
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            href={href(locale, tab.key ? `/shop?for=${tab.key}` : "/shop")}
            className={tab.key === gender ? "is-active" : undefined}
            aria-current={tab.key === gender ? "page" : undefined}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      <h2 className="group-title">{t.shop.available}</h2>
      {available.length ? (
        <div className="product-grid">{available.map((p) => <div key={p.slug}>{p.card}</div>)}</div>
      ) : (
        <p className="muted">{t.shop.empty}</p>
      )}

      {upcoming.length > 0 && (
        <>
          <h2 className="group-title">{t.shop.upcoming}</h2>
          <p className="muted group-text">{t.shop.upcomingText}</p>
          <div className="product-grid product-grid-small">{upcoming.map((p) => <div key={p.slug}>{p.card}</div>)}</div>
        </>
      )}
    </>
  );
}

// Filters by ?for=her|him in the browser, so the page also works as a static file.
export function ShopView({ items }: { items: Item[] }) {
  return (
    <Suspense fallback={<View items={items} />}>
      <FromUrl items={items} />
    </Suspense>
  );
}
