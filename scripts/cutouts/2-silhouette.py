"""Build one clean, symmetric bottle silhouette per photo row from the best
automatic masks, then write transparent cut-outs for every fragrance."""
import json
import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

src, cut, out = sys.argv[1], sys.argv[2], sys.argv[3]
rows = {
    "top": {"good": ["freski", "elegance", "ngrohtesi"], "all": ["freski", "elegance", "ngrohtesi", "souverian"]},
    "bottom": {"good": ["pasterti", "feminitet", "tittara", "pasion"], "all": ["pasterti", "tittara", "pasion", "feminitet"]},
}
meta = {}
check = []
for row, cfg in rows.items():
    loaded = [np.load(f"{cut}/{n}-mask.npy") for n in cfg["all"]]
    mh = min(m.shape[0] for m in loaded); mw = min(m.shape[1] for m in loaded)
    masks = np.array([np.load(f"{cut}/{n}-mask.npy")[:mh, :mw] for n in cfg["good"]])
    vote = masks.sum(0) >= (len(masks) + 1) // 2 + (1 if len(masks) == 4 else 0)
    h, w = vote.shape
    left = np.full(h, np.nan)
    right = np.full(h, np.nan)
    for y in range(h):
        xs = np.flatnonzero(vote[y])
        if xs.size > 20:
            left[y], right[y] = xs[0], xs[-1]
    ys = np.flatnonzero(~np.isnan(left))
    y0, y1 = ys[0], ys[-1]
    centre = np.nanmedian((left + right) / 2)
    half = np.where(np.isnan(left), 0, np.minimum(centre - left, right - centre))
    # Floor reflections show up as sudden wide spikes; a running median removes them.
    half_s = ndi.median_filter(half, size=41, mode="nearest")
    half_s = np.minimum(half, half_s * 1.02)
    half_s = ndi.median_filter(half_s, size=9, mode="nearest")
    half_s[:y0] = 0
    half_s[y1 + 1 :] = 0
    span = y1 - y0
    # The bottle's base ends at the narrowest row near the bottom; below it the
    # reflection widens again.
    lo = y0 + int(span * 0.8)
    base = lo + int(np.argmin(half_s[lo : y1 + 1]))
    # Widest point of the body, measured above the floor line.
    top_w = y0 + int(np.argmax(half_s[y0 : y0 + int(span * 0.7)]))
    # From there down the sides only move inward, which removes the floor line.
    for y in range(top_w + 1, base + 1):
        half_s[y] = min(half_s[y], half_s[y - 1] + 0.01)
    half_s[base:] = 0
    y1 = base
    # Pull the edge in a little so no background halo is left on the glass.
    half_s = np.where(half_s > 0, np.maximum(half_s - 3, 0), 0)
    yy, xx = np.mgrid[0:h, 0:w]
    sil = np.abs(xx - centre) <= half_s[:, None]
    sil = ndi.binary_opening(sil, iterations=2)
    # The cap is the narrow part on top; find where the body's shoulders start.
    widths = half_s[y0 : y1 + 1]
    body = np.max(widths)
    shoulder = y0 + int(np.argmax(widths > body * 0.62))
    cap_rows = np.flatnonzero(widths[: shoulder - y0] > 0)
    cap_top = y0
    cap_half = float(np.median(widths[: max(1, shoulder - y0 - 10)]))
    alpha = ndi.gaussian_filter(sil.astype(float), 1.1)
    fade = np.clip((y1 - np.arange(h)) / 10.0, 0, 1)[:, None]
    alpha = alpha * fade
    # Crop to the bottle with a little air.
    pad = 6
    bx0 = int(max(0, centre - body - pad)); bx1 = int(min(w, centre + body + pad))
    by0 = int(max(0, y0 - pad)); by1 = int(min(h, y1 + pad))
    cw, ch = bx1 - bx0, by1 - by0
    meta[row] = {
        "width": cw,
        "height": ch,
        # Where the atomiser sits and where the cap meets the bottle, as fractions.
        "nozzle": [round((centre - bx0) / cw, 4), round((cap_top - by0 + 14) / ch, 4)],
        "capBottom": round((shoulder - by0 - 6) / ch, 4),
        "capHalfWidth": round(cap_half / cw, 4),
    }
    for n in cfg["all"]:
        rgb = np.asarray(Image.open(f"{src}/{n}.jpg").convert("RGB"))[:mh, :mw]
        rgba = np.dstack([rgb, (alpha * 255).astype(np.uint8)])[by0:by1, bx0:bx1]
        img = Image.fromarray(rgba, "RGBA")
        img.save(f"{out}/{n}.webp", quality=88, method=6)
        bg = Image.new("RGBA", img.size, (40, 40, 48, 255))
        bg.alpha_composite(img)
        check.append(bg.convert("RGB").resize((180, int(180 * ch / cw))))
json.dump(meta, open(f"{cut}/cutout-meta.json", "w"), indent=2)
H = max(c.height for c in check)
sheet = Image.new("RGB", (180 * 4, H * 2), (40, 40, 48))
for i, c in enumerate(check):
    sheet.paste(c, ((i % 4) * 180, (i // 4) * H))
sheet.save(f"{cut}/cutouts-check.png")
print(json.dumps(meta, indent=1))
