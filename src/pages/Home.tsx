import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react'
import { Button } from '../components/Button'
import { ContactButtons } from '../components/ContactButtons'
import { Lines } from '../components/Lines'
import { Img } from '../components/Img'
import { HeroTooth } from '../components/HeroTooth'
import { Gallery } from '../components/Gallery'
import { Journey } from '../components/Journey'
import { CtaBand } from '../components/CtaBand'
import { TreatmentVisual } from '../components/TreatmentVisual'
import { director, findGallery, team, technologies, treatments, type TreatmentId } from '../content/content'
import { studio } from '../config/site'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { useFinePointer, useIsoLayoutEffect } from '../lib/hooks'
import { setupReveals } from '../lib/reveal'

export default function Home() {
  const root = useRef<HTMLDivElement>(null)

  useIsoLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      setupReveals(el)
      if (prefersReducedMotion()) return
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
  const sala = findGallery('studio-sala-operativa')
  const steril = findGallery('studio-sterilizzazione')

  return (
    <div ref={root}>
      {/* 1 — Apertura (animazioni CSS: partono appena la pagina è disegnata) */}
      <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-paper">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="ambient absolute -right-[12%] top-[2%] h-[62vmax] w-[62vmax] rounded-full blur-3xl" style={{ background: 'radial-gradient(closest-side, rgb(var(--sky) / 0.16), transparent)' }} />
          <div className="ambient absolute -left-[18%] bottom-[-20%] h-[50vmax] w-[50vmax] rounded-full blur-3xl [animation-delay:-6s]" style={{ background: 'radial-gradient(closest-side, rgb(var(--green) / 0.12), transparent)' }} />
        </div>
        <div className="wrap pt-header grid min-h-[100svh] grid-rows-[auto_1fr] gap-2 pb-16 lg:grid-cols-12 lg:grid-rows-1 lg:items-center lg:gap-8 lg:pb-10">
          {/* Il tratto del logo disegna il dente, poi il dente si costruisce in 3D */}
          <div className="relative order-1 h-[34svh] min-h-[220px] md:h-[42svh] lg:order-2 lg:col-span-6 lg:h-[80svh]">
            <HeroTooth />
          </div>
          <div className="relative z-10 order-2 lg:order-1 lg:col-span-6">
            <p className="t-eyebrow in-fade flex items-center gap-3" style={{ '--d': '150ms' } as React.CSSProperties}>
              <span className="grad-line inline-block w-8" />
              Dentista a Boscotrecase (NA)
            </p>
            {/* Nome dello studio + frase (come nella prima versione); la località resta nella riga sopra e nel title per Google */}
            <h1 id="hero-title" className="in-lines mt-6">
              <span className="line-mask text-[clamp(1.35rem,1.05rem+1.1vw,2.1rem)] font-normal leading-tight tracking-[-0.02em] text-ink-soft">
                <span>Studio Dentistico Troiano</span>
              </span>
              {/* dimensione sul contenitore della riga: il margine della maschera segue il carattere e non taglia le lettere */}
              <span className="line-mask t-display mt-3 md:mt-4"><span>Ogni sorriso</span></span>
              <span className="line-mask t-display"><span>racconta una</span></span>
              <span className="line-mask t-display"><span><em className="accent accent-grad">storia.</em></span></span>
            </h1>
            <p className="t-lead in-fade mt-7 max-w-[42ch]" style={{ '--d': '500ms' } as React.CSSProperties}>
              Cure odontoiatriche per adulti e bambini: prevenzione e igiene, parodontologia, implantologia, ortodonzia linguale, endodonzia e protesi.
            </p>
            <div className="in-fade mt-9" style={{ '--d': '650ms' } as React.CSSProperties}>
              <ContactButtons />
              <p className="mt-6 flex items-start gap-2 text-[0.88rem] leading-relaxed text-ink-soft">
                <MapPin size={16} strokeWidth={1.7} className="mt-0.5 shrink-0 text-blue-deep" aria-hidden="true" />
                <span>
                  {studio.address.street}, {studio.address.city} ·{' '}
                  <a href={studio.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="link-underline font-semibold text-ink">
                    Apri in Google Maps
                  </a>
                </span>
              </p>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block">
          <div className="in-fade flex flex-col items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-ink-soft" style={{ '--d': '1400ms' } as React.CSSProperties}>
            Scorri
            <span className="relative h-10 w-px overflow-hidden bg-ink/10">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[cue_2.2s_ease-in-out_infinite]" style={{ background: 'var(--grad-brand)' }} />
            </span>
          </div>
        </div>
      </section>

      {/* 2 — Lo studio */}
      <section aria-label="Lo studio" className="bg-paper">
        <div className="wrap py-24 md:py-36">
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
                <Img name={steril.image} alt={steril.alt} sizes="(min-width: 1024px) 58vw, 100vw" />
              </div>
              <figcaption className="mt-3 text-[0.78rem] text-ink-soft">{steril.title}</figcaption>
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
          <figure className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+40px)]">
              <div className="img-frame mx-auto aspect-[4/5] max-w-[520px] rounded-[26px]" data-reveal="image">
                <Img name={sala.image} alt={sala.alt} sizes="(min-width: 1024px) 36vw, 100vw" />
              </div>
              <figcaption className="mx-auto mt-3 max-w-[520px] text-[0.78rem] text-ink-soft">{sala.title}</figcaption>
            </div>
          </figure>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="t-eyebrow" data-reveal="fade">La nostra filosofia</p>
            <Lines
              as="h2"
              id="philosophy-title"
              className="mt-6 font-serif text-[clamp(2.2rem,1.5rem+3vw,4.3rem)] font-normal italic leading-[1.02] tracking-[-0.02em]"
              lines={['«Un giorno senza', 'un sorriso è un', 'giorno perso.»']}
            />
            <p className="mt-5 text-[0.85rem] text-ink-soft" data-reveal="fade">Frase attribuita a Charlie Chaplin, sulla parete dello studio</p>
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

      {/* 4 — Tecnologie */}
      <section aria-labelledby="tech-title" className="bg-paper">
        <div className="wrap py-24 md:py-36">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="t-eyebrow" data-reveal="fade">Tecnologie</p>
              <Lines as="h2" id="tech-title" className="t-h2 mt-5" lines={['Strumenti digitali', <>al servizio <em className="accent">della cura.</em></>]} />
            </div>
            <div className="grid gap-5 lg:col-span-4 lg:col-start-9" data-reveal="fade">
              <p className="t-body">Dall'impronta digitale alla chirurgia implantare guidata: le tecnologie che lo studio utilizza nei trattamenti.</p>
              <Link to="/tecnologie" className="inline-flex items-center gap-2 font-semibold text-ink">
                <span className="link-underline">Scopri le tecnologie</span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 md:mt-20 lg:grid-cols-4 lg:gap-6" data-reveal="stagger">
            {technologies.map((t) => (
              <li key={t.id}>
                <Link to={`/tecnologie#${t.id}`} className="group block">
                  <div className={`img-frame aspect-square rounded-[24px] ${t.tone === 'dark' ? '!bg-black' : '!bg-white ring-1 ring-inset ring-ink/10'}`}>
                    <Img name={t.image} alt={t.alt} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 46vw, 100vw" className="!object-contain p-3 transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.05]" />
                  </div>
                  <p className="mt-5 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-blue-deep">{t.short}</p>
                  <h3 className="mt-2 flex items-start justify-between gap-4 text-[1.3rem] font-normal leading-tight tracking-[-0.02em]">
                    {t.title}
                    <ArrowUpRight size={18} strokeWidth={1.6} className="mt-1 shrink-0 transition-transform duration-500 group-hover:rotate-45" aria-hidden="true" />
                  </h3>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5 — Il professionista */}
      <section aria-labelledby="pro-title" className="on-dark relative overflow-hidden bg-night text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -left-[20%] top-[10%] h-[60vmax] w-[60vmax] rounded-full blur-3xl" style={{ background: 'radial-gradient(closest-side, rgb(var(--sky) / 0.14), transparent)' }} />
        <div className="wrap relative grid gap-14 py-24 md:py-36 lg:grid-cols-12 lg:items-center">
          <figure className="lg:col-span-5">
            <div className="img-frame mx-auto aspect-[4/5] max-w-[520px] rounded-[28px] !bg-night-2" data-reveal="image">
              <Img name={director.photo} alt={director.alt} position="88% center" sizes="(min-width: 1024px) 36vw, 100vw" />
            </div>
          </figure>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="t-eyebrow !text-aqua" data-reveal="fade">Il professionista</p>
            <Lines as="h2" id="pro-title" className="t-display mt-6 !text-[clamp(2.6rem,1.4rem+4.6vw,6rem)]" lines={['La persona', 'dietro ogni', <em key="s" className="accent accent-grad">sorriso.</em>]} />
            <div className="mt-10 border-t border-white/10 pt-6" data-reveal="fade">
              <p className="text-[1.35rem] font-medium tracking-[-0.01em]">{director.name}</p>
              <p className="mt-1 text-white/60">{director.role}</p>
              <ul className="mt-6 grid gap-2.5 text-[0.98rem] text-white/75">
                {director.bio.slice(1, 4).map((b) => (
                  <li key={b} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: 'var(--grad-brand)' }} />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            {team.length ? (
              <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-5" data-reveal="fade" aria-label="Con il Dott. Troiano">
                {team.map((m) => (
                  <li key={m.id} className="flex items-center gap-3">
                    <span className="img-frame block h-12 w-12 shrink-0 rounded-full !bg-night-2">
                      <Img name={m.photo as never} alt="" position={m.objectPosition} sizes="48px" />
                    </span>
                    <span className="text-[0.92rem] leading-tight">
                      <span className="block font-medium">{m.name}</span>
                      <span className="text-white/55">{m.role}</span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-10" data-reveal="fade">
              <Button to="/team" variant="light">Conosci il team</Button>
            </div>
          </div>
        </div>
      </section>

      {/* 6 — Trattamenti */}
      <TreatmentsPreview />

      {/* 7 — Gli ambienti */}
      <Gallery />

      {/* 8 — Percorso del paziente */}
      <Journey />

      {/* 9 — Contatti */}
      <CtaBand />
    </div>
  )
}

function TreatmentsPreview() {
  const [hover, setHover] = useState<TreatmentId | null>(null)
  const area = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLDivElement>(null)
  const fine = useFinePointer()

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
          <div className="lg:col-span-4 lg:col-start-9" data-reveal="fade">
            <p className="t-body">Dalla prevenzione alla sostituzione dei denti mancanti: le aree di cura dello studio, per adulti e bambini.</p>
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
                  className="group grid grid-cols-[1fr_auto] items-center gap-4 py-6 md:grid-cols-[1.2fr_1fr_auto] md:py-8"
                >
                  <span className="text-[clamp(1.6rem,1.15rem+2.3vw,3.3rem)] font-light leading-[1.05] tracking-[-0.035em] transition-transform duration-700 ease-out-expo group-hover:translate-x-3">
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
