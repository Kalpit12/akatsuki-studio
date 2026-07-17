"""Extract transparent loader logo from the JPEG source."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "Loader logo.jpeg"
OUT = ROOT / "public" / "brand" / "loader-logo.png"


def dilate(mask: np.ndarray, radius: int = 2) -> np.ndarray:
    padded = np.pad(mask, radius, mode="constant", constant_values=False)
    h, w = mask.shape
    out = np.zeros_like(mask, dtype=bool)
    span = radius * 2 + 1
    for dy in range(span):
        for dx in range(span):
            out |= padded[dy : dy + h, dx : dx + w]
    return out


def extract_logo(src: Path, out: Path) -> tuple[int, int]:
    img = Image.open(src).convert("RGBA")
    arr = np.array(img, dtype=np.float32)
    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
    lum = 0.2126 * r + 0.7152 * g + 0.0722 * b

    is_red = (r > 70) & (r > g + 25) & (r > b + 25)
    is_white = lum >= 168
    seeds = is_red | is_white

    # Grow from logo ink only — ignores outer gray JPEG padding
    logo_zone = dilate(seeds, radius=5)
    red_zone = dilate(is_red, radius=3)

    alpha = np.zeros_like(lum)
    alpha[seeds] = 255

    halo = logo_zone & ~seeds
    alpha[halo] = np.clip((lum[halo] - 18) / 150 * 255, 0, 255)

    # Keep the dark cut lines inside the red mark
    alpha[(lum < 18) & red_zone] = 255

    alpha[alpha < 24] = 0

    arr[..., 3] = alpha
    result = Image.fromarray(arr.astype(np.uint8), "RGBA")

    bbox = result.getbbox()
    if bbox:
        pad = 28
        left = max(0, bbox[0] - pad)
        top = max(0, bbox[1] - pad)
        right = min(result.width, bbox[2] + pad)
        bottom = min(result.height, bbox[3] + pad)
        result = result.crop((left, top, right, bottom))

    out.parent.mkdir(parents=True, exist_ok=True)
    result.save(out, format="PNG", optimize=True, compress_level=9)
    return result.size


if __name__ == "__main__":
    size = extract_logo(SRC, OUT)
    print(f"Wrote {OUT} ({size[0]}x{size[1]})")
