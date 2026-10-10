import { Component, lazy, Suspense, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion'
import { useIsDesktop } from '../lib/hooks'
import { Button } from './Button'
import type { ProgressRef } from '../three/ToothScene'

const ToothScene = lazy(() => import('../three/ToothScene'))

const STEPS = [
  {
    k: '01',
    label: 'Anatomia',
    title: 'Corona, colletto, radici.',
    text: 'Un primo molare inferiore ha cinque cuspidi e due radici. Conoscerne la forma è il punto di partenza di ogni cura.',
  },
  {
    k: '02',
    label: 'Superficie',
    title: 'Cuspidi e solchi.',
    text: 'Sulla superficie masticatoria, solchi e fossette trattengono più facilmente la placca: per questo igiene e controlli periodici sono importanti.',
  },
  {
    k: '03',
    label: 'Sotto la gengiva',
    title: 'Ciò che non si vede.',
    text: 'Il colletto segna il passaggio tra corona e radice. Sotto la gengiva, osso e tessuti di sostegno tengono il dente al suo posto.',
  },
  {
    k: '04',
    label: 'Il percorso',
    title: 'Ogni trattamento parte da qui.',
    text: 'Dalla prevenzione all’implantologia, ogni percorso inizia da una visita e da una spiegazione chiara.',
  },
]

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

class GLBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function Poster() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <img src="images/molare-3d.webp" alt="" className="h-[70%] w-auto object-contain opacity-90" />
    </div>
  )
}

/** Sezione 3D: il dente ruota e la camera si muove seguendo lo scroll (sezione bloccata). */
export function ToothExperience() {
  const section = useRef<HTMLElement>(null)
  const progressObj = useRef<ProgressRef>({ current: 0 }).current
  const [active, setActive] = useState(false)
  const [near, setNear] = useState(false)
  const [gl] = useState(() => (typeof window === 'undefined' ? false : hasWebGL()))
  const wide = useIsDesktop()
  const lite = !wide || (typeof navigator !== 'undefined' && (navigator.hardwareConcurrency || 8) <= 4)
  const reduce = prefersReducedMotion()

  // Carica la scena solo quando la sezione si avvicina
  useEffect(() => {
    const el = section.current
    if (!el) return
    const near = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '120% 0px' })
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '10% 0px' })
    near.observe(el)
    io.observe(el)
    return () => {
      near.disconnect()
      io.disconnect()
    }
  }, [])

  useLayoutEffect(() => {
    const el = section.current
    if (!el) return
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el)
      const steps = q('[data-step]')
      const bar = q('[data-progress]')
      if (reduce) {
        // Movimento ridotto: tutte le didascalie visibili, il dente si muove senza transizioni scenografiche
        gsap.set(steps, { autoAlpha: 1, y: 0 })
        ScrollTrigger.create({
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (s) => {
            progressObj.current = s.progress
          },
        })
        return
      }
      gsap.set(steps, { autoAlpha: 0, y: 40 })
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (s) => {
            progressObj.current = s.progress
          },
        },
      })
      tl.to({}, { duration: 1 }, 0)
      tl.to(q('[data-intro]'), { autoAlpha: 0, y: -20, duration: 0.05 }, 0.04)
      const windows: [number, number][] = [
        [0.08, 0.3],
        [0.38, 0.56],
        [0.62, 0.8],
        [0.86, 1.2],
      ]
      steps.forEach((s, i) => {
        const [a, b] = windows[i]
        tl.to(s, { autoAlpha: 1, y: 0, duration: 0.05 }, a)
        if (b < 1) tl.to(s, { autoAlpha: 0, y: -40, duration: 0.05, ease: 'power2.in' }, b)
      })
      tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 1 }, 0)
    }, el)
    return () => ctx.revert()
  }, [reduce, progressObj])

  return (
    <section ref={section} id="esperienza-3d" aria-label="Esperienza 3D: anatomia di un molare" className="relative h-[480svh] bg-paper lg:h-[540vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(60% 55% at 50% 45%, rgb(var(--mist)) 0%, rgb(var(--paper)) 70%)' }} />
        <div className="absolute inset-0">
          {gl && near ? (
            <GLBoundary fallback={<Poster />}>
              <Suspense fallback={<Poster />}>
                <ToothScene progress={progressObj} active={active} lite={lite} wide={wide} />
              </Suspense>
            </GLBoundary>
          ) : (
            <Poster />
          )}
        </div>

        {/* Intestazione della sezione */}
        <div className="wrap pt-header pointer-events-none relative">
          <div data-intro className="pt-8 md:pt-10">
            <p className="t-eyebrow">Esperienza 3D</p>
            <p className="mt-3 max-w-[30ch] text-[0.95rem] text-ink-soft">Scorri per esplorare un molare, dalla superficie alle radici.</p>
          </div>
        </div>

        {/* Didascalie */}
        <div className="wrap pointer-events-none absolute inset-x-0 bottom-0 top-0">
          <div className="relative h-full">
            {STEPS.map((s, i) => (
              <div
                key={s.k}
                data-step
                className={`absolute inset-x-0 bottom-[7svh] rounded-3xl bg-paper/80 p-6 backdrop-blur-md md:inset-x-[12%] lg:inset-x-auto lg:bottom-auto lg:left-0 lg:top-1/2 lg:w-[min(420px,40vw)] lg:-translate-y-1/2 lg:bg-transparent lg:p-0 lg:backdrop-blur-0 ${
                  i === 3 ? 'pointer-events-auto' : ''
                }`}
              >
                <p className="t-eyebrow flex items-center gap-3">
                  <span className="tabular-nums text-ink-soft">{s.k}</span>
                  <span className="grad-line inline-block w-6" />
                  {s.label}
                </p>
                <h3 className="t-h2 mt-4 !text-[clamp(1.9rem,1.3rem+2.4vw,3.6rem)]">{s.title}</h3>
                <p className="t-lead mt-4 max-w-[38ch]">{s.text}</p>
                {i === 3 ? (
                  <div className="mt-7">
                    <Button to="/trattamenti" variant="primary">
                      Scopri i trattamenti
                    </Button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {/* Avanzamento e nota */}
        <div className="wrap pointer-events-none absolute inset-x-0 bottom-0 pb-[max(14px,env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-end gap-6 text-[0.72rem] text-ink-soft">
            <span className="hidden md:inline">Modello 3D illustrativo di un primo molare inferiore</span>
            <span className="relative h-px w-full max-w-[220px] overflow-hidden bg-ink/10 md:w-[220px]">
              <span data-progress className="absolute inset-0 origin-left" style={{ background: 'var(--grad-brand)' }} />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
