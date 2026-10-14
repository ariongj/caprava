"use client";

import { useEffect, useRef } from "react";
import { mistColor, startMist } from "@/lib/mist";

export function ScentMist() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => (ref.current ? startMist(ref.current, mistColor) : undefined), []);
  return <canvas ref={ref} className="scent-mist" aria-hidden="true" />;
}
