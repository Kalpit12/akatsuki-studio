from PIL import Image
import numpy as np
from pathlib import Path
from collections import deque

src_dir = Path("public/clients")
out_dir = Path("public/clients/processed")
out_dir.mkdir(exist_ok=True)

# bg: white|black, enhance: always False for white-strip UI (keep original brand colors)
LOGOS = [
    ("TVS Logo.png", "white", False, None),
    ("Kyra-platinum-imports logo.jpg", "black", False, None),
    ("KYRA customs logo.jpg", "black", False, None),
    ("Eleven Motors Logo.png", "white", False, None),
    ("Autobox Motors logo.png", "black", False, None),
    ("Alliance Automotive logo.png", "white", False, None),
    ("Posh Autobody logo.png", "white", False, None),
    ("HUAWEI logo.png", "white", False, None),
    ("Craydel Logo.png", "white", False, None),
    ("Watu Logo.png", "white", False, None),
    ("Durham International school logo.png", "white", False, None),
    ("Maacaash Investements logo.jpg", "black", False, None),
    ("Stiltz Homelifts logo.png", "white", False, None),
    ("Connect Coffe logo.jpg", "white", False, None),
    ("BaoBox logo.png", "white", False, None),
    ("Slate Logo.png", "black", False, None),
    ("INTI logo.jpg", "black", False, None),
    ("Bambino logo.png", "white", False, "bambino"),
    ("Keystone Dental Logo.png", "white", False, None),
    ("ELIAS logo.png", "white", False, None),
    ("Coffee Pump Podcast logo.jpg", "white", False, None),
]

slug_map = {
    "TVS Logo.png": "tvs",
    "Kyra-platinum-imports logo.jpg": "kyra-platinum-imports",
    "KYRA customs logo.jpg": "kyra-customs",
    "Eleven Motors Logo.png": "11-motors",
    "Autobox Motors logo.png": "autobox-motors",
    "Alliance Automotive logo.png": "alliance-automotive",
    "Posh Autobody logo.png": "posh-autobody",
    "HUAWEI logo.png": "huawei",
    "Craydel Logo.png": "craydel-kenya",
    "Watu Logo.png": "watu-africa",
    "Durham International school logo.png": "durham-school",
    "Maacaash Investements logo.jpg": "macaash-investments",
    "Stiltz Homelifts logo.png": "stiltz-homelift",
    "Connect Coffe logo.jpg": "connect-coffee-museum",
    "BaoBox logo.png": "bao-box",
    "Slate Logo.png": "slate",
    "INTI logo.jpg": "inti",
    "Bambino logo.png": "bambino",
    "Keystone Dental Logo.png": "keystone-dental",
    "ELIAS logo.png": "elias-jewelers",
    "Coffee Pump Podcast logo.jpg": "coffeepump-podcast",
}


def corner_avg(arr):
    h, w = arr.shape[:2]
    pts = [
        arr[0, 0, :3],
        arr[0, w - 1, :3],
        arr[h - 1, 0, :3],
        arr[h - 1, w - 1, :3],
        arr[min(2, h - 1), min(2, w - 1), :3],
        arr[min(2, h - 1), max(0, w - 3), :3],
        arr[max(0, h - 3), min(2, w - 1), :3],
        arr[max(0, h - 3), max(0, w - 3), :3],
    ]
    return np.mean(pts, axis=0)


