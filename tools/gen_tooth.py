"""Genera un molare inferiore (primo molare mandibolare) da una funzione di distanza
implicita: corona con 5 cuspidi e solchi, colletto, tronco radicolare e due radici.
Esporta GLB (posizioni, normali, UV cilindriche, colori per vertice) e gli anelli
di contorno usati dalla hero."""
import json, sys
import numpy as np
from skimage import measure
import trimesh

STEP = float(sys.argv[1]) if len(sys.argv) > 1 else 0.008
X0, X1 = -0.72, 0.72
Y0, Y1 = -1.48, 0.92
Z0, Z1 = -0.66, 0.66
xs = np.arange(X0, X1 + 1e-9, STEP, dtype=np.float32)
ys = np.arange(Y0, Y1 + 1e-9, STEP, dtype=np.float32)
zs = np.arange(Z0, Z1 + 1e-9, STEP, dtype=np.float32)
X, Y, Z = np.meshgrid(xs, ys, zs, indexing="ij")


def smin(a, b, k):
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0, 1)
    return b * (1 - h) + a * h - k * h * (1 - h)


def smax(a, b, k):
    return -smin(-a, -b, k)


def gauss2(x, z, cx, cz, sx, sz):
    return np.exp(-(((x - cx) / sx) ** 2 + ((z - cz) / sz) ** 2) * 0.5)


# --- profilo orizzontale della corona e del tronco (semiassi in x = mesio-distale, z = vestibolo-linguale)
prof_y = np.array([-0.40, -0.22, -0.05, 0.00, 0.12, 0.28, 0.42, 0.56, 0.66, 0.80], np.float32)
prof_a = np.array([0.33, 0.37, 0.42, 0.43, 0.50, 0.555, 0.56, 0.535, 0.50, 0.46], np.float32)
prof_b = np.array([0.30, 0.34, 0.375, 0.385, 0.45, 0.49, 0.48, 0.45, 0.41, 0.37], np.float32)
a = np.interp(Y, prof_y, prof_a).astype(np.float32)
b = np.interp(Y, prof_y, prof_b).astype(np.float32)
# lieve asimmetria: convessita' vestibolare (z>0) piu' marcata nel terzo cervicale
b = b * np.where(Z > 0, 1.0 + 0.04 * np.exp(-((Y - 0.18) / 0.15) ** 2), 1.0)
n = 2.5
q = ((np.abs(X) / a) ** n + (np.abs(Z) / b) ** n) ** (1.0 / n)
d_side = (q - 1.0) * np.minimum(a, b)

# --- superficie occlusale: 5 cuspidi (MV, DV, D vestibolari; ML, DL linguali) + solchi
cusps = [
    (-0.27, 0.19, 0.150, 0.0),   # mesio-vestibolare
    (0.04, 0.22, 0.140, 0.0),    # disto-vestibolare
    (0.31, 0.14, 0.105, 0.0),    # distale
    (-0.24, -0.19, 0.175, 0.0),  # mesio-linguale
    (0.17, -0.20, 0.165, 0.0),   # disto-linguale
]
base = 0.545
h = np.full(X.shape[0:1] + X.shape[2:3], base, np.float32)  # placeholder shape
x2 = xs[:, None]
z2 = zs[None, :]
h2 = np.full((len(xs), len(zs)), base, np.float32)
for cx, cz, amp, _ in cusps:
    h2 += amp * gauss2(x2, z2, cx, cz, 0.112, 0.112)
# solco centrale mesio-distale con decorso leggermente ondulato
zc = 0.01 + 0.025 * np.sin((x2 + 0.1) * 6.0)
env = np.clip(1 - (x2 / 0.42) ** 4, 0, 1)
h2 -= 0.075 * np.exp(-((z2 - zc) / 0.028) ** 2) * env
# solchi vestibolari e linguale (tra le cuspidi)
for gx, side in [(-0.115, 1), (0.19, 1), (-0.03, -1)]:
    zz = z2 * side
    h2 -= 0.055 * np.exp(-((x2 - gx - 0.05 * zz) / 0.028) ** 2) * np.clip(zz / 0.30, 0, 1) * (zz > -0.02)
# fossette centrale, mesiale e distale
for fx, fz, dep in [(-0.06, 0.0, 0.05), (-0.33, 0.0, 0.03), (0.30, 0.0, 0.03)]:
    h2 -= dep * gauss2(x2, z2, fx, fz, 0.05, 0.05)
