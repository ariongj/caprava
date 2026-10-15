import { asset } from "@/lib/asset";
import type { Product } from "@/lib/products";

// Brand lettering drawn from the SVG files in public/brand, coloured with currentColor.
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={`wordmark-logo${className ? ` ${className}` : ""}`}
      role="img"
      aria-label="CAPRAVA"
      style={{ "--logo": `url(${asset("/brand/caprava.svg")})` } as React.CSSProperties}
    />
  );
}

export function ProductName({ product, name, className }: { product: Pick<Product, "wordmark">; name: string; className?: string }) {
  if (!product.wordmark) return <>{name}</>;
  return (
    <span
      className={`product-wordmark${className ? ` ${className}` : ""}`}
      role="img"
      aria-label={name}
      style={
        {
          "--wordmark": `url(${asset(product.wordmark.src)})`,
          "--ratio": product.wordmark.ratio,
        } as React.CSSProperties
      }
    />
  );
}
