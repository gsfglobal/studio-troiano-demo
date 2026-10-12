import { useEffect, useRef } from 'react'
import { ToothMark } from './ToothMark'
import { gsap, ScrollTrigger, isFinePointer, prefersReducedMotion } from '../lib/motion'

type Ring = { y: number; p: number[] }
type ToothData = { ymin: number; ymax: number; rings: Ring[] }

// Sfumatura del logo: verde (radici) → acquamarina → celeste → azzurro (corona)
const STOPS: [number, [number, number, number]][] = [
  [0, [140, 194, 75]],
  [0.42, [126, 206, 211]],
  [0.7, [101, 203, 237]],
  [1, [31, 154, 211]],
]
function brandAt(t: number) {
  for (let i = 0; i < STOPS.length - 1; i++) {
    const [a, ca] = STOPS[i]
    const [b, cb] = STOPS[i + 1]
    if (t <= b) {
      const k = (t - a) / (b - a)
      return ca.map((v, j) => Math.round(v + (cb[j] - v) * k)) as [number, number, number]
    }
  }
  return STOPS[STOPS.length - 1][1]
}
/** I dati del modello (circa 47 KB) si caricano a parte, dopo la prima visualizzazione. */
function prepare(data: ToothData) {
  const RINGS = data.rings.slice().sort((a, b) => a.y - b.y)
  const YMIN = data.ymin
  const YMAX = data.ymax
  const HEIGHT = YMAX - YMIN
  const COLORS = RINGS.map((r) => {
    const [R, G, B] = brandAt((r.y - YMIN) / HEIGHT)
    return `rgb(${R},${G},${B})`
  })
  return { RINGS, YMIN, YMAX, HEIGHT, COLORS }
}

/**
 * Apertura: il tratto del logo disegna il dente, poi il dente si "costruisce" in 3D
 * come una scansione, anello dopo anello (sezioni del modello del molare, disegnate
 * su canvas 2D: nessuna libreria 3D da scaricare).
 */
