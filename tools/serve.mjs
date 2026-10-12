/**
 * Server locale che imita Cloudflare Pages: /studio → dist/studio.html, 404.html per le pagine
 * inesistenti, intestazioni lette da dist/_headers (sezione /*).   Uso: npm run preview
 */
import http from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { brotliCompressSync, constants } from 'node:zlib'

const DIST = path.resolve(process.argv[2] || 'dist')
const PORT = Number(process.env.PORT || 4173)
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json', '.svg': 'image/svg+xml' }

let globalHeaders = {}
try {
  const raw = await readFile(path.join(DIST, '_headers'), 'utf8')
  const block = raw.split(/\n(?=\S)/).find((b) => b.startsWith('/*'))
  for (const line of (block || '').split('\n').slice(1)) {
    const m = line.match(/^\s+([\w-]+):\s*(.+)$/)
    if (m && m[1] !== 'Strict-Transport-Security') globalHeaders[m[1]] = m[2].replace(' upgrade-insecure-requests', '').replace('; upgrade-insecure-requests', '')
  }
} catch {}

const cache = new Map()
const exists = async (p) => (await stat(p).catch(() => null))?.isFile()

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x')
    let p = decodeURIComponent(url.pathname)
    let file = path.join(DIST, p)
    let status = 200
    if (p.endsWith('.html') && p !== '/404.html') {
      res.writeHead(308, { location: p.replace(/(index)?\.html$/, '') || '/' })
      return res.end()
    }
    if (p === '/') file = path.join(DIST, 'index.html')
    else if (!(await exists(file)) && (await exists(file + '.html'))) file += '.html'
    else if (!(await exists(file))) {
      file = path.join(DIST, '404.html')
      status = 404
    }
    let body = await readFile(file)
    const type = types[path.extname(file)] || 'application/octet-stream'
    const extra = {}
    // Compressione come su Cloudflare (brotli) per misure realistiche
    if (/text|javascript|json|xml|svg/.test(type) && /br/.test(req.headers['accept-encoding'] || '')) {
      if (!cache.has(file)) cache.set(file, brotliCompressSync(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 9 } }))
      body = cache.get(file)
      extra['content-encoding'] = 'br'
    }
    res.writeHead(status, { 'content-type': type, ...extra, ...globalHeaders })
    res.end(body)
  })
  .listen(PORT, () => console.log(`http://localhost:${PORT}`))
