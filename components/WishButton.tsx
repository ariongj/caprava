"use client";

import { Icon } from "./Icon";
import { useI18n } from "./I18nProvider";
import { useWishlist } from "./WishlistProvider";

export function WishButton({ slug, className, withLabel = false }: { slug: string; className?: string; withLabel?: boolean }) {
  const { t } = useI18n();
  const { has, toggle, ready } = useWishlist();
  const on = ready && has(slug);
  const label = on ? t.wishlist.remove : t.wishlist.add;
  return (
    <button
      type="button"
      className={`wish-button${on ? " is-on" : ""}${className ? ` ${className}` : ""}`}
      aria-pressed={on}
      aria-label={withLabel ? undefined : label}
      title={label}
      onClick={(e) => {
        // Cards are links; the heart must not open the product.
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
    >
      <Icon name="heart" />
      {withLabel && <span>{label}</span>}
    </button>
  );
}
