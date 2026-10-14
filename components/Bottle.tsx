import type { Product } from "@/lib/products";

function isLight(hex: string): boolean {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 150;
}

// Illustrated CAPRAVA bottle, coloured per fragrance. Swap for product
// photography once it exists.
export function Bottle({
  product,
  ml = 75,
  className,
  title,
}: {
  product: Pick<Product, "slug" | "hex" | "named"> & { name: { sq: string; en: string } };
  ml?: number;
  className?: string;
  title?: string;
}) {
  const id = `b-${product.slug}-${ml}`;
  const { liquid, glow } = product.hex;
  const ink = isLight(liquid) ? "#2b2620" : "#f4efe4";
  const small = ml <= 15;
  // The 15 ML flacon is shorter and slimmer.
  const body = small ? { x: 52, y: 150, w: 96, h: 150, r: 14 } : { x: 30, y: 92, w: 140, h: 210, r: 18 };
  const cap = small ? { x: 76, y: 92, w: 48, h: 44 } : { x: 66, y: 16, w: 68, h: 60 };
  const collarY = cap.y + cap.h;
  const label = product.named ? product.name.en.toUpperCase() : "";

  return (
    <svg viewBox="0 0 200 330" className={className} role="img" aria-label={title ?? `CAPRAVA ${product.name.en} ${ml} ML`}>
      <defs>
        <linearGradient id={`${id}-gold`} x1="0" x2="1">
          <stop offset="0" stopColor="#6e5630" />
          <stop offset="0.35" stopColor="#e9d3a0" />
          <stop offset="0.55" stopColor="#b8995c" />
          <stop offset="1" stopColor="#5d4826" />
        </linearGradient>
        <linearGradient id={`${id}-liquid`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={glow} stopOpacity="0.95" />
          <stop offset="0.45" stopColor={liquid} />
          <stop offset="1" stopColor={liquid} stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" x2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="0.12" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="0.85" stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id={`${id}-floor`}>
          <stop offset="0" stopColor={glow} stopOpacity="0.45" />
          <stop offset="1" stopColor={glow} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="100" cy={body.y + body.h + 8} rx={body.w * 0.75} ry="12" fill={`url(#${id}-floor)`} />

      {/* cap */}
      <rect x={cap.x} y={cap.y} width={cap.w} height={cap.h} rx="3" fill={`url(#${id}-gold)`} />
      <rect x={cap.x} y={cap.y + cap.h * 0.72} width={cap.w} height="2" fill="#000" opacity="0.35" />
      <rect x={cap.x + 6} y={cap.y + 4} width="5" height={cap.h - 8} rx="2" fill="#fff" opacity="0.35" />
      {/* collar */}
      <rect x={100 - cap.w * 0.3} y={collarY} width={cap.w * 0.6} height={body.y - collarY} fill="#1c1a18" />

      {/* glass body */}
      <rect x={body.x} y={body.y} width={body.w} height={body.h} rx={body.r} fill="#0b0a0a" />
      <rect
        x={body.x + 7}
        y={body.y + 7}
        width={body.w - 14}
        height={body.h - 14}
        rx={body.r - 6}
        fill={`url(#${id}-liquid)`}
      />
      <rect x={body.x} y={body.y} width={body.w} height={body.h} rx={body.r} fill={`url(#${id}-glass)`} stroke="#ffffff" strokeOpacity="0.22" />
      <rect x={body.x + 12} y={body.y + 14} width="6" height={body.h - 28} rx="3" fill="#fff" opacity="0.22" />

      {/* label */}
      <g fill={ink} textAnchor="middle" fontFamily="var(--font-display), sans-serif">
        <text x="100" y={body.y + body.h * 0.46} fontSize={small ? 10 : 15} fontWeight="700" letterSpacing={small ? 2.5 : 4}>
          CAPRAVA
        </text>
        <line x1={100 - (small ? 16 : 26)} x2={100 + (small ? 16 : 26)} y1={body.y + body.h * 0.46 + 8} y2={body.y + body.h * 0.46 + 8} stroke={ink} strokeOpacity="0.5" strokeWidth="0.75" />
        {label && (
          <text x="100" y={body.y + body.h * 0.46 + (small ? 20 : 25)} fontSize={small ? 6.5 : 8.5} letterSpacing="2.5" opacity="0.85">
            {label}
          </text>
        )}
        <text x="100" y={body.y + body.h - (small ? 14 : 20)} fontSize={small ? 4.6 : 6} letterSpacing={small ? 0.8 : 1.4} opacity="0.7">
          {ml} ML · EAU DE PARFUM
        </text>
      </g>
    </svg>
  );
}
