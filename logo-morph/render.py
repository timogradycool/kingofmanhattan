"""Render a looping particle-morph video: Backstage Bucks County <-> Love Saves the Day.

Usage: python3 render.py [--preview] [--fps 30]
Outputs:
  backstage_lstd_loop.mp4   seamless loop (no fades, last frame flows into first)
  backstage_lstd_fade.mp4   fades in from black / out to black (loops black-to-black)
"""
import argparse
import math
import subprocess
import sys
from multiprocessing import Pool

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

W, H = 1920, 1080
CX, CY = W / 2, H / 2
RNG = np.random.default_rng(7)

# ---------------------------------------------------------------- timeline (s)
HOLD_A = 2.6     # Backstage on screen
MORPH_1 = 2.8    # Backstage -> Love Saves the Day
HOLD_B = 3.2     # Love Saves the Day on screen
MORPH_2 = 2.8    # Love Saves the Day -> Backstage
LOOP = HOLD_A + MORPH_1 + HOLD_B + MORPH_2
FADE = 1.0       # fade length for the fade version

STRIPES = [(250, 190, 62), (240, 115, 48), (213, 51, 56), (108, 31, 74)]


# ---------------------------------------------------------------- helpers
def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0.0, 1.0)
    return t * t * (3 - 2 * t)


def ease_io(x):
    x = np.clip(x, 0.0, 1.0)
    return np.where(x < 0.5, 4 * x ** 3, 1 - (-2 * x + 2) ** 3 / 2)


def key_backstage(path):
    """Gray-background logo -> RGBA (per-pixel colour key, holes stay clear)."""
    im = np.asarray(Image.open(path).convert("RGB")).astype(np.float32)
    bg = np.median(np.concatenate([im[:20].reshape(-1, 3), im[-20:].reshape(-1, 3)]), axis=0)
    dist = np.sqrt(((im - bg) ** 2).sum(-1))
    a = np.clip((dist - 8) / 45, 0, 1)
    rgb = (im - bg * (1 - a[..., None])) / np.maximum(a[..., None], 1e-3)
    return to_rgba(rgb, a)


def key_black(path):
    """Black-background sign -> RGBA. Flood-fill from the border so the black
    lettering inside the sign stays opaque."""
    img = Image.open(path).convert("RGB")
    im = np.asarray(img).astype(np.float32)
    mx = im.max(-1)
    dark = Image.fromarray(((mx < 34) * 255).astype(np.uint8)).copy()  # copy: fromarray images are read-only
    h, w = mx.shape
    for seed in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]:
        if dark.getpixel(seed) == 255:
            ImageDraw.floodfill(dark, seed, 128)
    outside = np.asarray(dark) == 128
    a = np.where(outside, np.clip((mx - 6) / 30, 0, 1), 1.0)
    rgb = im / np.maximum(a[..., None], 1e-3)
    return to_rgba(rgb, a)


def to_rgba(rgb, a):
    arr = np.dstack([np.clip(rgb, 0, 255), a * 255]).astype(np.uint8)
    im = Image.fromarray(arr, "RGBA")
    return im.crop(im.getchannel("A").point(lambda v: 255 if v > 20 else 0).getbbox())


def fit(im, max_w, max_h):
    s = min(max_w / im.width, max_h / im.height)
    return im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)


def placed_layer(im):
    """Logo centred on a canvas-sized float RGBA layer (premultiplied)."""
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    canvas.paste(im, (round(CX - im.width / 2), round(CY - im.height / 2)), im)
    arr = np.asarray(canvas).astype(np.float32) / 255
    arr[..., :3] *= arr[..., 3:]
    return arr


def transform(im, scale=1.0, angle=0.0, dx=0.0, dy=0.0, pivot=None):
    """Scale/rotate a logo about a pivot (relative to logo) and place on canvas."""
    pw, ph = pivot if pivot else (im.width / 2, im.height / 2)
    # pivot location on canvas at rest
    ox, oy = CX - im.width / 2 + pw, CY - im.height / 2 + ph
    a = math.radians(angle)
    c, s = math.cos(a) / scale, math.sin(a) / scale
    # inverse map: canvas (x,y) -> source (u,v)
    tx, ty = ox + dx, oy + dy
    coeffs = (c, s, pw - c * tx - s * ty, -s, c, ph + s * tx - c * ty)
    out = im.transform((W, H), Image.AFFINE, coeffs, resample=Image.BICUBIC)
    arr = np.asarray(out).astype(np.float32) / 255
    arr[..., :3] *= arr[..., 3:]
    return arr


