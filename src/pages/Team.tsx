import { useRef } from 'react'
import { PageHero } from '../components/PageHero'
import { Lines } from '../components/Lines'
import { Img } from '../components/Img'
import { ExpandImage } from '../components/ExpandImage'
import { CtaBand } from '../components/CtaBand'
import { director, team, type ImageName } from '../content/content'
import { gsap } from '../lib/motion'
import { useIsoLayoutEffect } from '../lib/hooks'
import { setupReveals } from '../lib/reveal'

export default function Team() {
  const root = useRef<HTMLDivElement>(null)

  useIsoLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => setupReveals(el), el)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root}>
      <PageHero
        eyebrow="Team"
        lines={['Le persone', <>dello <em className="accent accent-grad">studio.</em></>]}
        lead="Chi ti accoglie, chi ti segue durante le cure e chi organizza i tuoi appuntamenti."
      />

      {/* Titolare e direttore sanitario */}
      <ExpandImage
        name={director.photo}
        alt={director.alt}
        maxWidth={1320}
        mobilePosition="75% center"
        caption="La parete dello studio, con la frase attribuita a Charlie Chaplin"
      />

      <section aria-labelledby="director-title" className="bg-paper">
        <div className="wrap grid gap-10 pb-24 pt-8 md:pb-32 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="t-eyebrow" data-reveal="fade">{director.role}</p>
            <Lines as="h2" id="director-title" className="t-h2 mt-5" lines={['Dott. Amedeo', 'Troiano']} />
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <p className="t-lead max-w-[56ch]" data-reveal="fade">
              «Un giorno senza un sorriso è un giorno perso» accoglie chi entra nello studio. È anche un'idea di cura: mettere a proprio agio, spiegare senza fretta, accompagnare ogni persona nelle scelte che riguardano la sua salute.
            </p>
            <h3 className="t-eyebrow mt-12 !text-ink-soft" data-reveal="fade">Formazione e titoli</h3>
            <ul className="mt-5 border-t border-ink/10" data-reveal="stagger">
              {director.bio.map((b) => (
                <li key={b} className="border-b border-ink/10 py-5 text-[1.08rem]">
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Le altre persone del team: compaiono solo con nome e foto */}
      {team.length ? (
        <section aria-labelledby="team-title" className="bg-mist">
          <div className="wrap py-24 md:py-32">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <p className="t-eyebrow" data-reveal="fade">Con il Dott. Troiano</p>
                <Lines as="h2" id="team-title" className="t-h2 mt-5" lines={['Un lavoro', <>di <em className="accent">squadra.</em></>]} />
              </div>
            </div>
            <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8" data-reveal="stagger">
              {team.map((m) => (
                <li key={m.id}>
                  <article aria-labelledby={`m-${m.id}`}>
                    <div className="img-frame aspect-[4/5] rounded-[26px] !bg-paper">
                      <Img name={m.photo as ImageName} alt={m.alt} position={m.objectPosition} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw" />
                    </div>
                    <p className="mt-6 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-blue-deep">{m.role}</p>
                    <h3 id={`m-${m.id}`} className="t-h3 mt-2">{m.name}</h3>
                    {m.text ? <p className="t-body mt-3 max-w-[40ch]">{m.text}</p> : null}
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Approccio al paziente */}
      <section aria-labelledby="approach-title" className="on-dark bg-night text-white">
        <div className="wrap py-24 md:py-36">
          <p className="t-eyebrow !text-aqua" data-reveal="fade">Approccio al paziente</p>
          <Lines as="h2" id="approach-title" className="t-h2 mt-5" lines={['Prima, durante', <>e <em className="accent accent-grad">dopo</em> la visita.</>]} />
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

      <CtaBand title={['Conosciamoci', <>di <em className="accent accent-grad">persona.</em></>]} />
    </div>
  )
}
