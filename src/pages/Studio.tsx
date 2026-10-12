import { useCallback, useRef, useState } from 'react'
import { ArrowUpRight, Expand } from 'lucide-react'
import { PageHero } from '../components/PageHero'
import { Lines } from '../components/Lines'
import { Img } from '../components/Img'
import { Lightbox } from '../components/Lightbox'
import { CtaBand } from '../components/CtaBand'
import { LogoTooth } from '../components/LogoTooth'
import { findGallery, gallery } from '../content/content'
import { studio } from '../config/site'
import { gsap } from '../lib/motion'
import { useIsoLayoutEffect } from '../lib/hooks'
import { setupReveals } from '../lib/reveal'

export default function Studio() {
  const root = useRef<HTMLDivElement>(null)
  const [lb, setLb] = useState<number | null>(null)
  const closeLb = useCallback(() => setLb(null), [])

  useIsoLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => setupReveals(el), el)
    return () => ctx.revert()
  }, [])

  const sala = findGallery('studio-sala-operativa')
  const autoclave = findGallery('studio-autoclave')
  const steril = findGallery('studio-sterilizzazione')
  const strum = findGallery('studio-strumentario-chirurgico')
  const ufficio = findGallery('studio-ufficio')

  return (
    <div ref={root}>
      <PageHero
        eyebrow="Lo studio"
        lines={['Uno spazio pensato', <>per sentirsi <em className="accent accent-grad">a proprio agio.</em></>]}
        lead="Ambienti luminosi, ordinati e curati nei dettagli, dall'accoglienza alla sterilizzazione."
      />

      {/* Sala operativa */}
      <section aria-labelledby="room-title" className="bg-paper">
        <div className="wrap grid gap-12 pb-24 md:pb-36 lg:grid-cols-12 lg:items-end">
          <figure className="lg:col-span-6">
            <div className="img-frame aspect-[4/5] rounded-[28px]" data-reveal="image">
              <Img name={sala.image} alt={sala.alt} sizes="(min-width: 1024px) 46vw, 100vw" data-parallax="0.06" />
            </div>
          </figure>
          <div className="lg:col-span-5 lg:col-start-8 lg:pb-6">
            <p className="t-eyebrow" data-reveal="fade">La sala operativa</p>
            <Lines as="h2" id="room-title" className="t-h2 mt-5" lines={['Luce, ordine', <>e <em className="accent">calma.</em></>]} />
            <p className="t-lead mt-7 max-w-[44ch]" data-reveal="fade">
              La sala operativa è luminosa e ordinata: riunito, lampada e strumenti sono disposti perché ogni seduta si svolga con calma. Durante la seduta ti spieghiamo passo per passo cosa si sta facendo.
            </p>
          </div>
        </div>
      </section>

      {/* Sterilizzazione */}
      <section aria-labelledby="steril-title" className="bg-mist">
        <div className="wrap grid gap-14 py-24 md:py-36 lg:grid-cols-12 lg:items-center">
          <div className="relative lg:col-span-6">
            <div className="grid grid-cols-12 items-end gap-4">
              <figure className="col-span-7">
                <div className="img-frame aspect-[3/4] rounded-[24px]" data-reveal="image">
                  <Img name={autoclave.image} alt={autoclave.alt} position="top" sizes="(min-width: 1024px) 28vw, 58vw" />
                </div>
              </figure>
              <figure className="col-span-5 -mb-10 md:-mb-16">
                <div className="img-frame aspect-[4/5] rounded-[20px]" data-reveal="image">
                  <Img name={steril.image} alt={steril.alt} position="30% 50%" sizes="(min-width: 1024px) 20vw, 42vw" />
                </div>
              </figure>
            </div>
            <p className="mt-16 text-[0.78rem] text-ink-soft md:mt-20">Autoclave, imbustatrice e area di sterilizzazione</p>
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
              Per gli interventi di chirurgia e implantologia, lo strumentario viene preparato su un campo sterile, con il kit dedicato all'implantologia e le apparecchiature necessarie a portata di mano.
            </p>
          </div>
          <figure className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7">
            <div className="img-frame mx-auto aspect-[9/14] max-w-[460px] rounded-[28px] !bg-night-2" data-reveal="image">
              <Img name={strum.image} alt={strum.alt} sizes="460px" />
            </div>
            <figcaption className="mx-auto mt-3 max-w-[460px] text-[0.78rem] text-white/55">{strum.title}</figcaption>
          </figure>
        </div>
      </section>

      {/* Accoglienza */}
      <section aria-labelledby="welcome-title" className="bg-mist">
        <div className="wrap grid gap-14 py-24 md:py-36 lg:grid-cols-12 lg:items-center">
          <figure className="lg:col-span-5">
            <div className="img-frame aspect-[4/5] rounded-[26px]" data-reveal="image">
              <Img name={ufficio.image} alt={ufficio.alt} sizes="(min-width: 1024px) 38vw, 100vw" data-parallax="0.08" />
            </div>
            <figcaption className="mt-3 text-[0.78rem] text-ink-soft">{ufficio.title}</figcaption>
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

      {/* Galleria */}
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
              // Ordine: sala operativa, sterilizzazione, strumentario, autoclave, ufficio
              const spans = ['col-span-1 md:col-span-4 md:row-span-2', 'col-span-1 md:col-span-8', 'col-span-1 md:col-span-5', 'col-span-1 md:col-span-3', 'col-span-2 md:col-span-4']
              const aspect = ['aspect-[3/4] md:aspect-auto md:h-full', 'aspect-[3/4] md:aspect-[16/9]', 'aspect-[3/4] md:aspect-[5/4]', 'aspect-[3/4]', 'aspect-[16/11] md:aspect-[4/5]']
              const pos = [undefined, undefined, 'center 72%', 'top', undefined]
              return (
                <button
                  key={it.image}
                  type="button"
                  onClick={() => setLb(i)}
                  className={`group relative overflow-hidden rounded-[22px] text-left ${spans[i]}`}
                  aria-label={`Apri la fotografia: ${it.title}`}
                  data-reveal="fade"
                >
                  <div className={`img-frame ${aspect[i]}`}>
                    <Img name={it.image} alt={it.alt} position={pos[i] ?? it.position} sizes="(min-width: 768px) 40vw, 50vw" className="transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.06]" />
                  </div>
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-night/60 to-transparent p-4 text-white opacity-100 transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                    <span className="text-[0.85rem] font-medium">{it.title}</span>
                    <Expand size={16} aria-hidden="true" />
                  </span>
                </button>
              )
            })}
            <div className="col-span-2 flex flex-col justify-between gap-10 rounded-[22px] bg-mist p-7 md:col-span-8 md:p-10" data-reveal="fade">
              <LogoTooth className="h-20 w-auto self-start" />
              <div>
                <p className="t-h3 max-w-[24ch]">Ti aspettiamo in Via Cardinal Prisco 90, a Boscotrecase.</p>
                <a href={studio.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 font-semibold text-ink">
                  <span className="link-underline">Apri in Google Maps</span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
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
