import { productImage, type Product } from "@/lib/products";

// Product photo of the bottle. The 15 ML flacon is shown slightly smaller.
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
      src={productImage(product.slug)}
      alt={`CAPRAVA ${product.name.en} ${ml} ML`}
      width={540}
      height={840}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`bottle-photo${ml <= 15 ? " is-small" : ""}${className ? ` ${className}` : ""}`}
    />
  );
}