def sample_particles(layer, n):
    a = layer[..., 3]
    ys, xs = np.nonzero(a > 0.35)
    idx = RNG.choice(len(xs), size=n, replace=len(xs) < n)
    x = xs[idx] + RNG.random(n) - 0.5
    y = ys[idx] + RNG.random(n) - 0.5
    col = layer[ys[idx], xs[idx], :3] / a[ys[idx], xs[idx], None]
    return np.stack([x, y], 1), col


# ---------------------------------------------------------------- scene setup
BS = fit(key_backstage("backstage.png"), 1380, 760)
LS = fit(key_black("lovesavestheday.png"), 1500, 900)
BS_REST = placed_layer(BS)
LS_REST = placed_layer(LS)

N = 220_000
PA, CA = sample_particles(BS_REST, N)
PB, CB = sample_particles(LS_REST, N)


def angular_order(p):
    d = p - np.array([CX, CY])
    ang = np.arctan2(d[:, 1], d[:, 0])
    r = np.hypot(d[:, 0], d[:, 1])
    return np.lexsort((r, np.round(ang * 40)))  # sweep by angle, then radius


oa, ob = angular_order(PA), angular_order(PB)
PA, CA = PA[oa], CA[oa]
PB, CB = PB[ob], CB[ob]

JIT = RNG.normal(size=(N, 2)).astype(np.float32)          # scatter direction
SPIN = (0.6 + 0.8 * RNG.random(N)).astype(np.float32)     # per-particle swirl
SPARK = RNG.random(N).astype(np.float32)

# background: soft charcoal with vignette
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
rr = np.hypot((xx - CX) / W, (yy - CY) / H)
BG = (np.array([30, 27, 30], np.float32) / 255) * (1.15 - 0.9 * rr[..., None] ** 1.3)
BG = np.clip(BG, 0, 1)

# drifting dust (periodic over LOOP so the loop is seamless)
ND = 140
DUST_P = RNG.random((ND, 2)) * [W, H]
DUST_V = (RNG.choice([-1, 1], ND) * W).astype(np.float32)   # one screen-width per loop
DUST_SZ = 1 + 2.5 * RNG.random(ND) ** 3
DUST_PH = RNG.random(ND) * 2 * math.pi


