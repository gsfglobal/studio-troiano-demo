import { useRef, useState } from 'react'
import { Check, Clock, Copy, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { PageHero } from '../components/PageHero'
import { ContactButtons } from '../components/ContactButtons'
import { Button } from '../components/Button'
import { fullAddress, studio, telUrl, whatsappUrl } from '../config/site'
import { gsap } from '../lib/motion'
import { useIsoLayoutEffect } from '../lib/hooks'
import { setupReveals } from '../lib/reveal'

export default function Contatti() {
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
        eyebrow="Contatti"
        lines={['Prenota una visita', <>o chiedi <em className="accent accent-grad">informazioni.</em></>]}
        lead="Chiama lo studio negli orari di apertura o scrivici su WhatsApp: la segreteria ti aiuta a fissare giorno e orario."
      >
        <div className="mt-12" data-reveal="fade">
          <ContactButtons />
        </div>
      </PageHero>

      <section className="bg-paper">
        <div className="wrap grid gap-12 pb-24 md:pb-36 lg:grid-cols-12">
          {/* Recapiti */}
          <div className="grid content-start gap-4 lg:col-span-6" data-reveal="stagger">
            <ContactCard icon={<Phone size={18} strokeWidth={1.6} />} title="Telefono">
              <span className="inline-flex flex-wrap items-center gap-3">
                <a href={telUrl} className="link-underline font-medium tabular-nums">{studio.phone.display}</a>
                <CopyButton value={studio.phone.display} />
              </span>
            </ContactCard>
            <ContactCard icon={<MessageCircle size={18} strokeWidth={1.6} />} title="WhatsApp · solo messaggi">
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="link-underline font-medium tabular-nums">
                {studio.whatsapp.display}
              </a>
            </ContactCard>
            <ContactCard icon={<Mail size={18} strokeWidth={1.6} />} title="Email">
              <a href={`mailto:${studio.email}`} className="link-underline break-all font-medium">{studio.email}</a>
            </ContactCard>
            <ContactCard icon={<Clock size={18} strokeWidth={1.6} />} title="Orari">
              <dl className="grid gap-2">
                {studio.hours.map((h) => (
                  <div key={h.days} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <dt className="text-ink-soft">{h.days}</dt>
                    <dd className="tabular-nums">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </ContactCard>
          </div>

          {/* Dove siamo: nessuna mappa incorporata (niente cookie di terze parti) */}
          <div className="grid content-start gap-6 lg:col-span-6" data-reveal="fade">
            <div className="relative overflow-hidden rounded-[28px] border border-ink/10 bg-mist">
              <svg viewBox="0 0 400 240" className="block h-auto w-full" aria-hidden="true">
                <defs>
                  <pattern id="grid" width="22" height="22" patternUnits="userSpaceOnUse">
                    <path d="M22 0H0V22" fill="none" stroke="rgb(var(--ink) / 0.06)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="400" height="240" fill="url(#grid)" />
                <path d="M-10 170C80 140 120 180 200 150C280 120 320 160 410 130" fill="none" stroke="rgb(var(--ink) / 0.12)" strokeWidth="10" strokeLinecap="round" />
                <path d="M120 -10C130 60 170 90 160 250" fill="none" stroke="rgb(var(--ink) / 0.1)" strokeWidth="7" strokeLinecap="round" />
                <path d="M290 -10C280 70 250 120 300 250" fill="none" stroke="rgb(var(--ink) / 0.08)" strokeWidth="5" strokeLinecap="round" />
                <circle cx="205" cy="118" r="26" fill="rgb(var(--sky) / 0.18)" />
                <circle cx="205" cy="118" r="9" fill="rgb(var(--blue))" stroke="#fff" strokeWidth="3" />
              </svg>
              <div className="grid gap-5 border-t border-ink/10 bg-paper p-6 md:p-8">
                <div className="flex items-start gap-3">
                  <MapPin size={20} strokeWidth={1.6} className="mt-0.5 shrink-0 text-blue-deep" aria-hidden="true" />
                  <div>
                    <h2 className="text-[1.15rem] font-semibold tracking-[-0.01em]">Come raggiungerci</h2>
                    <address className="mt-1 not-italic text-ink-soft">{fullAddress}</address>
                  </div>
                </div>
                <div>
                  <Button href={studio.address.mapsUrl} variant="primary">Apri in Google Maps</Button>
                </div>
              </div>
            </div>
            <p className="rounded-[22px] bg-mist p-6 text-[0.92rem] leading-relaxed text-ink-soft">
              Su WhatsApp ed email scrivi solo ciò che serve per l'appuntamento: per la tua riservatezza non inviare referti, radiografie o informazioni sulla tua salute. Ne parliamo in studio.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function ContactCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[44px_1fr] gap-4 rounded-[22px] border border-ink/10 p-5">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-mist text-blue-deep" aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-ink-soft">{title}</p>
        <div className="mt-1.5 text-[1.02rem]">{children}</div>
      </div>
    </div>
  )
}

function CopyButton({ value }: { value: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1 text-[0.78rem]"
      onClick={() => {
        navigator.clipboard?.writeText(value).then(
          () => {
            setDone(true)
            setTimeout(() => setDone(false), 1800)
          },
          () => undefined,
        )
      }}
      aria-label={done ? 'Numero copiato' : 'Copia il numero di telefono'}
    >
      {done ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />} {done ? 'Copiato' : 'Copia'}
    </button>
  )
}
