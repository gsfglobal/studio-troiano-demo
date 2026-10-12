"""
Porta su sfondo bianco le immagini di catalogo con sfondo nero (tecnologie).

    python3 tools/sfondo-bianco.py assets/foto/tech-scanner-intraorale.webp [altre...]

Lo sfondo è il nero collegato ai bordi (riempimento dai bordi): le zone scure interne
all'oggetto restano intatte. Sui contorni l'opacità si ricava dal colore dell'oggetto più
vicino, così i bordi restano morbidi. Sotto l'oggetto si aggiunge un'ombra leggera.
Il file viene sovrascritto (gli originali restano nella cronologia git).
"""
import sys

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

BG_T = 20      # sotto questa luminosità (0-255) un pixel collegato al bordo è sfondo
BAND = 2       # pixel di contorno (attorno allo sfondo) in cui ricalcolare l'opacità


def process(path: str) -> None:
    rgb = np.asarray(Image.open(path).convert('RGB')).astype(np.float32)
    lum = rgb @ np.array([0.299, 0.587, 0.114], dtype=np.float32)

    # Sfondo: pixel quasi neri collegati ai bordi dell'immagine
    labels, _ = ndimage.label(lum < BG_T)
    border = np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))
    solid = np.isin(labels, border[border > 0])
    band = ndimage.binary_dilation(solid, iterations=BAND) & ~solid   # contorno sfumato
    zone = solid | band
    obj = ~zone                              # oggetto sicuro (anche le parti grigio scuro)

    # Colore dell'oggetto più vicino per ogni pixel della fascia
    _, (iy, ix) = ndimage.distance_transform_edt(~obj, return_indices=True)
    fg = rgb[iy, ix]
    fg_lum = np.maximum(fg @ np.array([0.299, 0.587, 0.114], dtype=np.float32), 1.0)

    alpha = np.ones_like(lum)
    alpha[zone] = np.clip(lum[zone] / fg_lum[zone], 0, 1)
    alpha[solid] = 0.0
    alpha = np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))).astype(np.float32) / 255

    color = np.where(zone[..., None], fg, rgb)

    # Ombra morbida sotto l'oggetto
    h, w = lum.shape
    a_img = Image.fromarray((alpha * 255).astype(np.uint8))
    shadow = Image.new('L', (w, h), 0)
    shadow.paste(a_img, (0, int(h * 0.018)))
    shadow = np.asarray(shadow.filter(ImageFilter.GaussianBlur(h * 0.022))).astype(np.float32) / 255 * 0.22

    white = np.full_like(rgb, 255.0)
    base = white * (1 - shadow[..., None]) + np.array([40, 52, 60], dtype=np.float32) * shadow[..., None]
    out = color * alpha[..., None] + base * (1 - alpha[..., None])
    Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(path, 'WEBP', quality=92, method=6)
    print(f'{path}: sfondo bianco ({w}×{h})')


if __name__ == '__main__':
    for p in sys.argv[1:]:
        process(p)
