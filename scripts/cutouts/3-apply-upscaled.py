"""Apply the bottle silhouettes to the 4x AI-upscaled photos.

The edge is pulled in slightly so no backdrop glow remains, and the small
CAPRAVA lettering at the base (too small for the upscaler to read) is taken
from a smooth resample instead of the AI output."""
import json, sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

cut, src, out = sys.argv[1:4]
scale = 4 / 3
for row in ("top", "bottom"):
    alpha = np.load(f"{cut}/{row}-alpha.npy")
    meta = json.load(open(f"{cut}/{row}-bbox.json"))
    h, w = int(round(alpha.shape[0] * scale)), int(round(alpha.shape[1] * scale))
    a = np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).resize((w, h), Image.LANCZOS)).astype(float) / 255
    a = ndi.grey_erosion(a, size=(5, 7))
    a = ndi.gaussian_filter(a, 1.0)
    ys = np.flatnonzero(a.max(1) > 0.5)
    top, bottom = ys[0], ys[-1]
    band0 = int(bottom - (bottom - top) * 0.085)
    blend = np.clip((np.arange(h) - band0) / 18.0, 0, 1)[:, None, None]
    for n in meta["names"]:
        try:
            ai = np.asarray(Image.open(f"{src}/x4-{n}.png").convert("RGB"))[:h, :w].astype(float)
        except FileNotFoundError:
            print(n, "not upscaled yet", flush=True)
            continue
        small = Image.open(f"{src}/src-{n}.png").convert("RGB")
        smooth = np.asarray(small.resize((small.width * 4, small.height * 4), Image.LANCZOS)).astype(float)[:h, :w]
        rgb = ai * (1 - blend) + smooth * blend
        rgba = np.dstack([np.clip(rgb, 0, 255), a * 255]).astype(np.uint8)
        bx0, by0, bx1, by1 = [int(round(v * scale)) for v in meta["bbox"]]
        img = Image.fromarray(rgba, "RGBA").crop((bx0, by0, bx1, by1))
        img.save(f"{out}/{n}.webp", quality=90, method=6)
        img.resize((img.width // 2, img.height // 2), Image.LANCZOS).save(f"{out}/{n}-360.webp", quality=88, method=6)
        bg = Image.new("RGBA", img.size, (12, 11, 10, 255)); bg.alpha_composite(img)
        bg.convert("RGB").save(f"{out}/check-{n}.png")
        print(n, img.size, flush=True)
