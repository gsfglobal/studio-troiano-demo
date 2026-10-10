import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { Expand, Rotate3d } from 'lucide-react'
import { PageHero } from '../components/PageHero'
import { Lines } from '../components/Lines'
import { ExpandImage } from '../components/ExpandImage'
import { Lightbox } from '../components/Lightbox'
import { CtaBand } from '../components/CtaBand'
import { ToothMark } from '../components/ToothMark'
import { gallery } from '../content/content'
import { gsap } from '../lib/motion'
import { setupReveals } from '../lib/reveal'
import { usePageMeta } from '../lib/usePageMeta'

export default function Studio() {
  const root = useRef<HTMLDivElement>(null)
  const [lb, setLb] = useState<number | null>(null)
  const closeLb = useCallback(() => setLb(null), [])
  usePageMeta('Lo studio · Studio Dentistico Troiano', 'Gli ambienti dello Studio Dentistico Troiano.')

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => setupReveals(el), el)
    return () => ctx.revert()
  }, [])

  const g = (name: string) => gallery.find((x) => x.src.includes(name))!

  return (
    <div ref={root}>
      <PageHero
        eyebrow="Lo studio"
        lines={['Uno spazio pensato', <>per sentirsi <em className="accent accent-grad">a proprio agio.</em></>]}
        lead="Ambienti luminosi, ordinati e curati nei dettagli, dall'accoglienza alla sterilizzazione."
        aside={<p className="text-[0.82rem] leading-relaxed text-ink-soft">Le fotografie di questa pagina provengono dall'archivio dello studio: gli ambienti attuali potrebbero essere cambiati.</p>}
      />

      <ExpandImage
        src="images/studio-libreria.webp"
        alt="Mensola con libri e cornice del book sharing nella sala d'attesa dello studio"
        w={738}
        h={411}
        maxWidth={1180}
        caption="Book sharing in sala d'attesa · archivio, 2016"
        overlay={
          <p className="max-w-[30ch] text-[clamp(1.3rem,1rem+1.4vw,2.2rem)] font-light leading-tight tracking-[-0.02em]">
            In sala d'attesa, una piccola libreria da condividere: prendi un libro, lasciane un altro.
          </p>
        }
      />

      {/* Sterilizzazione */}
      <section aria-labelledby="steril-title" className="bg-paper">
        <div className="wrap grid gap-14 py-24 md:py-36 lg:grid-cols-12 lg:items-center">
          <div className="relative lg:col-span-6">
            <div className="grid grid-cols-12 items-end gap-4">
              <figure className="col-span-7">
                <div className="img-frame aspect-[3/4] rounded-[24px]" data-reveal="image">
                  <img src={g('autoclave').src} alt={g('autoclave').alt} width={738} height={1032} loading="lazy" decoding="async" data-parallax="0.08" />
                </div>
              </figure>
              <figure className="col-span-5 -mb-10 md:-mb-16">
                <div className="img-frame aspect-[4/5] rounded-[20px]" data-reveal="image">
                  <img src={g('sterilizzazione').src} alt={g('sterilizzazione').alt} width={738} height={411} loading="lazy" decoding="async" className="object-[30%_50%]" />
                </div>
              </figure>
            </div>
            <p className="mt-16 text-[0.78rem] text-ink-soft md:mt-20">Autoclave, imbustatrice e area di sterilizzazione · archivio, 2016</p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="t-eyebrow" data-reveal="fade">Sterilizzazione</p>
            <Lines as="h2" id="steril-title" className="t-h2 mt-5" lines={['Ciò che non si vede,', <>curato come ciò <em className="accent">che si vede.</em></>]} />
            <p className="t-lead mt-7" data-reveal="fade">
              In un'area dedicata, lo strumentario viene imbustato e sterilizzato in autoclave prima di ogni utilizzo.
            </p>
          </div>
        </div>
      </section>

      {/* Chirurgia */}
      <section aria-labelledby="surg-title" className="on-dark relative overflow-hidden bg-night text-white">
        <div className="wrap grid gap-14 py-24 md:py-36 lg:grid-cols-12 lg:items-center">
          <div className="order-2 lg:order-1 lg:col-span-5">
            <p className="t-eyebrow !text-aqua" data-reveal="fade">Chirurgia e implantologia</p>
            <Lines as="h2" id="surg-title" className="t-h2 mt-5" lines={['Strumenti dedicati', <>a ogni <em className="accent accent-grad">procedura.</em></>]} />
            <p className="mt-7 text-[1.1rem] leading-relaxed text-white/70" data-reveal="fade">
              Per gli interventi di chirurgia e implantologia, lo strumentario viene preparato su un campo sterile, come in questa immagine d'archivio.
            </p>
          </div>
          <figure className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7">
            <div className="img-frame mx-auto aspect-[9/14] max-w-[460px] rounded-[28px] !bg-night-2" data-reveal="image">
              <img src={g('strumentario').src} alt={g('strumentario').alt} width={540} height={960} loading="lazy" decoding="async" />
            </div>
            <figcaption className="mx-auto mt-3 max-w-[460px] text-[0.78rem] text-white/50">Strumentario chirurgico · archivio dello studio</figcaption>
          </figure>
        </div>
      </section>

      {/* Accoglienza */}
      <section aria-labelledby="welcome-title" className="bg-mist">
        <div className="wrap grid gap-14 py-24 md:py-36 lg:grid-cols-12 lg:items-center">
          <figure className="lg:col-span-5">
            <div className="img-frame aspect-[4/5] rounded-[26px]" data-reveal="image">
              <img src={g('ufficio').src} alt={g('ufficio').alt} width={738} height={1258} loading="lazy" decoding="async" data-parallax="0.08" />
            </div>
            <figcaption className="mt-3 text-[0.78rem] text-ink-soft">Ufficio e colloqui · archivio dello studio</figcaption>
          </figure>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="t-eyebrow" data-reveal="fade">Accoglienza</p>
            <Lines as="h2" id="welcome-title" className="t-h2 mt-5" lines={['Un luogo per', <>parlare <em className="accent">con calma.</em></>]} />
            <p className="t-lead mt-7 max-w-[44ch]" data-reveal="fade">
              Uno spazio riservato ai colloqui, dove si spiega il piano di cura, si risponde alle domande e si definiscono insieme tempi e costi.
            </p>
          </div>
        </div>
      </section>

      {/* Galleria immersiva */}
      <section aria-labelledby="gal-title" className="bg-paper">
        <div className="wrap py-24 md:py-36">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="t-eyebrow" data-reveal="fade">Galleria</p>
              <Lines as="h2" id="gal-title" className="t-h2 mt-5" lines={['Gli ambienti,', <>da <em className="accent">vicino.</em></>]} />
            </div>
            <p className="t-body lg:col-span-4 lg:col-start-9" data-reveal="fade">Tocca una fotografia per vederla a schermo intero.</p>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-12 md:gap-6">
            {gallery.map((it, i) => {
              const spans = ['col-span-2 md:col-span-7', 'col-span-1 md:col-span-5 md:row-span-2', 'col-span-1 md:col-span-4', 'col-span-2 md:col-span-3', 'col-span-2 md:col-span-8'][i]
              const aspect = ['aspect-[16/10]', 'aspect-[9/14] md:aspect-auto md:h-full', 'aspect-[9/14] md:aspect-[3/4]', 'aspect-[16/11] md:aspect-[9/16]', 'aspect-[16/10] md:aspect-[16/9]'][i]
              return (
                <button
                  key={it.src}
                  type="button"
                  onClick={() => setLb(i)}
                  className={`group relative overflow-hidden rounded-[22px] text-left ${spans}`}
                  aria-label={`Apri la fotografia: ${it.title}`}
                  data-reveal="fade"
                >
                  <div className={`img-frame ${aspect}`}>
                    <img src={it.src} alt={it.alt} width={it.w} height={it.h} loading="lazy" decoding="async" className="transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.06]" />
                  </div>
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-night/60 to-transparent p-4 text-white opacity-100 transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                    <span className="text-[0.85rem] font-medium">{it.title}</span>
                    <Expand size={16} aria-hidden="true" />
                  </span>
                </button>
              )
            })}
            <div className="col-span-2 flex flex-col justify-between gap-8 rounded-[22px] bg-mist p-7 md:col-span-4" data-reveal="fade">
              <ToothMark className="h-16 w-auto self-start" strokeWidth={2} />
              <div>
                <p className="text-[1.15rem] font-medium leading-snug tracking-[-0.01em]">Fotografie d'archivio dello studio.</p>
                <p className="t-body mt-3 text-[0.95rem]">Per la versione definitiva è consigliato un servizio fotografico degli ambienti attuali.</p>
                <span className="ph-tag mt-5">Da programmare</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tour virtuale */}
      <section aria-labelledby="tour-title" className="bg-paper">
        <div className="wrap pb-24 md:pb-36">
          <div className="on-dark relative grid gap-10 overflow-hidden rounded-[32px] bg-night p-8 text-white md:p-14 lg:grid-cols-12 lg:items-center">
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-[420px] w-[420px] rounded-full blur-3xl" style={{ background: 'radial-gradient(closest-side, rgb(var(--aqua) / 0.25), transparent)' }} />
            <div className="relative lg:col-span-7">
              <span className="ph-tag">Funzione predisposta</span>
              <h2 id="tour-title" className="t-h2 mt-6">Tour virtuale a 360°</h2>
              <p className="mt-6 max-w-[48ch] text-[1.05rem] leading-relaxed text-white/70">
                Il sito è pronto per ospitare un tour virtuale degli ambienti attuali, da realizzare con un servizio fotografico dedicato. I pazienti potranno visitare lo studio prima ancora di entrare.
              </p>
            </div>
            <div className="relative lg:col-span-5">
              <div className="relative mx-auto grid aspect-square max-w-[320px] place-items-center rounded-full border border-white/15">
                <div className="absolute inset-6 rounded-full border border-dashed border-white/15 motion-safe:animate-[spin_40s_linear_infinite]" />
                <div className="absolute inset-14 overflow-hidden rounded-full">
                  <img src={g('ufficio').src} alt="" className="h-full w-full object-cover opacity-60" loading="lazy" />
                </div>
                <span className="relative grid h-16 w-16 place-items-center rounded-full bg-white text-night shadow-xl">
                  <Rotate3d size={26} strokeWidth={1.5} aria-hidden="true" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
      <Lightbox items={gallery} index={lb} onClose={closeLb} onIndex={setLb} />
    </div>
  )
}
