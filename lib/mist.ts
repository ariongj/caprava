// The CAPRAVA "scent show": as the visitor scrolls, a bottle glides in from a
// side of the screen, its atomiser is pressed twice and a fine perfume jet
// opens into a drifting cloud across the page, then the bottle glides away
// and the page keeps that fragrance's colour. Between bottles, light spritzes
// drift in from the edges on scroll. Framework-free.

export type Scent = { slug: string; color: string; image: string };

// Geometry of the cut-out bottle images (public/products/cutout), as fractions
// of the image: the cap ends at capBottom, the atomiser's orifice sits near the
// top of the cap on either side.
const BOTTLE = { ratio: 441 / 675, capBottom: 0.28, orificeY: 0.075, orificeX: 0.29 };

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  grow: number;
  a: number;
  fade: number;
  drag: number;
  fall: number;
  swirl: number;
  phase: number;
  vapour: boolean;
  color: string;
};

const MAX_PARTICLES = 2600;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

// Approximately normal, for a jet that is dense in the middle.
function gauss() {
  return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
}

function mixWhite(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  const r = mix((n >> 16) & 255), g = mix((n >> 8) & 255), b = mix(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

function vapourSprite(color: string): HTMLCanvasElement {
  const size = 128;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, color + "cc");
  grad.addColorStop(0.4, color + "55");
  grad.addColorStop(1, color + "00");
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
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
      s = vapourSprite(color);
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
  const small = () => w < 700;

  const particles: Particle[] = [];

  // One instant of an aerosol jet: fast droplets in a narrow cone that brake
  // hard in the air, plus vapour that swells as it slows and drifts.
  const emitJet = (x: number, y: number, angle: number, power: number, color: string) => {
    const k = small() ? 0.6 : 1;
    const droplet = mixWhite(color, 0.65);
    const vapour = mixWhite(color, 0.3);
    const drops = Math.round(26 * power);
    for (let i = 0; i < drops && particles.length < MAX_PARTICLES; i++) {
      const a = angle + gauss() * 0.11;
      const speed = rand(16, 34) * k * power;
      particles.push({
        x, y,
        vx: Math.cos(a) * speed, vy: Math.sin(a) * speed,
        r: rand(0.35, 1.25), grow: 0, a: rand(0.35, 0.85), fade: rand(0.004, 0.011),
        drag: rand(0.88, 0.93), fall: rand(0.004, 0.02), swirl: rand(0.02, 0.08), phase: rand(0, 6.3),
        vapour: false, color: droplet,
      });
    }
    const puffs = Math.round(5 * power);
    for (let i = 0; i < puffs && particles.length < MAX_PARTICLES; i++) {
      const a = angle + gauss() * 0.16;
      const speed = rand(9, 24) * k * power;
      particles.push({
        x, y,
        vx: Math.cos(a) * speed, vy: Math.sin(a) * speed,
        r: rand(3, 8) * k, grow: rand(1.1, 2.2) * k, a: rand(0.08, 0.16), fade: rand(0.0009, 0.0018),
        drag: rand(0.9, 0.94), fall: -rand(0.002, 0.008), swirl: rand(0.08, 0.2), phase: rand(0, 6.3),
        vapour: true, color: vapour,
      });
    }
  };

  // A press of the atomiser is a short "pfft" of jets over ~0.3 s.
  const jets: { x: () => { x: number; y: number }; angle: number; until: number; power: number; color: string }[] = [];
  const press = (origin: () => { x: number; y: number }, angle: number, power: number, color: string, now: number) => {
    jets.push({ x: origin, angle, until: now + 300, power, color });
  };

  // Light spritz from just outside a screen edge, used while scrolling.
  const edgeSpritz = (fromLeft: boolean, color: string) => {
    const y = rand(h * 0.2, h * 0.85);
    const x = fromLeft ? -6 : w + 6;
    const angle = fromLeft ? rand(-0.15, 0.05) : Math.PI + rand(-0.05, 0.15);
    for (let i = 0; i < 6; i++) emitJet(x, y + rand(-4, 4), angle, 0.55, color);
  };

  // ---- background colour ----
  let currentColor = "";
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
    return scents[nextIndex++ % scents.length];
  };

  const timers: number[] = [];
  const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

  const layer = (src: string, part: "cap" | "body") => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "";
    img.className = `scent-cameo-${part}`;
    return img;
  };

  const cameo = () => {
    if (busy) return;
    busy = true;
    const scent = pick();
    const left = fromLeft;
    fromLeft = !fromLeft;
    const width = small() ? Math.min(104, w * 0.27) : Math.min(190, w * 0.14);
    const height = width / BOTTLE.ratio;
    const top = rand(h * 0.22, Math.max(h * 0.24, h * 0.62 - height));
    const dir = left ? 1 : -1;
    const tilt = 5 * dir;

    const el = document.createElement("div");
    el.className = "scent-cameo";
    el.style.width = `${width}px`;
    el.style.top = `${top}px`;
    el.style.setProperty("--glow", scent.color);
    el.style[left ? "left" : "right"] = `${small() ? 6 : Math.max(24, w * 0.04)}px`;
    const glow = document.createElement("span");
    glow.className = "scent-cameo-glow";
    const body = layer(scent.image, "body");
    const cap = layer(scent.image, "cap");
    el.append(glow, body, cap);
    stage.appendChild(el);

    const off = `translate(${left ? -170 : 170}%, 30px) rotate(${-tilt * 3}deg)`;
    el.animate(
      [
        { transform: off, opacity: 0 },
        { transform: `translate(${4 * dir}%, -6px) rotate(${tilt * 1.6}deg)`, opacity: 1, offset: 0.2 },
        { transform: `translate(0, 0) rotate(${tilt}deg)`, opacity: 1, offset: 0.27 },
        { transform: `translate(0, -4px) rotate(${tilt}deg)`, opacity: 1, offset: 0.55 },
        { transform: `translate(0, 0) rotate(${tilt}deg)`, opacity: 1, offset: 0.74 },
        { transform: off, opacity: 0 },
      ],
      { duration: 3600, easing: "cubic-bezier(0.45, 0, 0.2, 1)", fill: "forwards" },
    );

    // Where the spray leaves the atomiser, following the bottle as it moves.
    const orifice = () => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width * (left ? 1 - BOTTLE.orificeX : BOTTLE.orificeX), y: r.top + r.height * (BOTTLE.orificeY + 0.03) };
    };
    // Aim slightly upward, the way an atomiser is held.
    const angle = left ? -0.08 : Math.PI + 0.08;

    const pump = (at: number, power: number, first: boolean) => {
      later(() => {
        cap.animate(
          [
            { transform: "translateY(0)" },
            { transform: `translateY(${height * 0.035}px)`, offset: 0.35 },
            { transform: `translateY(${height * 0.035}px)`, offset: 0.6 },
            { transform: "translateY(0)" },
          ],
          { duration: 420, easing: "cubic-bezier(0.3, 0, 0.2, 1)" },
        );
        body.animate(
          [{ transform: "translateY(0)" }, { transform: `translateY(${height * 0.008}px)`, offset: 0.4 }, { transform: "translateY(0)" }],
          { duration: 420 },
        );
        later(() => {
          press(orifice, angle, power, scent.color, performance.now());
          if (first) setTint(scent.color);
        }, 110);
      }, at);
    };
    pump(1050, 1.25, true);
    pump(1750, 1.05, false);
    later(() => {
      el.remove();
      busy = false;
    }, 3700);
  };

  // ---- scroll ----
  let lastScroll = window.scrollY;
  let energy = 0;
  let travel = 0;
  let lastSpritz = 0;
  let side = true;
  const onScroll = () => {
    const y = window.scrollY;
    const d = Math.abs(y - lastScroll);
    lastScroll = y;
    energy += d;
    travel += d;
    if (travel > h * 0.85 && !busy) {
      travel = 0;
      cameo();
    }
  };

  // ---- animation loop ----
  let frame = 0;
  let running = true;
  let last = performance.now();
  const tick = (now: number) => {
    if (!running) return;
    const dt = Math.min(3, (now - last) / 16.67);
    last = now;

    for (let i = jets.length - 1; i >= 0; i--) {
      const j = jets[i];
      if (now > j.until) {
        jets.splice(i, 1);
        continue;
      }
      const o = j.x();
      emitJet(o.x, o.y, j.angle, j.power * dt, j.color);
    }
    if (energy > 90 && now - lastSpritz > 280 && !busy) {
      edgeSpritz(side, currentColor || "#e3cc98");
      side = !side;
      energy = 0;
      lastSpritz = now;
    }
    energy *= 0.96;

    ctx.clearRect(0, 0, w, h);
    const t = now / 1000;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      const drag = Math.pow(p.drag, dt);
      p.vx = p.vx * drag + Math.sin(t * 1.7 + p.phase) * p.swirl * dt;
      p.vy = p.vy * drag + (p.fall + Math.cos(t * 1.3 + p.phase) * p.swirl * 0.6) * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.vapour) {
        // Vapour swells most while it is still moving fast.
        p.r += (p.grow * 0.25 + Math.hypot(p.vx, p.vy) * 0.18) * dt;
      }
      p.a -= p.fade * dt;
      if (p.a <= 0 || p.x < -400 || p.x > w + 400 || p.y < -400 || p.y > h + 400) {
        particles.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = p.a;
      if (p.vapour) {
        const d = p.r * 2;
        ctx.drawImage(spriteFor(p.color), p.x - p.r, p.y - p.r, d, d);
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
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
      last = performance.now();
      frame = requestAnimationFrame(tick);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", onVisibility);
  frame = requestAnimationFrame(tick);
  later(cameo, 1000);

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
