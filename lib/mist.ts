// Perfume-mist effect: a spritz of fine droplets and soft vapour drifts in from
// the side edges of the screen as the visitor scrolls. Framework-free so the
// static preview can reuse it.

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

const MAX_PARTICLES = 700;

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

export function startMist(canvas: HTMLCanvasElement, getColor: () => string): () => void {
  if (typeof window === "undefined") return () => {};
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
  let side: 1 | -1 = 1;

  // One spritz from a nozzle just outside the left or right edge.
  const spritz = (fromLeft: boolean, strength: number) => {
    const color = getColor();
    const small = w < 700;
    const x = fromLeft ? -8 : w + 8;
    const y = rand(h * 0.25, h * 0.8);
    const dir = fromLeft ? 1 : -1;
    const scale = small ? 0.6 : 1;
    const droplets = Math.round(38 * strength * scale);
    const puffs = Math.round(11 * strength * scale);
    for (let i = 0; i < droplets && particles.length < MAX_PARTICLES; i++) {
      const angle = rand(-0.32, 0.22);
      const speed = rand(7, 19) * (small ? 0.7 : 1);
      particles.push({
        x,
        y: y + rand(-6, 6),
        vx: Math.cos(angle) * speed * dir,
        vy: Math.sin(angle) * speed,
        r: rand(0.5, 1.7),
        grow: 0,
        a: rand(0.55, 0.95),
        decay: rand(0.008, 0.02),
        drag: 0.955,
        lift: 0.012,
        mist: false,
        color,
      });
    }
    for (let i = 0; i < puffs && particles.length < MAX_PARTICLES; i++) {
      const angle = rand(-0.28, 0.16);
      const speed = rand(2.5, 9) * (small ? 0.7 : 1);
      particles.push({
        x: x + dir * rand(0, 30),
        y: y + rand(-14, 14),
        vx: Math.cos(angle) * speed * dir,
        vy: Math.sin(angle) * speed,
        r: rand(14, 34) * scale,
        grow: rand(0.6, 1.6) * scale,
        a: rand(0.1, 0.2),
        decay: rand(0.0016, 0.003),
        drag: 0.988,
        lift: -0.006,
        mist: true,
        color,
      });
    }
  };

  let lastScroll = window.scrollY;
  let energy = 0;
  let lastSpritz = 0;
  const onScroll = () => {
    const y = window.scrollY;
    energy += Math.abs(y - lastScroll);
    lastScroll = y;
  };

  let frame = 0;
  let running = true;
  const tick = (now: number) => {
    if (!running) return;
    if (energy > 90 && now - lastSpritz > 260) {
      spritz(side === 1, Math.min(1.6, 0.55 + energy / 500));
      side = side === 1 ? -1 : 1;
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
      p.grow *= 0.995;
      p.a -= p.decay;
      if (p.a <= 0 || p.x < -200 || p.x > w + 200) {
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

  // A welcome spritz from both sides.
  const intro = [
    window.setTimeout(() => spritz(true, 1.1), 500),
    window.setTimeout(() => spritz(false, 1.1), 850),
  ];

  return () => {
    running = false;
    cancelAnimationFrame(frame);
    intro.forEach(clearTimeout);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}

// Colour of the mist on the current page: a product page sets data-mist.
export function mistColor(): string {
  const el = document.querySelector<HTMLElement>("[data-mist]");
  const c = el?.dataset.mist;
  return c && /^#[0-9a-f]{6}$/i.test(c) ? c : "#e3cc98";
}
