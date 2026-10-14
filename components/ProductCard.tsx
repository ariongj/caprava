import Link from "next/link";
import { sizes } from "@/lib/config";
import { formatPrice, href } from "@/lib/format";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { Product } from "@/lib/products";
import { Bottle } from "./Bottle";
import { ProductName } from "./Wordmark";

export function ProductCard({ product, locale, t }: { product: Product; locale: Locale; t: Dictionary }) {
  return (
    <Link
      href={href(locale, `/shop/${product.slug}`)}
      className={`product-card${product.available ? "" : " is-upcoming"}`}
      style={{ "--accent": product.hex.accent } as React.CSSProperties}
    >
      <div className="product-card-media">
        <Bottle product={product} className="product-card-bottle" />
        {!product.available && <span className="badge">{t.common.comingSoon}</span>}
      </div>
      <div className="product-card-body">
        <p className="product-card-meta">
          {product.gender === "her" ? t.common.forHer : t.common.forHim} · {product.color[locale]}
        </p>
        <h3>{product.named ? <ProductName product={product} name={product.name[locale]} /> : product.character[locale]}</h3>
        <p className="product-card-character">{product.named ? product.character[locale] : t.product.nameSoon}</p>
        <p className="product-card-price">
          {product.available ? `${t.common.from} ${formatPrice(sizes[0].price, locale)}` : t.common.comingSoon}
        </p>
      </div>
    </Link>
  );
}
