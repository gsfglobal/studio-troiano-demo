import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { PageHero } from '../components/PageHero'
import { Lines } from '../components/Lines'
import { Img } from '../components/Img'
import { CtaBand } from '../components/CtaBand'
import { technologies, treatments } from '../content/content'
import { gsap, scrollToEl } from '../lib/motion'
import { useIsoLayoutEffect } from '../lib/hooks'
import { setupReveals } from '../lib/reveal'

export default function Tecnologie() {
  const root = useRef<HTMLDivElement>(null)
  const { hash } = useLocation()

  useIsoLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => setupReveals(el), el)
    return () => ctx.revert()
  }, [])

  // Arrivo da un link della home (#scanner-intraorale, …)
  useEffect(() => {
    if (!hash) return
    const id = setTimeout(() => scrollToEl(document.getElementById(hash.slice(1)), -110), 650)
    return () => clearTimeout(id)
  }, [hash])

  const treatmentTitle = (id: string) => treatments.find((t) => t.id === id)?.title ?? id

  return (
    <div ref={root}>
      <PageHero
        eyebrow="Tecnologie"
        lines={['Strumenti digitali', <>al servizio <em className="accent accent-grad">della cura.</em></>]}
        lead="Le tecnologie che lo studio utilizza nella diagnosi, nella chirurgia e nella protesi. Il loro impiego si valuta caso per caso, dopo la visita."
      >
        <nav aria-label="Indice delle tecnologie" className="mt-12 md:mt-16" data-reveal="fade">
          <ul className="flex flex-wrap gap-2">
            {technologies.map((t) => (
              <li key={t.id}>
                <a
                  href={`#${t.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToEl(document.getElementById(t.id), -110)
                  }}
                  className="inline-flex rounded-full border border-ink/15 px-4 py-2 text-[0.88rem] font-medium text-ink-soft transition-colors hover:border-ink/40 hover:text-ink"
                >
                  {t.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      <div className="bg-paper pb-12 md:pb-20">
        {technologies.map((t, i) => {
          const flip = i % 2 === 1
          return (
            <section key={t.id} id={t.id} aria-labelledby={`${t.id}-title`} className="scroll-mt-28">
              <div className="wrap grid gap-10 py-16 md:py-24 lg:grid-cols-12 lg:items-center lg:gap-12">
                <figure className={`lg:col-span-6 ${flip ? 'lg:order-2 lg:col-start-7' : ''}`}>
                  <div
                    className={`img-frame aspect-[4/3] rounded-[30px] ${t.tone === 'dark' ? '!bg-black' : '!bg-white ring-1 ring-inset ring-ink/10'}`}
                    data-reveal="image"
                  >
                    <Img name={t.image} alt={t.alt} sizes="(min-width: 1024px) 46vw, 100vw" className="!object-contain p-4 md:p-8" />
                  </div>
                  <figcaption className="mt-3 text-[0.78rem] text-ink-soft">Immagine illustrativa</figcaption>
                </figure>
                <div className={`lg:col-span-5 ${flip ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-8'}`}>
                  <p className="text-[0.78rem] font-semibold tabular-nums tracking-[0.2em] text-blue-deep" data-reveal="fade">
                    0{i + 1} · {t.short}
                  </p>
                  <Lines as="h2" id={`${t.id}-title`} className="t-h2 mt-5 !text-[clamp(2rem,1.3rem+2.6vw,3.8rem)]" lines={[t.title]} />
                  <p className="t-lead mt-7 max-w-[46ch]" data-reveal="fade">{t.text}</p>
                  <div className="mt-8 border-t border-ink/10 pt-6" data-reveal="fade">
                    <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-ink-soft">Si utilizza in</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {t.related.map((r) => (
                        <li key={r}>
                          <Link to={`/trattamenti?t=${r}`} className="inline-flex items-center gap-1.5 rounded-full bg-mist px-4 py-2 text-[0.88rem] font-medium hover:bg-line">
                            {treatmentTitle(r)}
                            <ArrowUpRight size={14} aria-hidden="true" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          )
        })}
      </div>

      <CtaBand title={['Hai domande', <>su un <em className="accent accent-grad">trattamento?</em></>]} />
    </div>
  )
}
