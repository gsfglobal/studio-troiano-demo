/**
 * Genera le versioni responsive delle foto (WebP) e il manifest usato dal sito.
 *
 *   npm run images
 *
 * Sorgenti: assets/foto/*.webp|jpg|png  →  public/images/<nome>-<larghezza>.webp
 * Manifest: src/content/images.json  ({ nome: { w, h, widths: [...] } })
 *
 * Per aggiungere una foto (es. la Dott.ssa Scarfato): copiala in assets/foto con il
 * nome previsto (team-maria-scarfato.webp), lancia `npm run images` e fai il commit.
 */
import { readdir, mkdir, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SRC = path.resolve('assets/foto')
const OUT = path.resolve('public/images')
const MANIFEST = path.resolve('src/content/images.json')
const TARGETS = [480, 800, 1600]
const QUALITY = 78
/** Ritagli applicati alla sorgente: parte alta dell'autoclave (in basso ci sono contenitori da non mostrare). */
const CROPS = { 'studio-autoclave': { keepTop: 0.68 } }
/** Zone sfocate: scritte e marchi che non devono leggersi (schermo del laser, marca dell'autoclave). */
const BLURS = {
  'tech-laser-diodi': { left: 378, top: 402, width: 450, height: 286, sigma: 16 },
  'studio-autoclave': { left: 556, top: 752, width: 172, height: 56, sigma: 5 },
}

const load = async (file, name) => {
  let img = sharp(path.join(SRC, file))
  const crop = CROPS[name]
  if (crop) {
    const { width, height } = await img.metadata()
    img = sharp(await img.extract({ left: 0, top: 0, width, height: Math.round(height * crop.keepTop) }).png().toBuffer())
  }
  // Foto delle tecnologie: sfondo portato al bianco pieno, uguale alle cornici
  if (name.startsWith('tech-')) img = sharp(await img.linear(255 / 247, 0).png().toBuffer())
  const b = BLURS[name]
  if (b) {
    const base = await img.png().toBuffer()
    const patch = await sharp(base).extract({ left: b.left, top: b.top, width: b.width, height: b.height }).blur(b.sigma).png().toBuffer()
    img = sharp(await sharp(base).composite([{ input: patch, left: b.left, top: b.top }]).png().toBuffer())
  }
  return img
}

await mkdir(OUT, { recursive: true })
// Rimuove le versioni generate in precedenza (il logo resta)
for (const f of await readdir(OUT)) if (/-\d+\.webp$/.test(f) && !f.startsWith('logo-')) await rm(path.join(OUT, f))

const manifest = {}
const files = (await readdir(SRC)).filter((f) => /\.(webp|jpe?g|png)$/i.test(f)).sort()

for (const file of files) {
  const name = file.replace(/\.[^.]+$/, '')
  const buffer = await (await load(file, name)).png().toBuffer()
  const { width: w, height: h } = await sharp(buffer).metadata()
  const widths = [...new Set(TARGETS.map((t) => Math.min(t, w)))]
  for (const width of widths) {
    await sharp(buffer)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(path.join(OUT, `${name}-${width}.webp`))
  }
  manifest[name] = { w, h, widths }
  console.log(`${name}: ${w}×${h} → ${widths.join(', ')}`)
}

// Logo in versione leggera per header e footer (l'originale resta per la stampa)
for (const width of [360, 640]) {
  await sharp(path.join(OUT, 'logo-troiano.png')).resize({ width }).webp({ quality: 88, alphaQuality: 90, effort: 6 }).toFile(path.join(OUT, `logo-troiano-${width}.webp`))
}

// Immagine di anteprima per i social (JPG 1200×630, compatibile con WhatsApp e Facebook)
await sharp(path.join(SRC, 'team-amedeo-troiano.webp'))
  .resize({ width: 1200, height: 630, fit: 'cover', position: 'centre' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.resolve('public/og-image.jpg'))

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
console.log(`\nManifest: ${path.relative(process.cwd(), MANIFEST)} (${files.length} foto)`)
