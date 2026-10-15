"""Real-ESRGAN x4plus (RRDBNet) inference in plain numpy, loading the official
PyTorch weights without PyTorch."""
import pickle
import sys
import time
import zipfile
from collections import OrderedDict

import numpy as np
from numpy.lib.stride_tricks import sliding_window_view
from PIL import Image


def load_pth(path):
    zf = zipfile.ZipFile(path)
    prefix = zf.namelist()[0].split("/")[0]

    class Storage:
        def __init__(self, key, dtype):
            self.key, self.dtype = key, dtype

    def rebuild(storage, offset, size, stride, *args):
        raw = np.frombuffer(zf.read(f"{prefix}/data/{storage.key}"), dtype=storage.dtype)
        n = int(np.prod(size)) if size else 1
        arr = raw[offset : offset + n] if not stride or list(stride) == list(np.cumprod([1, *size[::-1]])[:-1][::-1]) else None
        if arr is None:
            arr = np.lib.stride_tricks.as_strided(raw[offset:], shape=size, strides=[s * raw.itemsize for s in stride]).copy()
        return np.array(arr, dtype=np.float32).reshape(size)

    class U(pickle.Unpickler):
        def find_class(self, module, name):
            if module == "torch._utils" and name == "_rebuild_tensor_v2":
                return rebuild
            if module == "collections" and name == "OrderedDict":
                return OrderedDict
            if module == "torch" and name.endswith("Storage"):
                return {"FloatStorage": np.float32, "HalfStorage": np.float16}.get(name, np.float32)
            raise pickle.UnpicklingError(f"refusing {module}.{name}")

        def persistent_load(self, pid):
            _, dtype, key, _, _ = pid
            return Storage(key, dtype)

    data = U(zf.open(f"{prefix}/data.pkl")).load()
    return data.get("params_ema", data.get("params", data))


def conv(x, w, b):
    # x: (H, W, C); w: (O, C, 3, 3)
    h, wd, c = x.shape
    xp = np.pad(x, ((1, 1), (1, 1), (0, 0)))
    cols = sliding_window_view(xp, (3, 3), axis=(0, 1)).reshape(h * wd, c * 9)
    out = cols @ w.reshape(w.shape[0], -1).T
    out += b
    return out.reshape(h, wd, -1)


def lrelu(x):
    return np.where(x > 0, x, x * 0.2)


def up2(x):
    return x.repeat(2, axis=0).repeat(2, axis=1)


def rrdbnet(x, P):
    c = lambda name, t: conv(t, P[f"{name}.weight"], P[f"{name}.bias"])
    feat = c("conv_first", x)
    body = feat
    for i in range(23):
        inp = body
        for r in (1, 2, 3):
            n = f"body.{i}.rdb{r}"
            x1 = lrelu(c(f"{n}.conv1", inp))
            x2 = lrelu(c(f"{n}.conv2", np.concatenate([inp, x1], 2)))
            x3 = lrelu(c(f"{n}.conv3", np.concatenate([inp, x1, x2], 2)))
            x4 = lrelu(c(f"{n}.conv4", np.concatenate([inp, x1, x2, x3], 2)))
            x5 = c(f"{n}.conv5", np.concatenate([inp, x1, x2, x3, x4], 2))
            inp = x5 * 0.2 + inp
        body = inp * 0.2 + body
    feat = feat + c("conv_body", body)
    feat = lrelu(c("conv_up1", up2(feat)))
    feat = lrelu(c("conv_up2", up2(feat)))
    return c("conv_last", lrelu(c("conv_hr", feat)))


def upscale(img, P, tile=96, pad=12):
    x = np.asarray(img.convert("RGB"), dtype=np.float32) / 255.0
    h, w, _ = x.shape
    out = np.zeros((h * 4, w * 4, 3), np.float32)
    for y0 in range(0, h, tile):
        for x0 in range(0, w, tile):
            y1, x1 = min(h, y0 + tile), min(w, x0 + tile)
            py0, px0 = max(0, y0 - pad), max(0, x0 - pad)
            py1, px1 = min(h, y1 + pad), min(w, x1 + pad)
            o = rrdbnet(x[py0:py1, px0:px1], P)
            oy, ox = (y0 - py0) * 4, (x0 - px0) * 4
            out[y0 * 4 : y1 * 4, x0 * 4 : x1 * 4] = o[oy : oy + (y1 - y0) * 4, ox : ox + (x1 - x0) * 4]
    return Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8))


if __name__ == "__main__":
    weights, src, dst = sys.argv[1:4]
    P = load_pth(weights)
    t = time.time()
    upscale(Image.open(src), P).save(dst)
    print(f"{dst} in {time.time() - t:.1f}s")
