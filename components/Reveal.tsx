"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SELECTOR = ".section-title, .launch-card, .product-card, .pillar, .collection-item, .notes-col, .format, .roadmap li, .pdp-info > *";

// Lets content rise into place as it scrolls into view. Without JavaScript,
// or with reduced motion, everything simply shows.
export function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR)).filter((el) => {
      const r = el.getBoundingClientRect();
      return r.top > window.innerHeight * 0.92;
    });
    els.forEach((el) => el.classList.add("reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            const siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
            el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 6) * 70}ms`;
            el.classList.add("is-visible");
            io.unobserve(el);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
