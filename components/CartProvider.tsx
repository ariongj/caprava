"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { maxQtyPerLine, priceFor } from "@/lib/config";
import { getProduct } from "@/lib/products";
import type { CartLine } from "@/lib/orders";

type CartContextValue = {
  lines: CartLine[];
  ready: boolean;
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (slug: string, ml: number, qty?: number) => void;
  setQty: (slug: string, ml: number, qty: number) => void;
  remove: (slug: string, ml: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "caprava-cart";

function sanitize(lines: unknown): CartLine[] {
  if (!Array.isArray(lines)) return [];
  return lines.filter(
    (l): l is CartLine =>
      l &&
      typeof l.slug === "string" &&
      getProduct(l.slug)?.available === true &&
      priceFor(l.ml) !== undefined &&
      Number.isInteger(l.qty) &&
      l.qty > 0,
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      setLines(sanitize(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")));
    } catch {
      // Storage unavailable or corrupt: start with an empty bag.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Ignore: the bag still works for this visit.
    }
  }, [lines, ready]);

  const add = useCallback((slug: string, ml: number, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.slug === slug && l.ml === ml);
      if (existing) {
        return prev.map((l) => (l === existing ? { ...l, qty: Math.min(maxQtyPerLine, l.qty + qty) } : l));
      }
      return [...prev, { slug, ml, qty: Math.min(maxQtyPerLine, qty) }];
    });
    setOpen(true);
  }, []);

  const setQty = useCallback((slug: string, ml: number, qty: number) => {
    setLines((prev) =>
      qty < 1
        ? prev.filter((l) => !(l.slug === slug && l.ml === ml))
        : prev.map((l) => (l.slug === slug && l.ml === ml ? { ...l, qty: Math.min(maxQtyPerLine, qty) } : l)),
    );
  }, []);

  const remove = useCallback((slug: string, ml: number) => {
    setLines((prev) => prev.filter((l) => !(l.slug === slug && l.ml === ml)));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const subtotal = lines.reduce((s, l) => s + (priceFor(l.ml) ?? 0) * l.qty, 0);
    return { lines, ready, count, subtotal, open, setOpen, add, setQty, remove, clear };
  }, [lines, ready, open, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
