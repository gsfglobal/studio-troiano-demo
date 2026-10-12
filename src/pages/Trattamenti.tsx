import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Minus, Plus } from 'lucide-react'
import { PageHero } from '../components/PageHero'
import { Lines } from '../components/Lines'
import { RichText } from '../components/RichText'
import { TreatmentVisual } from '../components/TreatmentVisual'
import { CtaBand } from '../components/CtaBand'
import { treatments, type Treatment, type TreatmentId } from '../content/content'
import { gsap, ScrollTrigger, prefersReducedMotion, scrollToEl } from '../lib/motion'
import { useIsoLayoutEffect } from '../lib/hooks'
import { setupReveals } from '../lib/reveal'

export default function Trattamenti() {
  const root = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<TreatmentId>(treatments[0].id)
  const [openId, setOpenId] = useState<TreatmentId | null>(null)
  const [params] = useSearchParams()

  useIsoLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => setupReveals(el), el)
    return () => ctx.revert()
  }, [])

  // Voce attiva dell'indice: il trattamento che attraversa la linea a metà schermo
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id.slice(2) as TreatmentId)),
      { rootMargin: '-45% 0px -54% 0px' },
    )
    treatments.forEach((t) => {
      const node = document.getElementById(`t-${t.id}`)
      if (node) io.observe(node)
    })
    return () => io.disconnect()
  }, [])

  // Arrivo da un link (es. dalla home): porta al trattamento scelto e apre l'approfondimento
  useEffect(() => {
    const t = params.get('t') as TreatmentId | null
    if (!t || !treatments.some((x) => x.id === t)) return
    const id = setTimeout(() => {
      scrollToEl(document.getElementById(`t-${t}`), -110)
      setOpenId(t)
    }, 650)
    return () => clearTimeout(id)
  }, [params])

  return (
    <div ref={root}>
      <PageHero
        eyebrow="Trattamenti"
        lines={['Cure su misura,', <>spiegate con <em className="accent accent-grad">chiarezza.</em></>]}
        lead="Ogni trattamento inizia da una visita e da un confronto sulle possibili soluzioni, con i tempi giusti per decidere."
      />

      {/* Indice per smartphone e tablet */}
      <nav aria-label="Indice dei trattamenti" className="sticky z-20 border-y border-ink/5 bg-paper/85 backdrop-blur-xl lg:hidden" style={{ top: 'calc(var(--header-h) + env(safe-area-inset-top, 0px))' }}>
        <ul className="no-scrollbar wrap flex gap-2 overflow-x-auto py-3">
          {treatments.map((t) => (
            <li key={t.id} className="shrink-0">
              <button
                type="button"
                onClick={() => scrollToEl(document.getElementById(`t-${t.id}`), -150)}
                className={`rounded-full px-4 py-2 text-[0.85rem] font-medium transition-colors ${active === t.id ? 'bg-night text-white' : 'bg-mist text-ink-soft'}`}
              >
                {t.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="wrap grid gap-10 pb-24 pt-8 md:pb-32 lg:grid-cols-12 lg:pt-16">
        <aside className="hidden lg:col-span-3 lg:block">
          <nav aria-label="Indice dei trattamenti" className="sticky top-[calc(var(--header-h)+48px)]">
            <p className="t-eyebrow">Indice</p>
            <ul className="mt-6 grid gap-1">
              {treatments.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => scrollToEl(document.getElementById(`t-${t.id}`), -110)}
                    className={`group flex w-full items-center gap-3 py-2 text-left text-[1rem] transition-colors ${active === t.id ? 'text-ink' : 'text-ink-soft hover:text-ink'}`}
                    aria-current={active === t.id ? 'true' : undefined}
                  >
                    <span className={`h-px shrink-0 transition-all duration-500 ease-out-expo ${active === t.id ? 'w-8' : 'w-3 bg-ink/20'}`} style={active === t.id ? { background: 'var(--grad-brand)' } : undefined} />
                    {t.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="grid gap-24 md:gap-36 lg:col-span-9">
          {treatments.map((t, i) => (
            <TreatmentBlock key={t.id} t={t} flip={i % 2 === 1} open={openId === t.id} onToggle={() => setOpenId((o) => (o === t.id ? null : t.id))} />
          ))}
        </div>
      </div>

      <CtaBand title={['Non sai da dove', <>iniziare? <em className="accent accent-grad">Parliamone.</em></>]} />
    </div>
  )
}

function TreatmentBlock({ t, flip, open, onToggle }: { t: Treatment; flip: boolean; open: boolean; onToggle: () => void }) {
  const panel = useRef<HTMLDivElement>(null)
  const first = useRef(true)
  // Stato iniziale già nell'HTML (chiuso), così l'idratazione non sposta la pagina
  const initialStyle = useRef(open ? undefined : { height: 0, opacity: 0, visibility: 'hidden' as const })

  useIsoLayoutEffect(() => {
    const el = panel.current
    if (!el) return
    if (first.current) {
      first.current = false
      gsap.set(el, { height: open ? 'auto' : 0, autoAlpha: open ? 1 : 0 })
      return
    }
    const d = prefersReducedMotion() ? 0 : 0.7
    if (open) gsap.fromTo(el, { height: 0, autoAlpha: 0 }, { height: 'auto', autoAlpha: 1, duration: d, ease: 'power3.inOut', onComplete: () => ScrollTrigger.refresh() })
    else gsap.to(el, { height: 0, autoAlpha: 0, duration: d * 0.8, ease: 'power3.inOut', onComplete: () => ScrollTrigger.refresh() })
  }, [open])

  return (
    <article id={`t-${t.id}`} aria-labelledby={`t-${t.id}-title`} className="scroll-mt-40">
      <div className="grid gap-10 md:grid-cols-12 md:items-start md:gap-12">
        <div className={`md:col-span-5 ${flip ? 'md:order-2 md:col-start-8' : ''}`}>
          <div className="relative aspect-square overflow-hidden rounded-[30px] bg-mist md:sticky md:top-[calc(var(--header-h)+48px)]" data-reveal="fade">
            <div aria-hidden="true" className="absolute inset-0" style={{ background: 'radial-gradient(70% 70% at 30% 20%, rgb(var(--sky) / 0.14), transparent 70%)' }} />
            <TreatmentVisual id={t.id} className="relative h-full w-full p-3" />
          </div>
        </div>
        <div className={`md:col-span-7 ${flip ? 'md:order-1 md:col-span-6' : 'md:col-start-7 md:col-span-6'}`}>
          <p className="t-eyebrow" data-reveal="fade">{t.short}</p>
          <Lines as="h2" id={`t-${t.id}-title`} className="t-h2 mt-4" lines={[t.title]} />
          <p className="t-lead mt-6" data-reveal="fade">{t.description}</p>
          {t.details?.map((d, k) => (
            <p key={k} className="t-body mt-5 text-[1.02rem]" data-reveal="fade">
              <RichText parts={d} />
            </p>
          ))}
          <ul className="mt-8 grid gap-3 border-t border-ink/10 pt-6" data-reveal="stagger">
            {t.expect.map((e) => (
              <li key={e} className="flex items-center gap-3 text-[0.98rem]">
                <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: 'var(--grad-brand)' }} />
                {e}
              </li>
            ))}
          </ul>
          <button type="button" onClick={onToggle} aria-expanded={open} aria-controls={`t-${t.id}-more`} className="btn btn-ghost mt-9">
            <span>{open ? 'Chiudi' : 'Come si svolge'}</span>
            <span className="btn-icon" aria-hidden="true">{open ? <Minus size={17} /> : <Plus size={17} />}</span>
          </button>
          <div id={`t-${t.id}-more`} ref={panel} className="overflow-hidden" role="region" aria-label={`Come si svolge: ${t.title}`} style={initialStyle.current}>
            <div className="pt-8">
              <ol className="grid gap-5 sm:grid-cols-3">
                {t.steps.map((s, k) => (
                  <li key={s.title} className="rounded-2xl bg-mist p-5">
                    <p className="text-[0.75rem] font-semibold tabular-nums tracking-[0.18em] text-blue-deep">0{k + 1}</p>
                    <p className="mt-2 font-semibold">{s.title}</p>
                    <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-soft">{s.text}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-5 text-[0.8rem] text-ink-soft">Informazioni di carattere generale: tempi e modalità si definiscono dopo la visita.</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
