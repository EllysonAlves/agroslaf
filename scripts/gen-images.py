#!/usr/bin/env python3
"""
Gera imagens de referencia (placeholders) com a identidade visual da AGROSLAF.
Sao imagens abstratas de paisagem rural (ceu azul institucional + colinas verdes)
com rotulo, pensadas para serem substituidas pelas fotos reais depois.

Uso: python3 scripts/gen-images.py
Saida: public/images/*.jpg
"""
import math
import os
import random
from PIL import Image, ImageDraw, ImageFilter, ImageFont

random.seed(1995)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "images")
os.makedirs(OUT, exist_ok=True)

BLUE = (0, 59, 92)
BLUE_DK = (0, 38, 60)
GREEN = (75, 174, 79)
GREEN_DK = (45, 120, 50)
EARTH = (184, 135, 70)
CREAM = (245, 247, 248)

FONT_PATHS = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
]


def font(size):
    for p in FONT_PATHS:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def vgrad(w, h, top, bottom):
    base = Image.new("RGB", (w, h))
    px = base.load()
    for y in range(h):
        c = lerp(top, bottom, y / max(1, h - 1))
        for x in range(w):
            px[x, y] = c
    return base


def hills(img, horizon_ratio=0.58):
    """Desenha camadas de colinas verdes na parte de baixo."""
    w, h = img.size
    draw = ImageDraw.Draw(img, "RGBA")
    base_y = int(h * horizon_ratio)
    layers = [
        (lerp(GREEN, GREEN_DK, 0.15), 0.0, 70),
        (lerp(GREEN, GREEN_DK, 0.45), 0.10, 95),
        (GREEN_DK, 0.22, 120),
    ]
    for color, drop, amp in layers:
        amp = int(amp * (h / 600))
        pts = [(0, h)]
        offset = random.uniform(0, math.pi * 2)
        freq = random.uniform(1.2, 2.4)
        y0 = base_y + int(h * drop)
        step = max(6, w // 80)
        for x in range(0, w + step, step):
            y = y0 + int(math.sin(offset + freq * x / w * math.pi * 2) * amp * 0.5) - amp // 2
            pts.append((x, y))
        pts.append((w, h))
        draw.polygon(pts, fill=color + (255,))
    return img


def sun(img, ratio_x=0.8, ratio_y=0.26):
    w, h = img.size
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    cx, cy = int(w * ratio_x), int(h * ratio_y)
    r = int(min(w, h) * 0.10)
    for i in range(r, 0, -1):
        a = int(70 * (i / r) ** 2)
        d.ellipse([cx - i, cy - i, cx + i, cy + i], fill=(255, 240, 200, a))
    img.alpha_composite(layer) if img.mode == "RGBA" else img.paste(
        Image.alpha_composite(img.convert("RGBA"), layer).convert("RGB"), (0, 0)
    )
    return img


def grain(img, amount=8):
    w, h = img.size
    noise = Image.effect_noise((w, h), amount).convert("L")
    img = Image.blend(img, Image.merge("RGB", (noise, noise, noise)), 0.04)
    return img


def rounded(img, radius):
    w, h = img.size
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, w, h], radius, fill=255)
    out = Image.new("RGB", (w, h), (255, 255, 255))
    out.paste(img, (0, 0), mask)
    return out


def landscape(w, h, label=None, tag=None, overlay=0.0, sun_on=True):
    img = vgrad(w, h, lerp(BLUE, (120, 170, 200), 0.35), lerp((180, 205, 220), CREAM, 0.4))
    img = img.convert("RGBA")
    if sun_on:
        sun(img, ratio_x=random.choice([0.18, 0.78, 0.85]), ratio_y=0.24)
    img = img.convert("RGB")
    hills(img, horizon_ratio=random.uniform(0.5, 0.62))
    img = grain(img)
    if overlay > 0:
        ov = Image.new("RGB", (w, h), BLUE)
        img = Image.blend(img, ov, overlay)
    if label:
        draw = ImageDraw.Draw(img, "RGBA")
        # faixa inferior translucida
        bar_h = int(h * 0.26)
        draw.rectangle([0, h - bar_h, w, h], fill=(0, 38, 60, 150))
        fs = max(16, int(h * 0.072))
        f = font(fs)
        if tag:
            tf = font(max(11, int(fs * 0.42)))
            tw = draw.textlength(tag.upper(), font=tf)
            pad = int(fs * 0.35)
            ty = h - bar_h + int(bar_h * 0.16)
            draw.rounded_rectangle(
                [int(w * 0.05), ty, int(w * 0.05) + tw + pad * 2, ty + int(fs * 0.62)],
                int(fs * 0.32), fill=GREEN + (255,))
            draw.text((int(w * 0.05) + pad, ty + int(fs * 0.13)), tag.upper(), font=tf, fill=(255, 255, 255))
        draw.text((int(w * 0.05), h - bar_h + int(bar_h * 0.46)), label, font=f, fill=(255, 255, 255))
    return img


