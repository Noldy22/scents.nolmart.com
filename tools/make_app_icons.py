"""App icons and favicons for NolMart Scents, made from the bottle mark in img/logo-light.png
(ivory bottle with blue juice) on the site's midnight navy.

Writes:
  favicon.ico                   16, 32, 48 px (browser tabs)
  img/favicon-32.png, img/favicon-16.png
  img/apple-touch-icon.png      180 px, full bleed (iOS rounds the corners itself)
  img/icon-192.png, img/icon-512.png                    manifest "any"
  img/icon-maskable-192.png, img/icon-maskable-512.png  manifest "maskable" (mark inside the safe zone)

Usage: python -I tools/make_app_icons.py
"""
import os

import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOGO = os.path.join(ROOT, "img", "logo-light.png")
TOP, BOTTOM = (14, 38, 74), (5, 11, 22)   # stage navy -> --ink


def bottle_mark():
    logo = Image.open(LOGO).convert("RGBA")
    a = np.asarray(logo)[:, :, 3]
    cols = np.where(a.max(0) > 20)[0]
    end = cols[np.where(np.diff(cols) > 15)[0][0]] + 1          # the bottle is the first block
    rows = np.where(a[:, :end].max(1) > 20)[0]
    return logo.crop((cols[0], rows[0], end, rows[-1] + 1))


def background(size, radius=0):
    t = np.linspace(0, 1, size)[:, None, None]
    grad = (np.array(TOP) * (1 - t) + np.array(BOTTOM) * t).astype(np.uint8)
    img = Image.fromarray(np.repeat(grad, size, axis=1), "RGB").convert("RGBA")
    # soft glow behind the bottle, like the 3D stage
    glow = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(glow)
    r = size * 0.42
    d.ellipse([size / 2 - r, size * 0.56 - r, size / 2 + r, size * 0.56 + r], fill=60)
    from PIL import ImageFilter
    glow = glow.filter(ImageFilter.GaussianBlur(size * 0.12))
    tint = Image.new("RGBA", (size, size), (75, 150, 240, 0))
    tint.putalpha(glow)
    img.alpha_composite(tint)
    if radius:
        mask = Image.new("L", (size, size), 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
        img.putalpha(mask)
    return img


def icon(size, mark_height, radius=0):
    """mark_height: share of the icon height taken by the bottle."""
    big = size * 4                                               # draw large, then downsample (crisp edges)
    bg = background(big, radius * 4)
    mark = bottle_mark()
    h = int(big * mark_height)
    w = int(mark.width * h / mark.height)
    mark = mark.resize((w, h), Image.LANCZOS)
    bg.alpha_composite(mark, ((big - w) // 2, (big - h) // 2 + int(big * 0.01)))
    return bg.resize((size, size), Image.LANCZOS)


def save(img, rel):
    path = os.path.join(ROOT, rel)
    img.save(path, optimize=True)
    print("wrote", rel, img.size)


save(icon(512, 0.62).convert("RGB"), "img/icon-512.png")
save(icon(192, 0.62).convert("RGB"), "img/icon-192.png")
save(icon(512, 0.48).convert("RGB"), "img/icon-maskable-512.png")     # safe zone = central 80% circle
save(icon(192, 0.48).convert("RGB"), "img/icon-maskable-192.png")
save(icon(180, 0.6).convert("RGB"), "img/apple-touch-icon.png")
# Tab icons: rounded tile, bottle as large as possible so it reads at 16 px
fav = {s: icon(s, 0.78, radius=max(3, s // 5)) for s in (16, 32, 48, 64)}
save(fav[32], "img/favicon-32.png")
save(fav[16], "img/favicon-16.png")
fav[64].save(os.path.join(ROOT, "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)])
print("wrote favicon.ico")
