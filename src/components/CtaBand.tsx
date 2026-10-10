import { useLayoutEffect, useRef } from 'react'
import { MessageCircle } from 'lucide-react'
import { Button } from './Button'
import { Lines } from './Lines'
import { ToothMark } from './ToothMark'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { whatsappUrl } from '../config/site'

/** Chiamata all'azione finale, con il tratto del dente che si disegna durante lo scroll. */
export function CtaBand({ title = ['Il primo passo', <>è una <em className="accent accent-grad">conversazione.</em></>] }: { title?: React.ReactNode[] }) {
  const root = useRef<HTMLElement>(null)
  const path = useRef<SVGPathElement>(null)
  useLayoutEffect(() => {
    const p = path.current
    if (!p || prefersReducedMotion()) return
    const len = p.getTotalLength()
    const ctx = gsap.context(() => {
      gsap.fromTo(
        p,
        { strokeDasharray: len, strokeDashoffset: len },
        { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'center 45%', scrub: 1 } },
      )
    }, root)
    return () => ctx.revert()
  }, [])
  const wa = whatsappUrl()
  return (
    <section ref={root} className="relative overflow-hidden bg-paper">
      <div className="wrap relative grid items-center gap-12 py-24 md:py-36 lg:grid-cols-12">
        <div className="relative z-10 lg:col-span-7">
          <p className="t-eyebrow" data-reveal="fade">Prenota una visita</p>
          <Lines as="h2" lines={title} className="t-display mt-6" />
          <p className="t-lead mt-8 max-w-[46ch]" data-reveal="fade">
            Raccontaci di cosa hai bisogno: la segreteria ti ricontatta per fissare il giorno e l'orario più comodi.
          </p>
          <div className="mt-10 flex flex-wrap gap-3" data-reveal="fade">
            <Button to="/contatti" variant="primary">Prenota una visita</Button>
            {wa ? (
              <Button href={wa} variant="ghost" icon={<MessageCircle size={17} strokeWidth={1.8} />}>Scrivi su WhatsApp</Button>
            ) : (
              <Button to="/contatti" variant="ghost" icon={<MessageCircle size={17} strokeWidth={1.8} />}>Scrivi su WhatsApp</Button>
            )}
          </div>
        </div>
        <div className="relative h-[46vh] min-h-[320px] lg:col-span-5 lg:h-[64vh]" aria-hidden="true">
          <div className="absolute inset-0 rounded-full opacity-70 blur-3xl" style={{ background: 'radial-gradient(closest-side, rgb(var(--aqua) / 0.25), transparent)' }} />
          <ToothMark ref={path} className="relative h-full w-full" strokeWidth={2.4} />
        </div>
      </div>
    </section>
  )
}
