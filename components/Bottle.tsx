import { productCutout, type Product } from "@/lib/products";

// The cut-out bottle, without its studio backdrop. The 15 ML flacon is shown smaller.
export function Bottle({
  product,
  ml = 75,
  className,
  eager = false,
}: {
  product: Pick<Product, "slug"> & { name: { en: string } };
  ml?: number;
  className?: string;
  eager?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={productCutout(product.slug)}
      alt={`CAPRAVA ${product.name.en} ${ml} ML`}
      width={441}
      height={675}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`bottle-photo${ml <= 15 ? " is-small" : ""}${className ? ` ${className}` : ""}`}
    />
  );
}
