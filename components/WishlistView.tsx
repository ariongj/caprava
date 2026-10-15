"use client";

import Link from "next/link";
import { sizes } from "@/lib/config";
import { formatPrice, href } from "@/lib/format";
import { getProduct, type Product } from "@/lib/products";
import { Bottle } from "./Bottle";
import { Icon } from "./Icon";
import { useI18n } from "./I18nProvider";
import { WishButton } from "./WishButton";
import { useWishlist } from "./WishlistProvider";

export function WishlistView() {
  const { locale, t } = useI18n();
  const { slugs, ready } = useWishlist();
  if (!ready) return null;
  const items = slugs.map(getProduct).filter(Boolean) as Product[];
  if (!items.length) {
    return (
      <div className="empty-state">
        <Icon name="heart" className="empty-icon" />
        <p>{t.wishlist.empty}</p>
        <Link href={href(locale, "/shop")} className="button">
          {t.common.shopNow}
        </Link>
      </div>
    );
  }
  return (
    <div className="product-grid">
      {items.map((p) => (
        <Link key={p.slug} href={href(locale, `/shop/${p.slug}`)} className="product-card" style={{ "--accent": p.hex.accent } as React.CSSProperties}>
          <div className="product-card-media bottle-glow">
            <Bottle product={p} className="product-card-bottle" />
            <WishButton slug={p.slug} className="on-media" />
          </div>
          <div className="product-card-body">
            <p className="product-card-meta">
              {p.gender === "her" ? t.common.forHer : t.common.forHim} · {p.color[locale]}
            </p>
            <h3>{p.named ? p.name[locale] : p.character[locale]}</h3>
            <p className="product-card-price">
              {p.available ? `${t.common.from} ${formatPrice(sizes[0].price, locale)}` : t.common.comingSoon}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