def flood_clear(arr, bg, tol):
    h, w = arr.shape[:2]
    visited = np.zeros((h, w), dtype=bool)
    q = deque()

    def try_seed(y, x):
        if 0 <= y < h and 0 <= x < w and not visited[y, x]:
            q.append((y, x))

    try_seed(0, 0)
    try_seed(0, w - 1)
    try_seed(h - 1, 0)
    try_seed(h - 1, w - 1)
    step_x = max(1, w // 50)
    step_y = max(1, h // 50)
    for x in range(0, w, step_x):
        try_seed(0, x)
        try_seed(h - 1, x)
    for y in range(0, h, step_y):
        try_seed(y, 0)
        try_seed(y, w - 1)

    bg = bg.astype(np.float32)
    while q:
        y, x = q.popleft()
        if visited[y, x]:
            continue
        visited[y, x] = True
        pix = arr[y, x, :3].astype(np.float32)
        if np.max(np.abs(pix - bg)) <= tol:
            arr[y, x, 3] = 0
            if y > 0 and not visited[y - 1, x]:
                q.append((y - 1, x))
            if y + 1 < h and not visited[y + 1, x]:
                q.append((y + 1, x))
            if x > 0 and not visited[y, x - 1]:
                q.append((y, x - 1))
            if x + 1 < w and not visited[y, x + 1]:
                q.append((y, x + 1))
    return arr


def soft_clear_near_bg(arr, bg, tol):
    rgb = arr[:, :, :3].astype(np.float32)
    dist = np.max(np.abs(rgb - bg.astype(np.float32)), axis=2)
    alpha = arr[:, :, 3].astype(np.float32)
    fade = np.clip((dist - tol * 0.4) / (tol * 0.6 + 1e-6), 0, 1)
    near = dist <= tol
    arr[:, :, 3] = np.where(near, (alpha * fade).astype(np.uint8), arr[:, :, 3])
    return arr


def crop_alpha(img, pad=6):
    arr = np.array(img)
    a = arr[:, :, 3]
    ys, xs = np.where(a > 8)
    if len(xs) == 0:
        return img
    left, right = int(xs.min()), int(xs.max())
    top, bottom = int(ys.min()), int(ys.max())
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(arr.shape[1] - 1, right + pad)
    bottom = min(arr.shape[0] - 1, bottom + pad)
    return Image.fromarray(arr[top : bottom + 1, left : right + 1])


def enhance_dark(arr):
    rgb = arr[:, :, :3].astype(np.float32)
    a = arr[:, :, 3]
    lum = 0.299 * rgb[:, :, 0] + 0.587 * rgb[:, :, 1] + 0.114 * rgb[:, :, 2]
    chroma = rgb.max(axis=2) - rgb.min(axis=2)
    opaque = a > 128

    dark_flat = opaque & (lum < 145) & (chroma < 48)
    rgb[dark_flat] = 255 - rgb[dark_flat]

    dark_color = opaque & (lum < 115) & (chroma >= 48)
    rgb[dark_color] = rgb[dark_color] * 0.32 + 255 * 0.68

    mid = opaque & (lum >= 145) & (lum < 205) & (chroma < 40)
    rgb[mid] = np.minimum(255, rgb[mid] * 1.2)

    arr[:, :, :3] = np.clip(rgb, 0, 255).astype(np.uint8)
    return arr


def remove_bambino_plate(arr):
    """Keep teal plate — works on white strip. Only clear outer canvas white."""
    return arr


def invert_light_logo(arr):
    """Turn near-white marks into dark so they read on white panels."""
    rgb = arr[:, :, :3].astype(np.float32)
    a = arr[:, :, 3]
    lum = 0.299 * rgb[:, :, 0] + 0.587 * rgb[:, :, 1] + 0.114 * rgb[:, :, 2]
    # only flip near-white fills, keep saturated accents (orange/gold/etc)
    chroma = rgb.max(axis=2) - rgb.min(axis=2)
    bright = (a > 128) & (lum > 200) & (chroma < 55)
    rgb[bright] = 255 - rgb[bright]
    # mid-grey strokes also darken slightly
    mid = (a > 128) & (lum > 160) & (lum <= 200) & (chroma < 40)
    rgb[mid] = rgb[mid] * 0.25
    arr[:, :, :3] = np.clip(rgb, 0, 255).astype(np.uint8)
    return arr


results = []
# logos that become white/silver after black-bg removal — invert for white strip
LIGHT_ON_DARK = {
    "slate",
    "inti",
    "autobox-motors",
    "macaash-investments",
}

for fname, bg_mode, enhance, special in LOGOS:
    path = src_dir / fname
    if not path.exists():
        results.append((fname, "MISSING FILE"))
        continue

    img = Image.open(path).convert("RGBA")
    # Cap size so flood-fill stays fast
    max_side = max(img.size)
    if max_side > 1000:
        scale = 1000 / float(max_side)
        img = img.resize(
            (max(1, int(img.width * scale)), max(1, int(img.height * scale))),
            Image.Resampling.LANCZOS,
        )
    elif max_side < 420:
        img = img.resize((img.width * 2, img.height * 2), Image.Resampling.LANCZOS)

    arr = np.array(img)
    if bg_mode == "white":
        bg = np.array([255.0, 255.0, 255.0], dtype=np.float32)
        tol = 44
    elif bg_mode == "black":
        bg = np.array([0.0, 0.0, 0.0], dtype=np.float32)
        tol = 52
    else:
        cavg = corner_avg(arr)
        if cavg.mean() > 200:
            bg = np.array([255.0, 255.0, 255.0], dtype=np.float32)
            tol = 44
        elif cavg.mean() < 45:
            bg = np.array([0.0, 0.0, 0.0], dtype=np.float32)
            tol = 52
        else:
            bg = cavg.astype(np.float32)
            tol = 42

    arr = flood_clear(arr, bg, tol)
    arr = soft_clear_near_bg(arr, bg, tol + 12)
    if special == "bambino":
        arr = remove_bambino_plate(arr)
    if enhance:
        arr = enhance_dark(arr)

    slug = slug_map[fname]
    if slug in LIGHT_ON_DARK:
        arr = invert_light_logo(arr)

    out = crop_alpha(Image.fromarray(arr), pad=8)
    target_h = 280
    w, h = out.size
    if h > 0:
        scale = target_h / float(h)
        out = out.resize((max(1, int(w * scale)), target_h), Image.Resampling.LANCZOS)

    out_path = out_dir / f"{slug}.png"
    out.save(out_path, "PNG")
    public_path = src_dir / f"{slug}.png"
    out.save(public_path, "PNG")
    results.append((slug, out.size[0], out.size[1], public_path.name))

for r in results:
    print(f"{r[0]}: {r[1]}x{r[2]} -> {r[3]}")
print(f"TOTAL {len(results)}")
