"use client";

import { useEffect } from "react";
import { useCart } from "./CartProvider";

// Empties the bag once an order is confirmed (also covers the return from Stripe).
export function ClearCart() {
  const { ready, clear } = useCart();
  useEffect(() => {
    if (ready) clear();
  }, [ready, clear]);
  return null;
}
