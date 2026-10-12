import { useEffect, useId, useRef } from 'react'
import type { TreatmentId } from '../content/content'
import { gsap, prefersReducedMotion } from '../lib/motion'

/** Illustrazioni al tratto per ogni trattamento, disegnate quando entrano nello schermo. */
export function TreatmentVisual({ id, className = '', animate = true }: { id: TreatmentId; className?: string; animate?: boolean }) {
  const uid = useId().replace(/:/g, '')
  const ref = useRef<SVGSVGElement>(null)

  // Disegno al tratto quando l'illustrazione entra nello schermo. Si usa IntersectionObserver
  // (nessuna misura forzata durante l'avvio); se è già visibile al caricamento resta disegnata.
  useEffect(() => {
    const svg = ref.current
    if (!svg || !animate || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return
    const paths = svg.querySelectorAll('[data-d]')
    const fills = svg.querySelectorAll('[data-f]')
    let play: IntersectionObserver | null = null
    let tweens: gsap.core.Tween[] = []
    const arm = new IntersectionObserver(([e]) => {
      arm.disconnect()
      if (e.boundingClientRect.top < window.innerHeight) return
      gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 })
      gsap.set(fills, { autoAlpha: 0 })
      play = new IntersectionObserver(
        ([en]) => {
          if (!en.isIntersecting) return
          play?.disconnect()
          tweens = [
            gsap.to(paths, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', stagger: 0.06 }),
            gsap.to(fills, { autoAlpha: 1, duration: 1.2, delay: 0.9, stagger: 0.04 }),
          ]
        },
        { rootMargin: '0px 0px -15% 0px' },
      )
      play.observe(svg)
    })
    arm.observe(svg)
    return () => {
      arm.disconnect()
      play?.disconnect()
      tweens.forEach((t) => t.kill())
      gsap.set([...paths, ...fills], { clearProps: 'all' })
    }
  }, [animate, id])

  const S = `url(#g-${uid})`
  const p = { 'data-d': true, pathLength: 1, stroke: S, fill: 'none', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, vectorEffect: 'non-scaling-stroke' as const }
  const soft = { ...p, stroke: 'rgb(var(--ink) / 0.16)', strokeWidth: 1 }

  return (
    <svg ref={ref} viewBox="0 0 400 400" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`g-${uid}`} x1="60" y1="40" x2="340" y2="360" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="rgb(140 194 75)" />
          <stop offset="0.45" stopColor="rgb(126 206 211)" />
          <stop offset="0.75" stopColor="rgb(101 203 237)" />
          <stop offset="1" stopColor="rgb(31 154 211)" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="200" r="168" {...soft} strokeDasharray="1" />
      {id === 'implantologia' && (
        <g>
          <path {...p} d="M142 118C140 84 168 70 199 86C231 70 259 84 258 118L253 160C249 178 151 178 147 160Z" />
          <path {...p} d="M183 178L187 204H213L217 178" />
          <path {...p} d="M177 206H223L219 318Q200 346 181 318Z" />
          {[222, 240, 258, 276, 294, 310].map((y, i) => (
            <path key={y} {...p} d={`M${178 + i * 0.4} ${y}L${222 - i * 0.4} ${y + 8}`} />
          ))}
          <path {...p} d="M62 196C108 186 140 204 172 200M228 200C262 196 292 206 338 194" />
          <path {...soft} d="M70 236H330M80 262H320M92 288H308" strokeDasharray="1" />
        </g>
      )}
      {id === 'parodontologia' && (
        <g>
          <path {...p} d="M162 168C158 120 166 82 200 82C234 82 242 120 238 168C236 236 224 296 206 338Q200 350 194 338C176 296 164 236 162 168Z" />
          <path {...p} d="M146 186C150 252 166 312 188 356M254 186C250 252 234 312 212 356" />
          <path {...p} d="M58 178C96 168 124 170 148 190C166 206 186 184 200 184C214 184 234 206 252 190C276 170 304 168 342 178" />
          <path {...soft} d="M74 236C120 226 140 246 152 248M326 236C280 226 260 246 248 248M84 284C124 276 146 292 164 296M316 284C276 276 254 292 236 296" />
          <circle data-f cx="200" cy="130" r="3" fill={S} />
        </g>
      )}
      {id === 'ortodonzia' && <Arch S={S} p={p} soft={soft} />}
      {id === 'pediatrica' && (
        <g>
          {/* dente da latte e dente permanente, con la crescita tra i due */}
          <path {...p} d="M92 214C90 192 106 182 124 192C142 182 158 192 156 214L153 238C151 262 144 286 136 300Q130 308 126 298L124 276L120 298Q116 308 110 300C102 286 97 262 95 238Z" />
          <path {...p} d="M218 132C214 92 246 74 278 94C310 74 342 92 338 132L334 176C330 220 318 268 304 302Q296 318 288 300L280 248L272 300Q264 318 256 302C242 268 230 220 222 176Z" />
          <path {...p} d="M120 162C140 110 186 92 214 104" />
          <path {...p} d="M204 94L216 104L204 116" />
          <path {...soft} d="M70 322H350" strokeDasharray="1" />
          {[
            [104, 128, 4],
            [148, 96, 2.8],
            [176, 150, 2.2],
          ].map(([x, y, r]) => (
            <circle key={`${x}-${y}`} data-d pathLength={1} cx={x} cy={y} r={r} fill="none" stroke={S} strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
      )}
      {id === 'endodonzia' && (
        <g>
          {/* dente con camera pulpare e canale radicolare */}
          <path {...p} d="M146 118C142 84 172 68 200 80C228 68 258 84 254 118L250 172C248 232 230 300 212 344Q200 364 188 344C170 300 152 232 150 172Z" />
          <path {...p} d="M184 128C182 112 218 112 216 128L212 168C210 226 205 284 200 326C195 284 190 226 188 168Z" />
          <path {...p} d="M200 26V112" />
          <path {...p} d="M186 26H214" />
          <path {...p} d="M194 46L206 54M194 62L206 70M194 78L206 86" strokeWidth={1.2} />
          <path {...soft} d="M66 190C108 182 132 196 152 196M334 190C292 182 268 196 248 196M80 236C120 230 140 244 156 246M320 236C280 230 260 244 244 246" />
          <circle data-f cx="200" cy="140" r="3" fill={S} />
        </g>
      )}
      {id === 'protesi' && (
        <g>
          {/* ponte di tre corone su due pilastri */}
          <path {...p} d="M76 160C74 130 96 118 116 128C136 118 158 130 156 160L152 204Q150 214 140 214H92Q82 214 80 204Z" />
          <path {...p} d="M160 156C158 126 180 114 200 124C220 114 242 126 240 156L236 200Q234 210 224 210H176Q166 210 164 200Z" />
          <path {...p} d="M244 160C242 130 264 118 284 128C304 118 326 130 324 160L320 204Q318 214 308 214H260Q250 214 248 204Z" />
          <path {...p} d="M156 182H162M238 182H246" strokeWidth={3} />
          <path {...p} d="M96 214L104 296Q116 316 128 296L136 214" />
          <path {...p} d="M264 214L272 296Q284 316 296 296L304 214" />
          <path {...soft} d="M56 240C110 228 150 250 200 244C250 238 290 228 344 240" />
          <path {...soft} d="M60 340H340" strokeDasharray="1" />
          <path {...p} d="M326 86L331 100L345 105L331 110L326 124L321 110L307 105L321 100Z" />
        </g>
      )}
      {id === 'igiene' && (
        <g>
          <path {...p} d="M150 210C146 170 170 150 200 166C230 150 254 170 250 210L246 244C243 262 157 262 154 244Z" />
          <path {...p} d="M120 232A82 82 0 0 1 280 232" />
          <path {...p} d="M96 238A106 106 0 0 1 304 238" />
          <path {...soft} d="M72 244A130 130 0 0 1 328 244" strokeDasharray="1" />
          <path {...p} d="M262 92L332 162" />
          <path {...p} d="M246 108L262 92M254 116L270 100M262 124L278 108M270 132L286 116" />
          {[
            [150, 120, 5],
            [178, 98, 3.5],
            [126, 150, 3],
            [210, 112, 2.5],
          ].map(([x, y, r]) => (
            <circle key={`${x}-${y}`} data-d pathLength={1} cx={x} cy={y} r={r} fill="none" stroke={S} strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
          ))}
          <path {...soft} d="M150 296H250M170 316H230" />
        </g>
      )}
    </svg>
  )
}

type PathProps = Record<string, unknown>
function Arch({ S, p, soft }: { S: string; p: PathProps; soft: PathProps }) {
  // Arcata superiore stilizzata: denti lungo una parabola, filo e attacchi
  const n = 12
  const pts = Array.from({ length: n }, (_, i) => {
    const t = -1 + (2 * i) / (n - 1)
    const x = 200 + t * 130
    const y = 300 - (1 - t * t) * 170
    const ang = Math.atan2(-2 * t * 170 * -1, 130)
    return { x, y, ang, w: i === 5 || i === 6 ? 30 : i === 4 || i === 7 ? 24 : i === 3 || i === 8 ? 22 : 26 }
  })
  const wire = pts.map((q, i) => `${i ? 'L' : 'M'}${q.x.toFixed(1)} ${(q.y + 4).toFixed(1)}`).join('')
  return (
    <g>
      {pts.map((q, i) => (
        <g key={i} transform={`translate(${q.x} ${q.y}) rotate(${(q.ang * 180) / Math.PI})`}>
          <rect {...p} x={-q.w / 2} y={-18} width={q.w} height={36} rx={10} />
          <rect data-f x={-5} y={-1} width={10} height={10} rx={2} fill={S} opacity={0.85} />
        </g>
      ))}
      <path {...p} d={wire} strokeWidth={1.2} />
      <path {...soft} d="M120 340H280" strokeDasharray="1" />
    </g>
  )
}
