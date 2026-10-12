import { useRef } from 'react'
import { Lines } from './Lines'
import { LogoTooth } from './LogoTooth'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { useIsoLayoutEffect } from '../lib/hooks'
import { ContactButtons } from './ContactButtons'
import { studio } from '../config/site'

/** Chiamata all'azione finale, con il dente del logo che si scopre durante lo scroll. */
export function CtaBand({ title = ['Il primo passo', <>è una <em className="accent accent-grad">conversazione.</em></>] }: { title?: React.ReactNode[] }) {
  const root = useRef<HTMLElement>(null)
  const tooth = useRef<HTMLDivElement>(null)
  useIsoLayoutEffect(() => {
    const t = tooth.current
    if (!t || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        t,
        { clipPath: 'inset(0% 0% 100% 0%)', scale: 0.96 },
        { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'center 45%', scrub: 1 } },
      )
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={root} className="relative overflow-hidden bg-paper">
      <div className="wrap relative grid items-center gap-12 py-24 md:py-36 lg:grid-cols-12">
        <div className="relative z-10 lg:col-span-7">
          <p className="t-eyebrow" data-reveal="fade">Prenota una visita</p>
          <Lines as="h2" lines={title} className="t-display mt-6" />
          <p className="t-lead mt-8 max-w-[46ch]" data-reveal="fade">
            Scrivici su WhatsApp o chiama lo studio negli orari di apertura: la segreteria ti aiuta a scegliere il giorno e l'orario più comodi.
          </p>
          <div className="mt-10" data-reveal="fade">
            <ContactButtons />
          </div>
          <dl className="mt-10 grid max-w-[460px] gap-1.5 border-t border-ink/10 pt-6 text-[0.92rem]" data-reveal="fade">
            {studio.hours.map((h) => (
              <div key={h.days} className="flex flex-wrap justify-between gap-x-6">
                <dt className="text-ink-soft">{h.days}</dt>
                <dd className="tabular-nums">{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative h-[34vh] min-h-[240px] lg:col-span-5 lg:h-[64vh]" aria-hidden="true">
          <div className="absolute inset-0 rounded-full opacity-70 blur-3xl" style={{ background: 'radial-gradient(closest-side, rgb(var(--aqua) / 0.25), transparent)' }} />
          <div ref={tooth} className="relative flex h-full w-full items-center justify-center">
            <LogoTooth className="h-[78%] w-auto" />
          </div>
        </div>
      </div>
    </section>
  )
}