# creste marginali
h2 += 0.03 * np.exp(-((np.abs(x2) - 0.40) / 0.05) ** 2) * np.clip(1 - (z2 / 0.32) ** 2, 0, 1)
d_top = Y - h2[:, None, :]

crown = smax(d_side, d_top, 0.06)
# fondo del tronco radicolare
crown = smax(crown, -(Y + 0.36), 0.06)


# --- radici: mesiale e distale, appiattite in senso mesio-distale, curve distalmente
def root(x_top, y_top, y_apex, spread, curve, r_top, r_apex, flat):
    d = np.full(X.shape, 10.0, np.float32)
    N = 46
    for i in range(N + 1):
        t = i / N
        cy = y_top + (y_apex - y_top) * t
        cx = x_top + spread * np.sin(np.pi * t * 0.8) + curve * t ** 2.2
        cz = 0.02 * np.sin(np.pi * t)
        r = r_top + (r_apex - r_top) * (t ** 1.25)
        # sezione ellittica: stretta in x, larga in z; leggera concavita' (forma a fagiolo) via z-scale
        dd = np.sqrt(((X - cx) / flat) ** 2 + (Y - cy) ** 2 + (Z - cz) ** 2) * 1.0 - r
        d = np.minimum(d, dd)
    return d


r_m = root(-0.215, -0.15, -1.30, -0.05, 0.10, 0.30, 0.07, 0.68)
r_d = root(0.235, -0.15, -1.22, 0.035, 0.07, 0.285, 0.07, 0.70)
roots = smin(r_m, r_d, 0.04)
# solco/concavita' radicolare: piccola sottrazione al centro della faccia vestibolare/linguale
sdf = smin(crown, roots, 0.11)

print("grid", X.shape, "min", float(sdf.min()))
verts, faces, normals, _ = measure.marching_cubes(sdf, level=0.0, spacing=(STEP, STEP, STEP))
verts += np.array([X0, Y0, Z0], np.float32)
mesh = trimesh.Trimesh(vertices=verts, faces=faces[:, ::-1], process=True)
print("raw faces", len(mesh.faces))
trimesh.smoothing.filter_taubin(mesh, lamb=0.5, nu=-0.53, iterations=8)
target = int(sys.argv[2]) if len(sys.argv) > 2 else 36000
mesh = mesh.simplify_quadric_decimation(face_count=target)
trimesh.smoothing.filter_taubin(mesh, lamb=0.4, nu=-0.42, iterations=3)
mesh.fix_normals()
print("final faces", len(mesh.faces), "watertight", mesh.is_watertight)

# centra: origine a meta' altezza, asse y verso l'alto (corona in alto)
v = mesh.vertices
cy = (v[:, 1].max() + v[:, 1].min()) / 2
mesh.vertices[:, 1] -= cy
mesh.vertices[:, 0] -= (v[:, 0].max() + v[:, 0].min()) / 2
v = mesh.vertices
print("bounds", v.min(0), v.max(0), "cej shift", -cy)
cej = -cy

# UV cilindriche (u = angolo, v = altezza normalizzata)
u = (np.arctan2(v[:, 2], v[:, 0]) / (2 * np.pi)) + 0.5
vv = (v[:, 1] - v[:, 1].min()) / (v[:, 1].max() - v[:, 1].min())
uv = np.stack([u, vv], 1)

# colori: smalto avorio-bianco sulla corona, dentina/cemento piu' caldi sulle radici
tcrown = np.clip((v[:, 1] - (cej - 0.05)) / 0.16, 0, 1) ** 1.3
enamel = np.array([0.935, 0.915, 0.865])
cement = np.array([0.86, 0.775, 0.62])
col = cement[None] * (1 - tcrown[:, None]) + enamel[None] * tcrown[:, None]
# cuspidi leggermente piu' chiare
tt = np.clip((v[:, 1] - (cej + 0.55)) / 0.2, 0, 1)
col = col * (1 - 0.3 * tt[:, None]) + np.array([0.96, 0.955, 0.94])[None] * 0.3 * tt[:, None]
colors = np.concatenate([(col * 255).astype(np.uint8), np.full((len(v), 1), 255, np.uint8)], 1)

vis = trimesh.visual.TextureVisuals(uv=uv)
mesh.visual = vis
m2 = trimesh.Trimesh(vertices=mesh.vertices, faces=mesh.faces, vertex_colors=colors, process=False)
# trimesh non salva insieme uv e colori per vertice in modo semplice: scriviamo il GLB a mano
import struct

