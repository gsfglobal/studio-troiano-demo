import { useLayoutEffect, useRef } from 'react'
import { Lines } from '../components/Lines'
import { ExpandImage } from '../components/ExpandImage'
import { CtaBand } from '../components/CtaBand'
import { Ph } from '../components/Ph'
import { studio } from '../config/site'
import { gsap } from '../lib/motion'
import { setupReveals } from '../lib/reveal'
import { usePageMeta } from '../lib/usePageMeta'

export default function Professionista() {
  const root = useRef<HTMLDivElement>(null)
  const pro = studio.professional
  usePageMeta('Il professionista · Studio Dentistico Troiano', 'Il professionista dello Studio Dentistico Troiano.')

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => setupReveals(el), el)
    return () => ctx.revert()
  }, [])

  const education = pro.education.length
    ? pro.education.map((e) => ({ label: e, value: e }))
    : [
        { label: 'Laurea', value: '' },
        { label: "Iscrizione all'Albo degli Odontoiatri", value: '' },
        { label: 'Formazione e aggiornamento', value: '' },
      ]

  return (
    <div ref={root}>
      {/* Apertura con ritratto */}
      <section className="pt-header relative overflow-hidden bg-paper">
        <div aria-hidden="true" className="ambient pointer-events-none absolute -left-[25%] top-[10%] h-[60vmax] w-[60vmax] rounded-full blur-3xl" style={{ background: 'radial-gradient(closest-side, rgb(var(--green) / 0.12), transparent)' }} />
        <div className="wrap relative grid gap-12 pb-20 pt-12 md:pt-20 lg:grid-cols-12 lg:items-end lg:pb-28">
          <div className="lg:col-span-6">
            <p className="t-eyebrow flex items-center gap-3" data-reveal="fade">
              <span className="grad-line inline-block w-8" />
              Il professionista
            </p>
            <Lines as="h1" className="t-display mt-7" lines={['La persona', 'dietro ogni', <em key="s" className="accent accent-grad">sorriso.</em>]} />
            <div className="mt-10 grid gap-2 border-t border-ink/10 pt-6" data-reveal="fade">
              <p className="text-[1.35rem] font-medium tracking-[-0.01em]">
                <Ph value={pro.name} label="Nome e cognome" />
              </p>
              <p className="text-ink-soft">
                <Ph value={pro.role} label="Ruolo e titoli" />
              </p>
            </div>
          </div>
          <figure className="lg:col-span-5 lg:col-start-8">
            <div className="img-frame aspect-[4/5] rounded-[30px]" data-reveal="image">
              <img src="images/professionista-ritratto.webp" alt="Ritratto del professionista dello Studio Dentistico Troiano, in polo bianca, con gli occhiali ingranditori" width={469} height={573} decoding="async" />
            </div>
          </figure>
        </div>
      </section>

      {/* Introduzione */}
      <section aria-labelledby="intro-title" className="bg-paper">
        <div className="wrap grid gap-10 py-20 md:py-32 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p className="t-eyebrow" data-reveal="fade">Introduzione</p>
            <div className="mt-4" data-reveal="fade">
              <span className="ph-tag">Testo da personalizzare</span>
            </div>
          </div>
          <div className="lg:col-span-8 lg:col-start-5">
            <Lines
              as="h2"
              id="intro-title"
              className="t-statement"
              lines={['Accoglienza, precisione e rispetto', 'dei tempi di ciascuno: sono i principi', 'che guidano il lavoro di ogni giorno.']}
            />
            <p className="t-lead mt-10 max-w-[58ch]" data-reveal="fade">
              In questo spazio il professionista si presenterà con parole sue: il percorso che lo ha portato a questa professione, ciò che considera importante nel rapporto con i pazienti, il modo in cui organizza lo studio.
            </p>
          </div>
        </div>
      </section>

      {/* Filosofia: la frase sulla parete */}
      <ExpandImage
        src="images/professionista-parete.webp"
        alt="Il professionista davanti alla parete dello studio con la frase: Un giorno senza un sorriso è un giorno perso"
        w={1080}
        h={610}
        maxWidth={1320}
        caption="La parete dello studio"
      />

      <section aria-labelledby="philo-title" className="bg-paper">
        <div className="wrap grid gap-10 pb-24 pt-8 md:pb-32 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p className="t-eyebrow" data-reveal="fade">Filosofia professionale</p>
          </div>
          <div className="lg:col-span-8 lg:col-start-5">
            <Lines as="h2" id="philo-title" className="t-h2" lines={['Una frase sulla parete,', <>un modo di <em className="accent">lavorare.</em></>]} />
            <p className="t-lead mt-8 max-w-[56ch]" data-reveal="fade">
              «Un giorno senza un sorriso è un giorno perso» accoglie chi entra nello studio. È anche un'idea di cura: mettere a proprio agio, spiegare senza fretta, accompagnare ogni persona fino al risultato condiviso.
            </p>
          </div>
        </div>
      </section>

      {/* Approccio al paziente */}
      <section aria-labelledby="approach-title" className="on-dark bg-night text-white">
        <div className="wrap py-24 md:py-36">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="t-eyebrow !text-aqua" data-reveal="fade">Approccio al paziente</p>
              <Lines as="h2" id="approach-title" className="t-h2 mt-5" lines={['Prima, durante', <>e <em className="accent accent-grad">dopo</em> la visita.</>]} />
            </div>
          </div>
          <ol className="mt-16 grid gap-px overflow-hidden rounded-[28px] bg-white/10 md:grid-cols-3" data-reveal="stagger">
            {[
              ['Prima', 'Raccontaci dubbi e aspettative: ogni domanda merita una risposta, anche la più semplice.'],
              ['Durante', 'Ti mostriamo ciò che vediamo e ti spieghiamo ogni passaggio prima di procedere.'],
              ['Dopo', 'Ricevi indicazioni chiare per la cura a casa e per i controlli successivi.'],
            ].map(([t, d], i) => (
              <li key={t} className="bg-night p-8 md:p-10">
                <p className="text-[0.78rem] font-semibold tabular-nums tracking-[0.2em] text-aqua">0{i + 1}</p>
                <h3 className="t-h3 mt-4">{t}</h3>
                <p className="mt-4 leading-relaxed text-white/65">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Formazione: campi modificabili */}
      <section aria-labelledby="edu-title" className="bg-paper">
        <div className="wrap grid gap-10 py-24 md:py-32 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="t-eyebrow" data-reveal="fade">Formazione e titoli</p>
            <Lines as="h2" id="edu-title" className="t-h3 mt-5 !text-[clamp(1.6rem,1.2rem+1.4vw,2.4rem)]" lines={['Percorso professionale']} />
            <p className="t-body mt-5 max-w-[36ch]" data-reveal="fade">
              Solo titoli e informazioni verificati, forniti dal professionista. Nessun dato viene inserito senza conferma.
            </p>
          </div>
          <ul className="border-t border-ink/10 lg:col-span-7 lg:col-start-6" data-reveal="stagger">
            {education.map((e) => (
              <li key={e.label} className="grid gap-2 border-b border-ink/10 py-6 sm:grid-cols-[1fr_auto] sm:items-center">
                <span className="text-[1.1rem]">{e.value ? e.value : e.label}</span>
                {e.value ? null : <span className="ph-tag justify-self-start">da inserire</span>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title={['Conosciamoci', <>di <em className="accent accent-grad">persona.</em></>]} />
    </div>
  )
}
