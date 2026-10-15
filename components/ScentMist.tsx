"use client";

import { useEffect, useRef } from "react";
import { focusedScent, startScentShow, type Scent } from "@/lib/mist";
import { productImage, products } from "@/lib/products";

// The order the bottles appear in as you scroll: black, then red, then the rest.
const ORDER = ["souverian", "pasion", "tittara", "elegance", "freski", "ngrohtesi", "feminitet", "pasterti"];

export const scents: Scent[] = ORDER.map((slug) => {
  const p = products.find((x) => x.slug === slug)!;
  return { slug, color: p.hex.glow, image: productImage(slug) };
});

export function ScentMist() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const tint = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!canvas.current || !stage.current || !tint.current) return;
    return startScentShow({ canvas: canvas.current, stage: stage.current, tint: tint.current, scents, focus: focusedScent });
  }, []);
  return (
    <>
      <div ref={tint} className="scent-tint" aria-hidden="true" />
      <canvas ref={canvas} className="scent-mist" aria-hidden="true" />
      <div ref={stage} className="scent-stage" aria-hidden="true" />
    </>
  );
}