def portrait(w, h, initial):
    img = vgrad(w, h, lerp(BLUE, GREEN, 0.4), GREEN_DK).convert("RGB")
    img = grain(img)
    draw = ImageDraw.Draw(img, "RGBA")
    # silhueta simples
    cx = w // 2
    head_r = int(w * 0.16)
    draw.ellipse([cx - head_r, int(h * 0.28), cx + head_r, int(h * 0.28) + head_r * 2],
                 fill=(255, 255, 255, 60))
    body_w = int(w * 0.5)
    draw.ellipse([cx - body_w // 2, int(h * 0.62), cx + body_w // 2, int(h * 1.25)],
                 fill=(255, 255, 255, 60))
    f = font(int(w * 0.34))
    tw = draw.textlength(initial, font=f)
    bbox = draw.textbbox((0, 0), initial, font=f)
    th = bbox[3] - bbox[1]
    draw.text((cx - tw / 2, h * 0.42 - th / 2), initial, font=f, fill=(255, 255, 255, 235))
    return img


def save(img, name, q=82):
    path = os.path.join(OUT, name)
    img.convert("RGB").save(path, "JPEG", quality=q, optimize=True)
    print("ok", name, img.size)


# ---- HERO ----
save(landscape(1920, 1080, sun_on=True), "hero.jpg", q=80)

# ---- PROJETOS ----
projetos = [
    ("Quintais Vivos", "Agricultura", "quintais-vivos"),
    ("Capacitacoes", "Educacao", "capacitacoes"),
    ("Minha Casa Minha Vida Rural", "Infraestrutura", "minha-casa-rural"),
    ("Producao Sustentavel", "Sustentabilidade", "producao-sustentavel"),
    ("Fortalecimento Comunitario", "Comunidade", "fortalecimento-comunitario"),
    ("Meio Ambiente", "Sustentabilidade", "meio-ambiente"),
    ("Educacao no Campo", "Educacao", "educacao-no-campo"),
    ("Infraestrutura Rural", "Infraestrutura", "infraestrutura-rural"),
]
for label, tag, slug in projetos:
    save(landscape(1000, 680, label=label, tag=tag), f"projeto-{slug}.jpg")

# ---- GALERIA ----
galeria = [
    ("Reuniao da comunidade", "Reunioes"),
    ("Dia de campo", "Agricultura"),
    ("Capacitacao tecnica", "Capacitacoes"),
    ("Encontro de associados", "Eventos"),
    ("Colheita coletiva", "Agricultura"),
    ("Mutirao comunitario", "Comunidade"),
]
for i, (label, tag) in enumerate(galeria, 1):
    save(landscape(1000, 750, label=label, tag=tag), f"galeria-{i}.jpg")

# ---- DEPOIMENTOS ----
for nome, ini in [("Maria Jose", "MJ"), ("Seu Joao", "SJ"), ("Dona Antonia", "DA")]:
    save(portrait(500, 500, ini), f"depoimento-{ini.lower()}.jpg")

# ---- NOTICIAS ----
noticias = [
    ("Nova capacitacao", "Capacitacoes", "noticia-1"),
    ("Quintais Vivos", "Projetos", "noticia-2"),
    ("Reuniao da diretoria", "Institucional", "noticia-3"),
]
for label, tag, name in noticias:
    save(landscape(800, 540, label=label, tag=tag), f"{name}.jpg")

# ---- LOGO MARK ----
logo = Image.new("RGBA", (240, 240), (0, 0, 0, 0))
d = ImageDraw.Draw(logo)
d.ellipse([8, 8, 232, 232], fill=BLUE + (255,))
d.ellipse([8, 8, 232, 232], outline=GREEN + (255,), width=10)
# folha
d.pieslice([70, 60, 180, 200], 200, 340, fill=GREEN + (255,))
d.line([120, 190, 150, 90], fill=CREAM + (255,), width=7)
logo.save(os.path.join(OUT, "logo.png"))
print("ok logo.png")

print("\nConcluido. Imagens em public/images/")
