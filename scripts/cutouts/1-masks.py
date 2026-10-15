"""Cut the bottle out of each product photo: flood the smooth background from
the image border, stop at the bottle's rim-lit edges, keep what's enclosed."""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

src_dir, out_dir = sys.argv[1], sys.argv[2]
names = ["freski", "elegance", "ngrohtesi", "souverian", "pasterti", "tittara", "pasion", "feminitet"]
T = float(sys.argv[3]) if len(sys.argv) > 3 else 9.0


def segment(rgb):
    lum = rgb.astype(float) @ [0.299, 0.587, 0.114]
    sm = ndi.gaussian_filter(lum, 1.6)
    # colour edges matter too (green body on green glow)
    grads = [np.hypot(ndi.sobel(ndi.gaussian_filter(rgb[..., c].astype(float), 1.6), 0), ndi.sobel(ndi.gaussian_filter(rgb[..., c].astype(float), 1.6), 1)) for c in range(3)]
    g = np.maximum(np.hypot(ndi.sobel(sm, 0), ndi.sobel(sm, 1)), np.max(grads, axis=0))
    h, w = lum.shape
    walk = g < T
    lab, _ = ndi.label(walk)
    seeds = set(np.unique(np.concatenate([lab[0, :], lab[:, 0], lab[:, -1], lab[: int(h * 0.75), 0], lab[: int(h * 0.75), -1]])))
    seeds.discard(0)
    bg = np.isin(lab, list(seeds))
    bg = ndi.binary_dilation(bg, iterations=2)
    fg = ~bg
    fg = ndi.binary_fill_holes(fg)
    fg = ndi.binary_opening(fg, iterations=3)
    lab2, n = ndi.label(fg)
    if n == 0:
        return fg
    sizes = ndi.sum(fg, lab2, range(1, n + 1))
    fg = lab2 == (np.argmax(sizes) + 1)
    fg = ndi.binary_fill_holes(fg)
    return fg


sheet = []
for n in names:
    im = np.asarray(Image.open(f"{src_dir}/{n}.jpg").convert("RGB"))
    m = segment(im)
    np.save(f"{out_dir}/{n}-mask.npy", m)
    vis = im.copy()
    vis[~m] = (vis[~m] * 0.15 + np.array([0, 120, 255]) * 0.85).astype(np.uint8)
    sheet.append(Image.fromarray(vis).resize((180, int(180 * im.shape[0] / im.shape[1]))))
H = max(s.height for s in sheet)
out = Image.new("RGB", (180 * 4, H * 2))
for i, s in enumerate(sheet):
    out.paste(s, ((i % 4) * 180, (i // 4) * H))
out.save(f"{out_dir}/masks.png")
print("ok")