def gauss_blur(arr, radius, down=4):
    """Cheap glow: downsample, PIL blur, upsample."""
    h, w = arr.shape[:2]
    small = Image.fromarray(np.clip(arr * 255, 0, 255).astype(np.uint8)).resize((w // down, h // down), Image.BILINEAR)
    small = small.filter(ImageFilter.GaussianBlur(radius / down))
    return np.asarray(small.resize((w, h), Image.BILINEAR)).astype(np.float32) / 255


def splat(pos, col, weight, scale=2):
    """Accumulate particles into a half-res buffer with bilinear weights."""
    hw, hh = W // scale, H // scale
    x = pos[:, 0] / scale
    y = pos[:, 1] / scale
    x0 = np.floor(x).astype(np.int64)
    y0 = np.floor(y).astype(np.int64)
    fx, fy = x - x0, y - y0
    acc = np.zeros((hh * hw, 4), np.float32)
    for ox, oy, wgt in ((0, 0, (1 - fx) * (1 - fy)), (1, 0, fx * (1 - fy)), (0, 1, (1 - fx) * fy), (1, 1, fx * fy)):
        xi, yi = x0 + ox, y0 + oy
        ok = (xi >= 0) & (xi < hw) & (yi >= 0) & (yi < hh)
        flat = (yi[ok] * hw + xi[ok])
        ww = (wgt * weight)[ok]
        acc[:, 3] += np.bincount(flat, ww, hh * hw)
        for c in range(3):
            acc[:, c] += np.bincount(flat, ww * col[ok, c], hh * hw)
    acc = acc.reshape(hh, hw, 4)
    rgb = acc[..., :3] / np.maximum(acc[..., 3:], 1e-6)
    alpha = 1 - np.exp(-acc[..., 3:] * (1.6 if scale > 1 else 3.6))
    layer = np.concatenate([rgb * alpha, alpha], -1)
    img = Image.fromarray(np.clip(layer * 255, 0, 255).astype(np.uint8), "RGBA").resize((W, H), Image.BILINEAR)
    return np.asarray(img).astype(np.float32) / 255


def over(dst_rgb, layer, opacity=1.0):
    a = layer[..., 3:] * opacity
    return layer[..., :3] * opacity + dst_rgb * (1 - a)


def stripe_band(t, direction):
    """Retro four-colour band sweeping diagonally across the frame. t in [0,1]."""
    band_h = 46
    total = band_h * 4
    img = Image.new("RGBA", (W * 3, total), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    for i, c in enumerate(STRIPES):
        d.rectangle([0, i * band_h, W * 3, (i + 1) * band_h - 1], fill=c + (255,))
    # rounded leading/trailing ends via a horizontal alpha ramp
    ramp = np.ones(W * 3, np.float32)
    edge = 420
    ramp[:edge] = np.linspace(0, 1, edge) ** 1.5
    ramp[-edge:] = np.linspace(1, 0, edge) ** 1.5
    arr = np.asarray(img).astype(np.float32) / 255
    arr[..., 3] *= ramp[None, :]
    img = Image.fromarray((arr * 255).astype(np.uint8), "RGBA").rotate(-14 * direction, expand=True, resample=Image.BICUBIC)
    e = float(ease_io(t))
    span = W + img.width
    x = -img.width + e * span if direction > 0 else W - e * span
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    canvas.paste(img, (round(x), round(CY - img.height / 2)), img)
    out = np.asarray(canvas).astype(np.float32) / 255
    out[..., :3] *= out[..., 3:]
    return out


def heart_ring(t):
    """Expanding heart outline when the sign lands. t in [0,1]."""
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    if t <= 0 or t >= 1:
        return np.zeros((H, W, 4), np.float32)
    d = ImageDraw.Draw(canvas)
    s = 30 + 34 * float(ease_io(t)) ** 0.7
    alpha = int(255 * (1 - t) ** 1.6)
    th = np.linspace(0, 2 * math.pi, 300)
    hx = 16 * np.sin(th) ** 3
    hy = -(13 * np.cos(th) - 5 * np.cos(2 * th) - 2 * np.cos(3 * th) - np.cos(4 * th))
    pts = list(zip(CX + hx * s, CY + 20 + hy * s))
    for wdt, col in ((22, (240, 70, 70)), (8, (255, 190, 200))):
        d.line(pts + [pts[0]], fill=col + (alpha,), width=wdt, joint="curve")
    out = np.asarray(canvas).astype(np.float32) / 255
    out[..., :3] *= out[..., 3:]
    return out


def dust_layer(t):
    phase = (t % LOOP) / LOOP
    p = DUST_P.copy()
    p[:, 0] = (p[:, 0] + DUST_V * phase) % W
    p[:, 1] += 18 * np.sin(2 * math.pi * phase * 2 + DUST_PH)
    tw = 0.35 + 0.65 * (0.5 + 0.5 * np.sin(2 * math.pi * phase * 6 + DUST_PH))
    canvas = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(canvas)
    for (x, y), r, b in zip(p, DUST_SZ, tw):
        d.ellipse([x - r, y - r, x + r, y + r], fill=int(70 * b))
    return np.asarray(canvas.filter(ImageFilter.GaussianBlur(1.2))).astype(np.float32)[..., None] / 255


# ---------------------------------------------------------------- morph
def morph_state(u, src_p, src_c, dst_p, dst_c, direction):
    """Particle positions/colours at morph progress u in [0,1]."""
    # stagger: particles leave in a sweep across the logo
    key = (src_p[:, 0] - CX) / W * direction
    delay = 0.28 * (key - key.min()) / (np.ptp(key) + 1e-6) + 0.04 * SPARK
    dmax = 0.32
    ui = np.clip((u - delay) / (1 - dmax), 0, 1)
    e = ease_io(ui)
    mid = np.sin(np.pi * e)                         # 0 at ends, 1 mid-flight

    p = src_p + (dst_p - src_p) * e[:, None]
    # swirl around centre
    c = np.array([CX, CY])
    d = p - c
    r = np.hypot(d[:, 0], d[:, 1])
    # differential rotation: inner particles whip round faster -> spiral arms
    ang = direction * SPIN * mid ** 1.2 * (1.0 + 3.2 * np.exp(-r / 320))
    ca, sa = np.cos(ang), np.sin(ang)
    d = np.stack([d[:, 0] * ca - d[:, 1] * sa, d[:, 0] * sa + d[:, 1] * ca], 1)
    # radial breathe + random scatter
    d *= (1 + 0.16 * mid)[:, None]
    d += JIT * (16 * mid)[:, None]
    p = c + d

    cm = smoothstep(0.35, 0.75, e)[:, None]
    col = src_c * (1 - cm) + dst_c * cm
    # hot glow mid-flight, nudged toward warm white
    hot = (0.28 * mid ** 2)[:, None]
    col = col * (1 - hot) + np.array([1.0, 0.86, 0.78]) * hot
    weight = 1.0
    return p, col, weight


def frame(t, fade_version=False):
    if fade_version:   # hold Backstage at rest during the fade in / fade out
        t_loop = t - FADE
        if t_loop < 0 or t_loop >= LOOP:
            t_loop = 0.0
    else:
        t_loop = t % LOOP
    rgb = BG.copy()
    rgb = rgb + dust_layer(t_loop) * np.array([1.0, 0.8, 0.75])

    ta = HOLD_A
    tb = ta + MORPH_1
    tc = tb + HOLD_B

    if t_loop < ta:                                   # Backstage hold
        h = t_loop / HOLD_A
        env = math.sin(math.pi * h)
        lay = transform(BS, scale=1 + 0.025 * env, dy=-10 * env)
        rgb = over(rgb, lay)
    elif t_loop < tb:                                 # Backstage -> LSTD
        u = (t_loop - ta) / MORPH_1
        rgb = draw_morph(rgb, u, PA, CA, PB, CB, BS_REST, LS_REST, +1)
    elif t_loop < tc:                                 # LSTD hold: sign swings
        h = (t_loop - tb) / HOLD_B
        env = math.sin(math.pi * h)
        ang = 3.2 * env * math.sin(2 * math.pi * h * 1.5)
        lay = transform(LS, scale=1 + 0.02 * env, angle=ang, pivot=(LS.width / 2, 0))
        rgb = over(rgb, heart_ring(h * 1.6), 0.9)        # ring expands behind the sign
        rgb = over(rgb, gauss_blur(lay, 60), 0.18 * env)
        rgb = over(rgb, lay)
    else:                                             # LSTD -> Backstage
        u = (t_loop - tc) / MORPH_2
        rgb = draw_morph(rgb, u, PB, CB, PA, CA, LS_REST, BS_REST, -1)

    if fade_version:
        total = LOOP + 2 * FADE
        f = min(1.0, t / FADE, (total - t) / FADE)
        rgb = rgb * max(0.0, f)
    return (np.clip(rgb, 0, 1) * 255).astype(np.uint8)


def draw_morph(rgb, u, sp, sc, dp, dc, src_rest, dst_rest, direction):
    # retro stripe band sweeps through behind the particles
    band_t = (u - 0.05) / 0.8
    if 0 < band_t < 1:
        rgb = over(rgb, stripe_band(band_t, direction), 0.92)

    p, col, w = morph_state(u, sp, sc, dp, dc, direction)
    parts = splat(p, col, w, scale=1)
    glow = gauss_blur(parts, 18, down=2)
    flight = float(np.sin(np.pi * np.clip(u, 0, 1)))

    a_out = 1 - smoothstep(0.0, 0.14, u)          # crisp source dissolves
    a_in = smoothstep(0.84, 1.0, u)               # crisp destination resolves
    p_vis = min(smoothstep(0.0, 0.06, u), 1 - smoothstep(0.93, 1.0, u))

    rgb = rgb + glow[..., :3] * (0.35 * flight)
    rgb = over(rgb, parts, float(p_vis))
    rgb = over(rgb, src_rest, float(a_out))
    rgb = over(rgb, dst_rest, float(a_in))
    return rgb


# ---------------------------------------------------------------- render
def render_one(args):
    t, fade = args
    return frame(t, fade).tobytes()


def encode(name, times, fade, fps):
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
           "-s", f"{W}x{H}", "-r", str(fps), "-i", "-",
           "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p",
           "-movflags", "+faststart", name]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    with Pool(4) as pool:
        for i, buf in enumerate(pool.imap(render_one, [(t, fade) for t in times], chunksize=2)):
            proc.stdin.write(buf)
            if i % 30 == 0:
                print(f"{name}: {i}/{len(times)}", file=sys.stderr, flush=True)
    proc.stdin.close()
    proc.wait()


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--preview", action="store_true", help="write sample stills only")
    ap.add_argument("--fps", type=int, default=30)
    args = ap.parse_args()
    if args.preview:
        for t in [0.5, 2.0, HOLD_A + 0.3, HOLD_A + 0.9, HOLD_A + 1.4, HOLD_A + 2.0, HOLD_A + 2.6,
                  HOLD_A + MORPH_1 + 0.5, HOLD_A + MORPH_1 + 1.6, LOOP - 1.4, LOOP - 0.2]:
            Image.fromarray(frame(t)).save(f"preview_{t:05.2f}.png")
        sys.exit()
    n = round(LOOP * args.fps)
    encode("backstage_lstd_loop.mp4", [i / args.fps for i in range(n)], False, args.fps)
    # fade version: fade in on Backstage, full cycle, back to Backstage, fade out
    total = LOOP + 2 * FADE
    m = round(total * args.fps)
    encode("backstage_lstd_fade.mp4", [i / args.fps for i in range(m)], True, args.fps)
