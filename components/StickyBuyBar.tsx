"use client";

import { useEffect, useState } from "react";
import { priceFor, site } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import { useCart } from "./CartProvider";
import { useI18n } from "./I18nProvider";

// Keeps "add to bag" within reach once the main button has scrolled away.
export function StickyBuyBar({ slug, name }: { slug: string; name: string }) {
  const { locale, t } = useI18n();
  const { add } = useCart();
  const [show, setShow] = useState(false);
  const [ml, setMl] = useState(75);

  useEffect(() => {
    const target = document.getElementById("add-to-cart");
    if (!target) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(target);
    const mo = new MutationObserver(() => setMl(Number(target.dataset.ml) || 75));
    mo.observe(target, { attributes: true, attributeFilter: ["data-ml"] });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <div className={`buy-bar${show ? " is-visible" : ""}`} aria-hidden={!show}>
      <div className="container buy-bar-inner">
        <div>
          <strong>{name}</strong>
          <span className="muted small">
            {ml} ML · {formatPrice(priceFor(ml) ?? 0, locale)}
          </span>
        </div>
        <button className="button" onClick={() => add(slug, ml)} tabIndex={show ? 0 : -1}>
          {site.preorder ? t.common.preorder : t.common.addToCart}
        </button>
      </div>
    </div>
  );
}
