Il modello è generato da `gen_tooth.py` (Python: numpy, scikit-image, trimesh, fast-simplification):

    python3 gen_tooth.py 0.008 36000

Produce `molare.glb` e `tooth-rings.json`. Il GLB viene poi convertito nel formato compatto
`public/models/molare.json` (posizioni float32, normali int8, UV uint16, colori uint8, indici uint16, in base64)
con lo script di conversione usato in sviluppo; `tooth-rings.json` va in `src/data/`.
