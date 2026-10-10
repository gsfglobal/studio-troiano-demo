import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { HeroTooth } from '../components/HeroTooth'
import { Button } from '../components/Button'
import { Lines } from '../components/Lines'
import { ToothExperience } from '../components/ToothExperience'
import { Gallery } from '../components/Gallery'
import { Journey } from '../components/Journey'
import { CtaBand } from '../components/CtaBand'
import { TreatmentVisual } from '../components/TreatmentVisual'
import { treatments, type TreatmentId } from '../content/content'
import { gsap, isFinePointer, prefersReducedMotion } from '../lib/motion'
import { setupReveals } from '../lib/reveal'
import { usePageMeta } from '../lib/usePageMeta'

export default function Home() {
  const root = useRef<HTMLDivElement>(null)
  usePageMeta('Studio Dentistico Troiano', 'Studio Dentistico Troiano: un nuovo modo di vivere il proprio sorriso.')

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      setupReveals(el)
      if (prefersReducedMotion()) return
      // Ingresso della hero, dopo che il tratto del dente ha iniziato a disegnarsi
      const tl = gsap.timeline({ delay: 1.05 })
      tl.from('[data-hero-eyebrow]', { autoAlpha: 0, y: 16, duration: 1, ease: 'power3.out' })
        .from('[data-hero-title] .line-mask > span', { yPercent: 115, duration: 1.4, ease: 'power4.out', stagger: 0.12 }, 0.1)
        .from('[data-hero-lead]', { autoAlpha: 0, y: 22, duration: 1.2, ease: 'power3.out' }, 0.55)
        .from('[data-hero-cta] > *', { autoAlpha: 0, y: 22, duration: 1.1, ease: 'power3.out', stagger: 0.1 }, 0.75)
        .from('[data-hero-cue]', { autoAlpha: 0, duration: 1.2 }, 1.2)

      // Dichiarazione: le parole si accendono durante lo scroll
      gsap.fromTo(
        '[data-word]',
        { opacity: 0.14 },
        { opacity: 1, ease: 'none', stagger: 0.04, scrollTrigger: { trigger: '[data-statement]', start: 'top 78%', end: 'bottom 52%', scrub: true } },
      )
    }, el)
    return () => ctx.revert()
  }, [])

  const statement =
    'Prima di ogni cura viene la persona. Ascoltiamo, spieghiamo con calma ciò che vediamo e costruiamo insieme il percorso più adatto a te.'

  return (
    <div ref={root}>
      {/* 1 — Hero */}
      <section aria-labelledby="hero-title" className="relative isolate min-h-[100svh] overflow-hidden bg-paper">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="ambient absolute -right-[12%] top-[2%] h-[62vmax] w-[62vmax] rounded-full blur-3xl" style={{ background: 'radial-gradient(closest-side, rgb(var(--sky) / 0.16), transparent)' }} />
          <div className="ambient absolute -left-[18%] bottom-[-20%] h-[50vmax] w-[50vmax] rounded-full blur-3xl [animation-delay:-6s]" style={{ background: 'radial-gradient(closest-side, rgb(var(--green) / 0.12), transparent)' }} />
        </div>
        <div className="wrap pt-header grid min-h-[100svh] grid-rows-[auto_1fr] gap-2 pb-16 lg:grid-cols-12 lg:grid-rows-1 lg:items-center lg:gap-8 lg:pb-10">
          <div className="relative order-1 h-[34svh] min-h-[220px] md:h-[42svh] lg:order-2 lg:col-span-6 lg:h-[80svh]">
            <HeroTooth />
          </div>
          <div className="relative z-10 order-2 lg:order-1 lg:col-span-6">
            <p data-hero-eyebrow className="t-eyebrow flex items-center gap-3">
              <span className="grad-line inline-block w-8" />
              Studio Dentistico Troiano
            </p>
            <h1 id="hero-title" data-hero-title className="t-display mt-6">
              <span className="line-mask"><span>Ogni sorriso</span></span>
              <span className="line-mask"><span>racconta una</span></span>
              <span className="line-mask"><span><em className="accent accent-grad">storia.</em></span></span>
            </h1>
            <p data-hero-lead className="t-lead mt-7 max-w-[40ch]">
              Un nuovo modo di vivere il proprio sorriso, dove attenzione alla persona e cura dei dettagli si incontrano.
            </p>
            <div data-hero-cta className="mt-9 flex flex-wrap gap-3">
              <Button to="/contatti" variant="primary">Prenota una visita</Button>
              <Button to="/studio" variant="ghost" icon={<ArrowRight size={17} strokeWidth={1.8} />}>Esplora lo studio</Button>
            </div>
          </div>
        </div>
        <div data-hero-cue aria-hidden="true" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-ink-soft lg:flex">
          Scorri
          <span className="relative h-10 w-px overflow-hidden bg-ink/10">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[cue_2.2s_ease-in-out_infinite]" style={{ background: 'var(--grad-brand)' }} />
          </span>
        </div>
      </section>

      {/* 2 — Introduzione */}
      <section aria-label="Lo studio" className="bg-paper">
        <div className="wrap py-24 md:py-40">
          <p className="t-eyebrow" data-reveal="fade">Lo studio</p>
          <p data-statement className="t-statement mt-8 max-w-[22ch] md:max-w-[26ch]">
            {statement.split(' ').map((w, i) => (
              <span key={i} data-word>
                {w}{' '}
              </span>
            ))}
          </p>
          <div className="mt-20 grid gap-10 md:mt-28 lg:grid-cols-12 lg:items-end">
            <figure className="lg:col-span-7">
              <div className="img-frame aspect-[16/10] rounded-[26px]" data-reveal="image">
                <img src="images/studio-sterilizzazione.webp" alt="Area di sterilizzazione dello Studio Dentistico Troiano, con il nome dello studio sulla parete" width={738} height={411} loading="lazy" decoding="async" />
              </div>
              <figcaption className="mt-3 text-[0.78rem] text-ink-soft">Area di sterilizzazione · archivio, 2016</figcaption>
            </figure>
            <div className="lg:col-span-4 lg:col-start-9" data-reveal="fade">
              <p className="t-body text-[1.08rem]">
                Ambienti luminosi e ordinati, dove ogni dettaglio, dall'accoglienza alla sterilizzazione degli strumenti, è pensato per farti sentire a tuo agio.
              </p>
              <Link to="/studio" className="mt-6 inline-flex items-center gap-2 font-semibold text-ink">
                <span className="link-underline">Scopri lo studio</span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3 — Filosofia */}
      <section aria-labelledby="philosophy-title" className="bg-mist">
        <div className="wrap grid gap-14 py-24 md:py-36 lg:grid-cols-12 lg:gap-10">
          <figure className="lg:col-span-6">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+40px)]">
              <div className="img-frame aspect-[16/10] rounded-[26px]" data-reveal="image">
                <img src="images/professionista-parete.webp" alt="Il professionista dello studio davanti alla parete con la frase: Un giorno senza un sorriso è un giorno perso" width={1080} height={610} loading="lazy" decoding="async" />
              </div>
              <figcaption className="mt-3 text-[0.78rem] text-ink-soft">La frase che accoglie i pazienti sulla parete dello studio.</figcaption>
            </div>
          </figure>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="t-eyebrow" data-reveal="fade">La nostra filosofia</p>
            <Lines
              as="h2"
              id="philosophy-title"
              className="mt-6 font-serif text-[clamp(2.2rem,1.5rem+3vw,4.3rem)] font-normal italic leading-[1.02] tracking-[-0.02em]"
              lines={['«Un giorno senza', 'un sorriso è un', 'giorno perso.»']}
            />
            <p className="mt-5 text-[0.85rem] text-ink-soft" data-reveal="fade">Frase attribuita a Charlie Chaplin</p>
            <div className="mt-14 grid gap-10" data-reveal="stagger">
              {[
                ['Ascolto', 'Ogni percorso inizia dalle tue domande e dalle tue esigenze, prima ancora che dalla visita.'],
                ['Chiarezza', 'Spieghiamo cosa vediamo e quali sono le alternative, con parole semplici e il tempo giusto per decidere.'],
                ['Cura del dettaglio', "Dagli ambienti alla sterilizzazione degli strumenti, l'attenzione si vede anche in ciò che non si nota."],
              ].map(([t, d]) => (
                <div key={t} className="grid gap-3 border-t border-ink/10 pt-6 sm:grid-cols-[180px_1fr] sm:gap-6">
                  <h3 className="text-[1.15rem] font-semibold tracking-[-0.01em]">{t}</h3>
                  <p className="t-body">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4 — Trattamenti principali */}
      <TreatmentsPreview />

      {/* 5 — Esperienza 3D */}
      <ToothExperience />

      {/* 6 — Il professionista */}
      <section aria-labelledby="pro-title" className="on-dark relative overflow-hidden bg-night text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -left-[20%] top-[10%] h-[60vmax] w-[60vmax] rounded-full blur-3xl" style={{ background: 'radial-gradient(closest-side, rgb(var(--sky) / 0.14), transparent)' }} />
        <div className="wrap relative grid gap-14 py-24 md:py-36 lg:grid-cols-12 lg:items-center">
          <figure className="lg:col-span-5">
            <div className="img-frame aspect-[4/5] rounded-[28px] !bg-night-2" data-reveal="image">
              <img src="images/professionista-ritratto.webp" alt="Ritratto del professionista dello Studio Dentistico Troiano con gli occhiali ingranditori" width={469} height={573} loading="lazy" decoding="async" />
            </div>
          </figure>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="t-eyebrow !text-aqua" data-reveal="fade">Il professionista</p>
            <Lines as="h2" id="pro-title" className="t-display mt-6 !text-[clamp(2.6rem,1.4rem+4.6vw,6rem)]" lines={['La persona', 'dietro ogni', <em key="s" className="accent accent-grad">sorriso.</em>]} />
            <p className="mt-8 max-w-[42ch] text-[1.12rem] leading-relaxed text-white/70" data-reveal="fade">
              Ascoltare, spiegare, accompagnare: tre gesti semplici che tornano in ogni visita, dalla prima all'ultima.
            </p>
            <div className="mt-10" data-reveal="fade">
              <Button to="/professionista" variant="light">Conosci il professionista</Button>
            </div>
          </div>
        </div>
      </section>

      {/* 7 — Gli ambienti */}
      <Gallery />

      {/* 8 — Percorso del paziente */}
      <Journey />

      {/* 9 — Chiamata all'azione */}
      <CtaBand />
    </div>
  )
}

