// The CAPRAVA "scent show": as the visitor scrolls, a bottle glides in from a
// side of the screen, sprays a cloud of perfume across the page and glides
// back out, while the page background takes on that fragrance's colour.
// Between appearances, small spritzes drift in from the edges on scroll.
// Framework-free so the static preview can reuse it.

export type Scent = { slug: string; color: string; image: string };

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  grow: number;
  a: number;
  decay: number;
  drag: number;
  lift: number;
  mist: boolean;
  color: string;
};

const MAX_PARTICLES = 1400;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function sprite(color: string): HTMLCanvasElement {
  const size = 128;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, color);
  grad.addColorStop(0.35, color + "99");
  grad.addColorStop(1, color + "00");
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

// Brighter version of a colour for the droplets, so dark scents still sparkle.
function lighten(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  const r = mix((n >> 16) & 255), g = mix((n >> 8) & 255), b = mix(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

export function startScentShow(opts: {
  canvas: HTMLCanvasElement;
  stage: HTMLElement;
  tint: HTMLElement;
  scents: Scent[];
  // Slug of the fragrance the current page is about, if any.
  focus: () => string | null;
}): () => void {
  const { canvas, stage, tint, scents } = opts;
  if (typeof window === "undefined" || scents.length === 0) return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const sprites = new Map<string, HTMLCanvasElement>();
  const spriteFor = (color: string) => {
    let s = sprites.get(color);
    if (!s) {
      s = sprite(color);
      sprites.set(color, s);
    }
    return s;
  };

  let w = 0;
  let h = 0;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();

  const particles: Particle[] = [];
  const small = () => w < 700;

  // A burst of droplets and vapour from (x, y), aimed along dir (+1 right, -1 left).
  const spray = (x: number, y: number, dir: number, strength: number, color: string, reach = 1) => {
    const k = small() ? 0.65 : 1;
    const drop = lighten(color, 0.45);
    const droplets = Math.round(60 * strength * k);
    const puffs = Math.round(16 * strength * k);
    for (let i = 0; i < droplets && particles.length < MAX_PARTICLES; i++) {
      const angle = rand(-0.3, 0.2);
      const speed = rand(8, 24) * k * reach;
      particles.push({
        x, y: y + rand(-5, 5),
        vx: Math.cos(angle) * speed * dir, vy: Math.sin(angle) * speed,
        r: rand(0.6, 2.2), grow: 0, a: rand(0.6, 1),
        decay: rand(0.006, 0.016), drag: 0.955, lift: 0.014, mist: false, color: drop,
      });
    }
    for (let i = 0; i < puffs && particles.length < MAX_PARTICLES; i++) {
      const angle = rand(-0.26, 0.14);
      const speed = rand(3, 13) * k * reach;
      particles.push({
        x: x + dir * rand(0, 40), y: y + rand(-16, 16),
        vx: Math.cos(angle) * speed * dir, vy: Math.sin(angle) * speed,
        r: rand(18, 44) * k, grow: rand(0.9, 2.2) * k, a: rand(0.12, 0.24),
        decay: rand(0.0014, 0.0026), drag: 0.986, lift: -0.008, mist: true, color,
      });
    }
  };

  // ---- background colour ----
  let currentColor = "#000000";
  const setTint = (color: string) => {
    currentColor = color;
    tint.style.setProperty("--scent-tint", color);
  };

  // ---- the bottle that comes in, sprays and leaves ----
  let busy = false;
  let fromLeft = true;
  let nextIndex = 0;
  const pick = (): Scent => {
    const f = opts.focus();
    const focused = f ? scents.find((s) => s.slug === f) : undefined;
    if (focused) return focused;
    const s = scents[nextIndex % scents.length];
    nextIndex++;
    return s;
  };

  const timers: number[] = [];
  const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

  const cameo = () => {
    if (busy) return;
    busy = true;
    const scent = pick();
    const left = fromLeft;
    fromLeft = !fromLeft;
    const size = small() ? Math.min(120, w * 0.3) : Math.min(210, w * 0.15);
    const top = rand(h * 0.22, h * 0.5);
    const el = document.createElement("div");
    el.className = "scent-cameo";
    el.style.width = `${size}px`;
    el.style.top = `${top}px`;
    el.style[left ? "left" : "right"] = `${small() ? 4 : 24}px`;
    const img = document.createElement("img");
    img.src = scent.image;
    img.alt = "";
    el.appendChild(img);
    stage.appendChild(el);

    const dir = left ? 1 : -1;
    const tilt = 14 * dir;
    const out = `translateX(${left ? -140 : 140}%) rotate(${-tilt}deg)`;
    const inPose = `translateX(0) rotate(${tilt}deg)`;
    const press = `translateX(0) translateY(6px) rotate(${tilt}deg) scale(0.98)`;
    el.animate(
      [
        { transform: out, opacity: 0, offset: 0 },
        { transform: inPose, opacity: 1, offset: 0.24 },
        { transform: press, opacity: 1, offset: 0.3 },
        { transform: inPose, opacity: 1, offset: 0.36 },
        { transform: press, opacity: 1, offset: 0.44 },
        { transform: inPose, opacity: 1, offset: 0.62 },
        { transform: out, opacity: 0, offset: 1 },
      ],
      { duration: 3200, easing: "cubic-bezier(0.45, 0, 0.2, 1)", fill: "forwards" },
    );

    const nozzle = () => {
      const r = el.getBoundingClientRect();
      // The atomiser sits at the top of the cap; the bottle leans toward the page.
      return { x: r.left + r.width * (left ? 0.72 : 0.28), y: r.top + r.height * 0.2 };
    };
    // Two presses of the atomiser, each a big cloud of that scent.
    later(() => {
      const p = nozzle();
      spray(p.x, p.y, dir, 2.4, scent.color, 1.25);
      setTint(scent.color);
    }, 3200 * 0.3);
    later(() => {
      const p = nozzle();
      spray(p.x, p.y, dir, 1.8, scent.color, 1.1);
    }, 3200 * 0.44);
    later(() => {
      el.remove();
      busy = false;
    }, 3300);
  };

  // ---- scroll ----
  let lastScroll = window.scrollY;
  let energy = 0;
  let travel = 0;
  let lastSpritz = 0;
  let side = 1;
  const onScroll = () => {
    const y = window.scrollY;
    const d = Math.abs(y - lastScroll);
    lastScroll = y;
    energy += d;
    travel += d;
    if (travel > h * 0.9 && !busy) {
      travel = 0;
      cameo();
    }
  };

  // ---- animation loop ----
  let frame = 0;
  let running = true;
  const tick = (now: number) => {
    if (!running) return;
    if (energy > 80 && now - lastSpritz > 240) {
      const x = side === 1 ? -8 : w + 8;
      spray(x, rand(h * 0.2, h * 0.85), side, Math.min(1, 0.35 + energy / 900), currentColor === "#000000" ? "#e3cc98" : currentColor, 0.8);
      side = -side;
      energy = 0;
      lastSpritz = now;
    }
    energy *= 0.96;

    ctx.clearRect(0, 0, w, h);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.lift;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.grow;
      p.grow *= 0.993;
      p.a -= p.decay;
      if (p.a <= 0 || p.x < -300 || p.x > w + 300) {
        particles.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = p.a;
      if (p.mist) {
        const d = p.r * 2;
        ctx.drawImage(spriteFor(p.color), p.x - p.r, p.y - p.r, d, d);
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    frame = requestAnimationFrame(tick);
  };

  const onVisibility = () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(frame);
    } else if (!running) {
      running = true;
      frame = requestAnimationFrame(tick);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", onVisibility);
  frame = requestAnimationFrame(tick);
  later(cameo, 1200);

  return () => {
    running = false;
    cancelAnimationFrame(frame);
    timers.forEach(clearTimeout);
    stage.replaceChildren();
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}

// Slug of the fragrance a product page is about (set with data-mist-slug).
export function focusedScent(): string | null {
  return document.querySelector<HTMLElement>("[data-mist-slug]")?.dataset.mistSlug ?? null;
}
