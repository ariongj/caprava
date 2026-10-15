import { productCutout, type Product } from "@/lib/products";

// The cut-out bottle, without its studio backdrop. A light streak can sweep
// across the glass (masked to the bottle's own shape). The 15 ML flacon is
// shown smaller.
export function Bottle({
  product,
  ml = 75,
  className,
  eager = false,
  sizes = "(max-width: 700px) 45vw, 22vw",
}: {
  product: Pick<Product, "slug"> & { name: { en: string } };
  ml?: number;
  className?: string;
  eager?: boolean;
  sizes?: string;
}) {
  const src = productCutout(product.slug);
  return (
    <span
      className={`bottle${ml <= 15 ? " is-small" : ""}${className ? ` ${className}` : ""}`}
      style={{ "--cut": `url(${src})` } as React.CSSProperties}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        srcSet={`${productCutout(product.slug, 360)} 360w, ${src} 720w`}
        sizes={sizes}
        alt={`CAPRAVA ${product.name.en} ${ml} ML`}
        width={441}
        height={675}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="bottle-photo"
      />
    </span>
  );
}