export function HeroTooth({ delay = 0.15 }: { delay?: number }) {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const markWrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cleanup: (() => void) | undefined
    let alive = true
    // Si avvia quando il browser ha finito l'avvio della pagina (il tratto del logo intanto si disegna in CSS)
    const go = () =>
      import('../data/tooth-rings.json').then((mod) => {
        if (alive) cleanup = start(mod.default as ToothData, mountedAt)
      })
    const mountedAt = performance.now()
    if ('requestIdleCallback' in window) window.requestIdleCallback(() => void go(), { timeout: 900 })
    else setTimeout(go, 300)
    return () => {
      alive = false
      cleanup?.()
    }
  }, [delay]) // eslint-disable-line react-hooks/exhaustive-deps

  function start(data: ToothData, mountedAt: number) {
    const { RINGS, YMIN, YMAX, HEIGHT, COLORS } = prepare(data)
    const el = wrap.current
    const c = canvas.current
    const ctx = c?.getContext('2d')
    if (!el || !c || !ctx) return
    const reduce = prefersReducedMotion()
    // Su smartphone: risoluzione del canvas contenuta e 30 fotogrammi al secondo
    const coarse = !isFinePointer()
    const st = { reveal: reduce ? 1 : 0, theta: reduce ? 0.6 : 0, tx: 0, ty: 0, px: 0, py: 0, scroll: 0, mark: reduce ? 0 : 1 }
    let w = 0
    let h = 0
    let dpr = 1
    let scale = 1

    const resize = () => {
      const r = el.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2)
      w = r.width
      h = r.height
      c.width = Math.round(w * dpr)
      c.height = Math.round(h * dpr)
      scale = Math.min((h * 0.84) / HEIGHT, (w * 0.86) / 1.25)
      if (markWrap.current) markWrap.current.style.height = `${HEIGHT * scale * 0.98}px`
      draw()
    }

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      if (st.reveal <= 0) return
      const cx = w / 2
      const cy = h / 2 + st.scroll * h * 0.08
      const s0 = scale * (1 + st.scroll * 0.18)
      const th = st.theta + st.px * 0.55 + st.scroll * 1.4
      const ph = 0.24 + st.py * 0.16 - st.scroll * 0.18
      const cT = Math.cos(th)
      const sT = Math.sin(th)
      const cP = Math.cos(ph)
      const sP = Math.sin(ph)
      const D = 5.5
      const N = RINGS.length
      const SPREAD = 14
      const front = st.reveal * (N + SPREAD)
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      const fade = 1 - st.scroll * 0.75

      for (let i = 0; i < N; i++) {
        const f = Math.min(1, Math.max(0, (front - i) / SPREAD))
        if (f <= 0) continue
        const ring = RINGS[i]
        const p = ring.p
        const n = p.length / 2
        const m = f >= 1 ? n + 1 : Math.max(2, Math.floor(n * f))
        const y = ring.y - (YMAX + YMIN) / 2
        ctx.strokeStyle = COLORS[i]
        // due passate: metà posteriore tenue, metà anteriore piena
        for (let pass = 0; pass < 2; pass++) {
          ctx.beginPath()
          let pen = false
          for (let k = 0; k < m; k++) {
            const kk = k % n
            const x = p[kk * 2]
            const z = p[kk * 2 + 1]
            const x1 = x * cT + z * sT
            const z1 = -x * sT + z * cT
            const y2 = y * cP - z1 * sP
            const z2 = y * sP + z1 * cP
            const sc = D / (D - z2)
            const sx = cx + x1 * sc * s0
            const sy = cy - y2 * sc * s0
            const isFront = z1 > 0
            if (isFront === (pass === 1)) {
              if (!pen) ctx.moveTo(sx, sy)
              else ctx.lineTo(sx, sy)
              pen = true
            } else pen = false
          }
          ctx.globalAlpha = (pass === 0 ? 0.2 : 0.92) * fade * (0.35 + 0.65 * f)
          ctx.lineWidth = pass === 0 ? 1 : 1.35
          ctx.stroke()
        }
        // punti di misura sulla metà anteriore
        if (f >= 1 && i % 3 === 0) {
          ctx.fillStyle = COLORS[i]
          ctx.globalAlpha = 0.6 * fade
          for (let k = 0; k < n; k += 9) {
            const x = p[k * 2]
            const z = p[k * 2 + 1]
            const x1 = x * cT + z * sT
            const z1 = -x * sT + z * cT
            if (z1 <= 0) continue
            const y2 = y * cP - z1 * sP
            const z2 = y * sP + z1 * cP
            const sc = D / (D - z2)
            ctx.beginPath()
            ctx.arc(cx + x1 * sc * s0, cy - y2 * sc * s0, 1.6, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      // linea di scansione durante la costruzione
      if (st.reveal < 1) {
        const yi = Math.min(N - 1, Math.max(0, Math.floor(front - SPREAD * 0.5)))
        const y = RINGS[yi].y - (YMAX + YMIN) / 2
        const rx = 0.78 * s0
        const ry = rx * Math.abs(sP) * 0.9
        const yy = cy - y * cP * s0
        const g = ctx.createLinearGradient(cx - rx, 0, cx + rx, 0)
        g.addColorStop(0, 'rgba(126,206,211,0)')
        g.addColorStop(0.5, 'rgba(101,203,237,0.9)')
        g.addColorStop(1, 'rgba(126,206,211,0)')
        ctx.globalAlpha = 0.85 * (1 - st.reveal)
        ctx.strokeStyle = g
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.ellipse(cx, yy, rx, Math.max(2, ry), 0, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    // Sequenza d'ingresso: il tratto del logo si disegna in CSS (subito, senza attendere
    // JavaScript), poi il dente si costruisce anello dopo anello e il tratto svanisce
    const tl = gsap.timeline({ delay })
    if (!reduce) {
      // il dente parte quando il tratto del logo (2,25 s dall'apertura) è quasi completo
    const t0 = Math.max(0.2, 1.9 - (performance.now() - mountedAt) / 1000)
    tl.to(st, { reveal: 1, duration: 2.6, ease: 'power2.out' }, t0)
        .to(markWrap.current, { autoAlpha: 0, scale: 0.94, duration: 1.4, ease: 'power2.inOut' }, t0 + 0.2)
    } else if (markWrap.current) {
      gsap.set(markWrap.current, { autoAlpha: 0 })
    }

    // Parallasse col puntatore (solo mouse) e reazione allo scroll
    const onMove = (e: PointerEvent) => {
      st.tx = e.clientX / window.innerWidth - 0.5
      st.ty = e.clientY / window.innerHeight - 0.5
    }
    if (isFinePointer() && !reduce) window.addEventListener('pointermove', onMove, { passive: true })
    const section = el.closest('section')
    const trig = reduce
      ? null
      : ScrollTrigger.create({
          trigger: section || el,
          start: 'top top',
          end: 'bottom top',
          onUpdate: (self) => {
            st.scroll = self.progress
          },
        })

    // Ciclo di disegno, attivo solo quando la hero è visibile
    let raf = 0
    let last = performance.now()
    let visible = true
    let skip = false
    const loop = (t: number) => {
      raf = visible ? requestAnimationFrame(loop) : 0
      if (coarse && (skip = !skip)) return
      const dt = Math.min(0.08, (t - last) / 1000)
      last = t
      st.theta += dt * (0.08 + 0.22 * st.reveal)
      st.px += (st.tx - st.px) * 0.045
      st.py += (st.ty - st.py) * 0.045
      draw()
    }
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !raf && !reduce) {
        last = performance.now()
        raf = requestAnimationFrame(loop)
      }
    })
    io.observe(el)
    if (!reduce) raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      tl.kill()
      trig?.kill()
      window.removeEventListener('pointermove', onMove)
    }
  }

  return (
    <div ref={wrap} className="relative h-full w-full" aria-hidden="true">
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div ref={markWrap} className="aspect-[450/580] h-[80%]">
          <ToothMark drawIn className="h-full w-full" strokeWidth={2.6} />
        </div>
      </div>
    </div>
  )
}
