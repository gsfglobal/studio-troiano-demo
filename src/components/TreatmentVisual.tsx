import { useId, useLayoutEffect, useRef } from 'react'
import type { TreatmentId } from '../content/content'
import { gsap, prefersReducedMotion } from '../lib/motion'

/** Illustrazioni al tratto per ogni trattamento, disegnate quando entrano nello schermo. */
export function TreatmentVisual({ id, className = '', animate = true }: { id: TreatmentId; className?: string; animate?: boolean }) {
  const uid = useId().replace(/:/g, '')
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const svg = ref.current
    if (!svg || !animate || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const paths = svg.querySelectorAll('[data-d]')
      gsap.fromTo(
        paths,
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: 'power2.inOut',
          stagger: 0.06,
          scrollTrigger: { trigger: svg, start: 'top 85%', once: true },
        },
      )
      gsap.from(svg.querySelectorAll('[data-f]'), {
        autoAlpha: 0,
        duration: 1.2,
        delay: 0.9,
        stagger: 0.04,
        scrollTrigger: { trigger: svg, start: 'top 85%', once: true },
      })
    }, svg)
    return () => ctx.revert()
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
      {id === 'estetica' && (
        <g>
          <path {...p} d="M146 104H196V256Q196 282 172 284Q146 284 146 256Z" />
          <path {...p} d="M204 104H254V256Q254 284 228 284Q204 282 204 256Z" />
          <path {...p} d="M108 120H140V242Q140 262 124 264Q108 262 108 244Z" />
          <path {...p} d="M260 120H292V244Q292 262 276 264Q260 262 260 242Z" />
          <path {...p} d="M86 300Q200 352 314 300" />
          <path {...soft} d="M108 70V330M146 70V330M200 70V330M254 70V330M292 70V330" strokeDasharray="1" />
          <path {...p} d="M318 96L324 112L340 118L324 124L318 140L312 124L296 118L312 112Z" />
          <circle data-f cx="170" cy="150" r="2.5" fill={S} />
          <circle data-f cx="228" cy="150" r="2.5" fill={S} />
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
