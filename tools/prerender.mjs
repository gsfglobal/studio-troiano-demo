/**
 * Pre-rendering: scrive l'HTML statico di ogni pagina (URL puliti, title e description
 * diversi per pagina, dati strutturati, Open Graph), più sitemap.xml, robots.txt e _headers.
 *
 * Su Cloudflare Pages: /studio serve dist/studio.html, /studio.html reindirizza a /studio,
 * le pagine inesistenti ricevono dist/404.html con stato 404.
 */
import { readFile, writeFile, readdir, rm } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const DIST = path.resolve('dist')
const server = await import(pathToFileURL(path.resolve('dist-server/entry-server.js')).href)
const { render, pages, notFoundMeta, studio, SITE_URL, BASE } = server
const PREVIEW = BASE !== '/' // anteprima in sottocartella: mai indicizzata

// Il CSS (circa 9 KB compresso) viene incorporato nella pagina: un passaggio in meno prima della prima visualizzazione
let template = await readFile(path.join(DIST, 'index.html'), 'utf8')
for (const m of [...template.matchAll(/<link rel="stylesheet" crossorigin href="([^"]+\.css)">/g)]) {
  const css = await readFile(path.join(DIST, 'assets', path.basename(m[1])), 'utf8')
  template = template.replace(m[0], `<style>${css}</style>`)
}
const assets = await readdir(path.join(DIST, 'assets'))
// Font da precaricare: il testo (Manrope) e il corsivo dei titoli (Cormorant Garamond)
const fonts = [/^manrope-latin-wght-normal.*\.woff2$/, /^cormorant-garamond-latin-400-italic.*\.woff2$/]
  .map((re) => assets.find((f) => re.test(f)))
  .filter(Boolean)

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const urlFor = (p) => SITE_URL + (p === '/' ? '/' : p)
const ldJson = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`

const dentist = {
  '@context': 'https://schema.org',
  '@type': 'Dentist',
  '@id': `${SITE_URL}/#studio`,
  name: studio.name,
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/og-image.jpg`,
  logo: `${SITE_URL}/images/logo-troiano.png`,
  telephone: studio.phone.tel,
  email: studio.email,
  vatID: `IT${studio.legal.vat}`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: studio.address.street,
    postalCode: studio.address.postalCode,
    addressLocality: studio.address.city,
    addressRegion: studio.address.province,
    addressCountry: 'IT',
  },
  hasMap: studio.address.mapsUrl,
  areaServed: studio.address.city,
  medicalSpecialty: 'https://schema.org/Dentistry',
  openingHoursSpecification: studio.hours.flatMap((h) =>
    (h.schema ?? []).map((s) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: s.days, opens: s.opens, closes: s.closes })),
  ),
  ...(Object.values(studio.social ?? {}).some(Boolean) ? { sameAs: Object.values(studio.social).filter(Boolean) } : {}),
  employee: [{ '@type': 'Person', name: 'Amedeo Troiano', honorificPrefix: 'Dott.', jobTitle: 'Odontoiatra, titolare e direttore sanitario' }],
}

function head(meta, { notFound = false } = {}) {
  const url = urlFor(meta.path)
  const tags = [
    notFound || PREVIEW ? '<meta name="robots" content="noindex, nofollow" />' : '',
    notFound ? '' : `<link rel="canonical" href="${url}" />`,
    '<meta property="og:type" content="website" />',
    '<meta property="og:locale" content="it_IT" />',
    `<meta property="og:site_name" content="${esc(studio.name)}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    notFound ? '' : `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE_URL}/og-image.jpg" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:image:alt" content="${esc('Il Dott. Amedeo Troiano nello Studio Dentistico Troiano')}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    ...fonts.map((f) => `<link rel="preload" href="${BASE}assets/${f}" as="font" type="font/woff2" crossorigin />`),
    meta.path === '/' || meta.path === '/contatti' ? ldJson(dentist) : '',
  ]
  return tags.filter(Boolean).join('\n    ')
}

function page(meta, html, opts) {
  return template
    .replace(/<title>.*?<\/title>/s, `<title>${esc(meta.title)}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${esc(meta.description)}" />`)
    .replace('<!--head-->', head(meta, opts))
    .replace('<!--app-->', html)
}

const written = []
for (const meta of pages) {
  const file = meta.path === '/' ? 'index.html' : `${meta.path.slice(1)}.html`
  await writeFile(path.join(DIST, file), page(meta, render(BASE.replace(/\/$/, '') + meta.path)))
  written.push(file)
}
await writeFile(path.join(DIST, '404.html'), page(notFoundMeta, render(BASE.replace(/\/$/, '') + '/pagina-non-trovata'), { notFound: true }))
written.push('404.html')

// sitemap.xml e robots.txt
const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .filter((p) => p.sitemap !== false)
  .map((p) => `  <url><loc>${urlFor(p.path)}</loc><lastmod>${today}</lastmod><priority>${(p.priority ?? 0.5).toFixed(1)}</priority></url>`)
  .join('\n')}
</urlset>
`
await writeFile(path.join(DIST, 'sitemap.xml'), sitemap)
await writeFile(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)

// _headers: sicurezza, cache e noindex sull'anteprima *.pages.dev
const inline = [...template.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => `'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`)
// Google Analytics 4: domini aggiunti solo se l'ID è inserito in site.ts (analytics.ga4Id)
const ga = /^G-[A-Z0-9]+$/.test((studio.analytics?.ga4Id ?? '').trim())
const gaScript = ga ? ' https://www.googletagmanager.com' : ''
const gaImg = ga ? ' https://*.google-analytics.com https://*.googletagmanager.com' : ''
// Recensioni Google: le foto profilo degli autori arrivano da googleusercontent.com
const reviewsImg = studio.reviews?.enabled ? ' https://*.googleusercontent.com' : ''
const gaConnect = ga ? ' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com' : ''
const csp = [
  "default-src 'self'",
  `script-src 'self' ${inline.join(' ')} https://static.cloudflareinsights.com${gaScript}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data:${gaImg}${reviewsImg}`,
  "font-src 'self'",
  // Giulia (spenta al lancio): quando si attiva, aggiungere qui wss://api.elevenlabs.io https://api.elevenlabs.io
  `connect-src 'self' https://cloudflareinsights.com${gaConnect}`,
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  'upgrade-insecure-requests',
].join('; ')

const headers = `/*
  Content-Security-Policy: ${csp}
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), geolocation=(), payment=(), usb=(), microphone=(self)
  Strict-Transport-Security: max-age=31536000

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/images/*
  Cache-Control: public, max-age=2592000

https://:project.pages.dev/*
  X-Robots-Tag: noindex
`
await writeFile(path.join(DIST, '_headers'), headers)

await rm(path.resolve('dist-server'), { recursive: true, force: true })
console.log(`Pre-rendering completato: ${written.join(', ')} + sitemap.xml, robots.txt, _headers`)