function TreatmentsPreview() {
  const [hover, setHover] = useState<TreatmentId | null>(null)
  const area = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLDivElement>(null)
  const fine = typeof window !== 'undefined' && isFinePointer()

  const onMove = (e: React.MouseEvent) => {
    if (!fine || !area.current || !card.current) return
    const r = area.current.getBoundingClientRect()
    gsap.to(card.current, { x: e.clientX - r.left, y: e.clientY - r.top, duration: 0.8, ease: 'power3.out' })
  }

  return (
    <section aria-labelledby="treat-title" className="bg-paper">
      <div className="wrap py-24 md:py-36">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="t-eyebrow" data-reveal="fade">Trattamenti</p>
            <Lines as="h2" id="treat-title" className="t-h2 mt-5" lines={['Ogni esigenza,', <>un percorso <em className="accent">dedicato.</em></>]} />
          </div>
          <div className="grid gap-4 lg:col-span-4 lg:col-start-9 lg:justify-items-start" data-reveal="fade">
            <p className="t-body">Dalla prevenzione alla sostituzione dei denti mancanti: le principali aree di cura dello studio.</p>
            <span className="ph-tag">Elenco da confermare con lo studio</span>
          </div>
        </div>

        <div ref={area} className="relative mt-14 md:mt-20" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
          <ul className="border-t border-ink/10" data-reveal="stagger">
            {treatments.map((t) => (
              <li key={t.id} className="border-b border-ink/10">
                <Link
                  to={`/trattamenti?t=${t.id}`}
                  onMouseEnter={() => setHover(t.id)}
                  onFocus={() => setHover(t.id)}
                  onBlur={() => setHover(null)}
                  className="group grid grid-cols-[1fr_auto] items-center gap-4 py-7 md:grid-cols-[1.2fr_1fr_auto] md:py-9"
                >
                  <span className="text-[clamp(1.75rem,1.2rem+2.6vw,3.6rem)] font-light leading-none tracking-[-0.035em] transition-transform duration-700 ease-out-expo group-hover:translate-x-3">
                    {t.title}
                  </span>
                  <span className="hidden text-ink-soft md:block">{t.short}</span>
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-ink/15 transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:border-transparent group-hover:bg-night group-hover:text-white">
                    <ArrowUpRight size={18} strokeWidth={1.6} aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {fine ? (
            <div ref={card} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-10 hidden lg:block">
              <div
                className={`-translate-x-1/2 -translate-y-1/2 transition-[opacity,transform] duration-500 ease-out-expo ${hover ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
              >
                <div className="h-[260px] w-[260px] rounded-[28px] border border-ink/5 bg-paper/90 p-4 shadow-[0_30px_80px_-30px_rgb(var(--night)/0.35)] backdrop-blur-xl">
                  {hover ? <TreatmentVisual key={hover} id={hover} className="h-full w-full" animate={false} /> : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