pos = np.asarray(m2.vertices, np.float32)
nor = np.asarray(m2.vertex_normals, np.float32)
uvs = np.asarray(uv, np.float32)
cols = np.asarray(colors[:, :3], np.uint8)
cols4 = np.concatenate([cols, np.full((len(cols), 1), 255, np.uint8)], 1)
idx = np.asarray(m2.faces, np.uint32).reshape(-1)
if len(pos) < 65536:
    idx = idx.astype(np.uint16)
blobs = [pos.tobytes(), nor.tobytes(), uvs.tobytes(), cols4.tobytes(), idx.tobytes()]
offs = []
buf = b""
for bl in blobs:
    while len(buf) % 4:
        buf += b"\0"
    offs.append(len(buf))
    buf += bl
while len(buf) % 4:
    buf += b"\0"
nv = len(pos)
gl = {
    "asset": {"version": "2.0", "generator": "Dental Go concept"},
    "scene": 0,
    "scenes": [{"nodes": [0]}],
    "nodes": [{"mesh": 0, "name": "molare"}],
    "meshes": [{"name": "molare", "primitives": [{"attributes": {"POSITION": 0, "NORMAL": 1, "TEXCOORD_0": 2, "COLOR_0": 3}, "indices": 4}]}],
    "buffers": [{"byteLength": len(buf)}],
    "bufferViews": [
        {"buffer": 0, "byteOffset": offs[0], "byteLength": len(blobs[0]), "target": 34962},
        {"buffer": 0, "byteOffset": offs[1], "byteLength": len(blobs[1]), "target": 34962},
        {"buffer": 0, "byteOffset": offs[2], "byteLength": len(blobs[2]), "target": 34962},
        {"buffer": 0, "byteOffset": offs[3], "byteLength": len(blobs[3]), "target": 34962},
        {"buffer": 0, "byteOffset": offs[4], "byteLength": len(blobs[4]), "target": 34963},
    ],
    "accessors": [
        {"bufferView": 0, "componentType": 5126, "count": nv, "type": "VEC3", "min": pos.min(0).tolist(), "max": pos.max(0).tolist()},
        {"bufferView": 1, "componentType": 5126, "count": nv, "type": "VEC3"},
        {"bufferView": 2, "componentType": 5126, "count": nv, "type": "VEC2"},
        {"bufferView": 3, "componentType": 5121, "normalized": True, "count": nv, "type": "VEC4"},
        {"bufferView": 4, "componentType": 5123 if idx.dtype == np.uint16 else 5125, "count": len(idx), "type": "SCALAR"},
    ],
}
js = json.dumps(gl, separators=(",", ":")).encode()
while len(js) % 4:
    js += b" "
glb = b"glTF" + struct.pack("<II", 2, 12 + 8 + len(js) + 8 + len(buf))
glb += struct.pack("<I", len(js)) + b"JSON" + js
glb += struct.pack("<I", len(buf)) + b"BIN\0" + buf
open("molare.glb", "wb").write(glb)
print("glb bytes", len(glb), "verts", nv)

# --- anelli di contorno per la hero (sezioni orizzontali della mesh finale)
rings = []
ymin, ymax = pos[:, 1].min(), pos[:, 1].max()
levels = np.linspace(ymin + 0.03, ymax - 0.025, 44)
for L in levels:
    sec = m2.section(plane_origin=[0, L, 0], plane_normal=[0, 1, 0])
    if sec is None:
        continue
    for ent in sec.discrete:
        pts = np.asarray(ent)
        if len(pts) < 8:
            continue
        # ricampiona a passo costante
        seg = np.linalg.norm(np.diff(pts, axis=0), axis=1)
        cum = np.concatenate([[0], np.cumsum(seg)])
        nn = max(18, int(cum[-1] / 0.03))
        tt = np.linspace(0, cum[-1], nn)
        rx = np.interp(tt, cum, pts[:, 0])
        rz = np.interp(tt, cum, pts[:, 2])
        rings.append({"y": round(float(L), 3), "p": [round(float(c), 3) for xy in zip(rx, rz) for c in xy]})
meta = {"cej": round(float(cej), 3), "ymin": round(float(ymin), 3), "ymax": round(float(ymax), 3), "rings": rings}
open("tooth-rings.json", "w").write(json.dumps(meta, separators=(",", ":")))
print("rings", len(rings), "cej", cej)
