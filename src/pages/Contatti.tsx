import { useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import { Check, Clock, Copy, MapPin, MessageCircle, Phone } from 'lucide-react'
import { PageHero } from '../components/PageHero'
import { Ph } from '../components/Ph'
import { Button } from '../components/Button'
import { studio, whatsappUrl } from '../config/site'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { setupReveals } from '../lib/reveal'
import { usePageMeta } from '../lib/usePageMeta'

type Fields = { nome: string; telefono: string; email: string; tipo: string; fascia: string; messaggio: string; privacy: boolean }
type Errors = Partial<Record<keyof Fields, string>>

const EMPTY: Fields = { nome: '', telefono: '', email: '', tipo: '', fascia: 'Indifferente', messaggio: '', privacy: false }

function validate(f: Fields): Errors {
  const e: Errors = {}
  if (f.nome.trim().length < 2) e.nome = 'Inserisci nome e cognome.'
  const digits = f.telefono.replace(/[^\d]/g, '')
  if (!digits) e.telefono = 'Inserisci un numero di telefono per essere ricontattato.'
  else if (digits.length < 8 || !/^[+\d\s().-]+$/.test(f.telefono)) e.telefono = 'Controlla il numero: usa solo cifre, spazi o il prefisso +39.'
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) e.email = "Controlla l'indirizzo email, oppure lascia il campo vuoto."
  if (!f.tipo) e.tipo = 'Scegli il tipo di richiesta.'
  if (f.messaggio.length > 500) e.messaggio = 'Il messaggio può contenere al massimo 500 caratteri.'
  if (!f.privacy) e.privacy = "Per inviare la richiesta conferma di aver letto l'informativa privacy."
  return e
}

export default function Contatti() {
  const root = useRef<HTMLDivElement>(null)
  usePageMeta('Contatti · Studio Dentistico Troiano', 'Prenota una visita o chiedi informazioni allo Studio Dentistico Troiano.')

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => setupReveals(el), el)
    return () => ctx.revert()
  }, [])

  const wa = whatsappUrl()
  const address = [studio.address.street, studio.address.city].filter(Boolean).join(', ')

  return (
    <div ref={root}>
      <PageHero
        eyebrow="Contatti"
        lines={['Prenota una visita', <>o chiedi <em className="accent accent-grad">informazioni.</em></>]}
        lead="Compila il modulo: la segreteria ti ricontatta per fissare giorno e orario. Puoi anche chiamare o scrivere su WhatsApp."
      />

      <section className="bg-paper">
        <div className="wrap grid gap-12 pb-24 md:pb-36 lg:grid-cols-12">
          {/* Recapiti */}
          <div className="grid content-start gap-4 lg:col-span-5" data-reveal="stagger">
            <ContactCard icon={<Phone size={18} strokeWidth={1.6} />} title="Telefono">
              {studio.phone.display ? <CopyValue value={studio.phone.display} /> : <Ph label="Numero di telefono" />}
            </ContactCard>
            <ContactCard icon={<MessageCircle size={18} strokeWidth={1.6} />} title="WhatsApp">
              {wa ? (
                <a href={wa} target="_blank" rel="noopener noreferrer" className="link-underline font-medium">
                  {studio.whatsapp.display || 'Scrivi su WhatsApp'}
                </a>
              ) : (
                <Ph label="Numero WhatsApp" />
              )}
            </ContactCard>
            <ContactCard icon={<MapPin size={18} strokeWidth={1.6} />} title="Indirizzo">
              {address ? <span>{address}</span> : <Ph label="Via, numero civico e città" />}
            </ContactCard>
            <ContactCard icon={<Clock size={18} strokeWidth={1.6} />} title="Orari">
              <dl className="grid gap-2">
                {studio.hours.map((h) => (
                  <div key={h.days} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <dt className="text-ink-soft">{h.days}</dt>
                    <dd className="tabular-nums">{h.time ? h.time : <Ph label="orario" tag="da definire" />}</dd>
                  </div>
                ))}
              </dl>
            </ContactCard>

            {/* Mappa predisposta */}
            <div className="relative overflow-hidden rounded-[24px] border border-ink/10 bg-mist">
              <svg viewBox="0 0 400 220" className="block h-auto w-full" aria-hidden="true">
                <defs>
                  <pattern id="grid" width="22" height="22" patternUnits="userSpaceOnUse">
                    <path d="M22 0H0V22" fill="none" stroke="rgb(var(--ink) / 0.06)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="400" height="220" fill="url(#grid)" />
                <path d="M-10 160C80 130 120 170 200 140C280 110 320 150 410 120" fill="none" stroke="rgb(var(--ink) / 0.12)" strokeWidth="10" strokeLinecap="round" />
                <path d="M120 -10C130 60 170 90 160 230" fill="none" stroke="rgb(var(--ink) / 0.1)" strokeWidth="7" strokeLinecap="round" />
                <path d="M290 -10C280 70 250 120 300 230" fill="none" stroke="rgb(var(--ink) / 0.08)" strokeWidth="5" strokeLinecap="round" />
                <circle cx="205" cy="108" r="26" fill="rgb(var(--sky) / 0.18)" />
                <circle cx="205" cy="108" r="9" fill="rgb(var(--blue))" stroke="#fff" strokeWidth="3" />
              </svg>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 bg-paper px-5 py-4 text-[0.88rem]">
                <span className="text-ink-soft">Mappa interattiva</span>
                {studio.address.mapsUrl ? (
                  <a href={studio.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="link-underline font-semibold">
                    Apri in Google Maps
                  </a>
                ) : (
                  <span className="ph-tag">Da collegare con l'indirizzo</span>
                )}
              </div>
            </div>
          </div>

          {/* Modulo */}
          <div className="lg:col-span-7" data-reveal="fade">
            <AppointmentForm />
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

function CopyValue({ value }: { value: string }) {
  const [done, setDone] = useState(false)
  return (
    <span className="inline-flex flex-wrap items-center gap-3">
      <span className="select-all font-medium tabular-nums">{value}</span>
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
      >
        {done ? <Check size={13} /> : <Copy size={13} />} {done ? 'Copiato' : 'Copia'}
      </button>
    </span>
  )
}

function AppointmentForm() {
  const [f, setF] = useState<Fields>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({})
  const [sent, setSent] = useState<Fields | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  const set = <K extends keyof Fields>(k: K, v: Fields[K]) => {
    const next = { ...f, [k]: v }
    setF(next)
    if (touched[k]) setErrors(validate(next))
  }
  const blur = (k: keyof Fields) => {
    setTouched((t) => ({ ...t, [k]: true }))
    setErrors(validate(f))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs = validate(f)
    setErrors(errs)
    setTouched({ nome: true, telefono: true, email: true, tipo: true, messaggio: true, privacy: true })
    const firstKey = Object.keys(errs)[0]
    if (firstKey) {
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`)
      el?.focus()
      if (formRef.current && !prefersReducedMotion()) gsap.fromTo(formRef.current, { x: -6 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' })
      return
    }
    // Nessun backend collegato: non simuliamo un invio reale.
    setSent(f)
    requestAnimationFrame(() => {
      successRef.current?.focus()
      if (successRef.current && !prefersReducedMotion()) gsap.from(successRef.current, { autoAlpha: 0, y: 20, duration: 0.8, ease: 'power3.out' })
    })
  }

  const err = (k: keyof Fields) => (touched[k] ? errors[k] : undefined)
  const inputCls = (k: keyof Fields) =>
    `peer w-full rounded-2xl border bg-paper px-4 pb-3 pt-6 text-[1rem] outline-none transition-[border-color,box-shadow] duration-300 focus:border-blue focus:shadow-[0_0_0_4px_rgb(var(--sky)/0.18)] ${
      err(k) ? 'border-[#c2412d]' : 'border-ink/15'
    }`

  if (sent)
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="rounded-[28px] border border-ink/10 bg-mist p-8 outline-none md:p-12">
        <span className="grid h-14 w-14 place-items-center rounded-full text-white" style={{ background: 'var(--grad-brand)' }} aria-hidden="true">
          <Check size={26} />
        </span>
        <h2 className="t-h3 mt-6">Richiesta compilata correttamente</h2>
        <p className="t-body mt-4 max-w-[52ch]">
          Grazie, {sent.nome.split(' ')[0]}. <strong className="font-semibold text-ink">Questa è un'anteprima dimostrativa: i dati non sono stati inviati.</strong> Alla pubblicazione, la richiesta arriverà direttamente allo studio, che ti ricontatterà al numero indicato.
        </p>
        <dl className="mt-8 grid gap-3 border-t border-ink/10 pt-6 text-[0.95rem] sm:grid-cols-2">
          <div>
            <dt className="text-ink-soft">Tipo di richiesta</dt>
            <dd className="font-medium">{sent.tipo}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Fascia oraria preferita</dt>
            <dd className="font-medium">{sent.fascia}</dd>
          </div>
        </dl>
        <div className="mt-10">
          <Button
            variant="ghost"
            onClick={() => {
              setSent(null)
              setF(EMPTY)
              setTouched({})
              setErrors({})
            }}
          >
            Compila una nuova richiesta
          </Button>
        </div>
      </div>
    )

  return (
    <form ref={formRef} noValidate onSubmit={submit} className="rounded-[28px] border border-ink/10 bg-paper p-6 shadow-[0_40px_100px_-60px_rgb(var(--night)/0.35)] md:p-10" aria-describedby="form-note">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="t-h3">Richiedi un appuntamento</h2>
        <span className="ph-tag">Modulo dimostrativo</span>
      </div>
      <p id="form-note" className="mt-3 text-[0.9rem] text-ink-soft">
        I campi con * sono obbligatori. In questa anteprima il modulo non invia dati.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Field id="nome" label="Nome e cognome *" error={err('nome')}>
          <input id="nome" name="nome" autoComplete="name" value={f.nome} onChange={(e) => set('nome', e.target.value)} onBlur={() => blur('nome')} className={inputCls('nome')} placeholder=" " aria-invalid={!!err('nome')} aria-describedby={err('nome') ? 'nome-err' : undefined} />
        </Field>
        <Field id="telefono" label="Telefono *" error={err('telefono')}>
          <input id="telefono" name="telefono" type="tel" inputMode="tel" autoComplete="tel" value={f.telefono} onChange={(e) => set('telefono', e.target.value)} onBlur={() => blur('telefono')} className={inputCls('telefono')} placeholder=" " aria-invalid={!!err('telefono')} aria-describedby={err('telefono') ? 'telefono-err' : undefined} />
        </Field>
        <Field id="email" label="Email (facoltativa)" error={err('email')}>
          <input id="email" name="email" type="email" inputMode="email" autoComplete="email" value={f.email} onChange={(e) => set('email', e.target.value)} onBlur={() => blur('email')} className={inputCls('email')} placeholder=" " aria-invalid={!!err('email')} aria-describedby={err('email') ? 'email-err' : undefined} />
        </Field>
        <Field id="tipo" label="Tipo di richiesta *" error={err('tipo')}>
          <select id="tipo" name="tipo" value={f.tipo} onChange={(e) => set('tipo', e.target.value)} onBlur={() => blur('tipo')} className={`${inputCls('tipo')} appearance-none`} aria-invalid={!!err('tipo')} aria-describedby={err('tipo') ? 'tipo-err' : undefined}>
            <option value="" disabled>
              Seleziona
            </option>
            <option>Prima visita</option>
            <option>Controllo e igiene</option>
            <option>Richiesta di informazioni</option>
            <option>Altro</option>
          </select>
        </Field>
      </div>

      <fieldset className="mt-6">
        <legend className="text-[0.85rem] font-medium text-ink-soft">Fascia oraria preferita</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {['Mattina', 'Pomeriggio', 'Indifferente'].map((o) => (
            <label key={o} className={`cursor-pointer rounded-full border px-4 py-2.5 text-[0.92rem] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue ${f.fascia === o ? 'border-night bg-night text-white' : 'border-ink/15 hover:border-ink/40'}`}>
              <input type="radio" name="fascia" value={o} checked={f.fascia === o} onChange={() => set('fascia', o)} className="sr-only" />
              {o}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        <Field id="messaggio" label="Messaggio (facoltativo)" error={err('messaggio')}>
          <textarea id="messaggio" name="messaggio" rows={4} value={f.messaggio} onChange={(e) => set('messaggio', e.target.value)} onBlur={() => blur('messaggio')} className={`${inputCls('messaggio')} resize-y`} placeholder=" " aria-invalid={!!err('messaggio')} aria-describedby="messaggio-hint" />
        </Field>
        <p id="messaggio-hint" className="mt-2 flex justify-between gap-4 text-[0.8rem] text-ink-soft">
          <span>Per la tua privacy, non inserire dati clinici, referti o fotografie.</span>
          <span className="tabular-nums">{f.messaggio.length}/500</span>
        </p>
      </div>

      <div className="mt-6">
        <label className="flex cursor-pointer items-start gap-3 text-[0.92rem] leading-relaxed">
          <input
            type="checkbox"
            name="privacy"
            checked={f.privacy}
            onChange={(e) => set('privacy', e.target.checked)}
            onBlur={() => blur('privacy')}
            className="mt-1 h-5 w-5 shrink-0 accent-[rgb(var(--blue))]"
            aria-invalid={!!err('privacy')}
            aria-describedby={err('privacy') ? 'privacy-err' : undefined}
          />
          <span>
            Ho letto l'informativa privacy e acconsento a essere ricontattato per questa richiesta. *{' '}
            <span className="ph-tag ml-1">Informativa da collegare</span>
          </span>
        </label>
        {err('privacy') ? (
          <p id="privacy-err" className="mt-2 text-[0.85rem] text-[#b23a26]" role="alert">
            {err('privacy')}
          </p>
        ) : null}
      </div>

      <div className="mt-9 flex flex-wrap items-center gap-4">
        <Button type="submit" variant="primary">
          Invia la richiesta
        </Button>
        <p className="text-[0.82rem] text-ink-soft">Nessun dato viene salvato o inviato in questa anteprima.</p>
      </div>
    </form>
  )
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="relative">
        {children}
        <label htmlFor={id} className="pointer-events-none absolute left-4 top-2 text-[0.74rem] font-medium text-ink-soft">
          {label}
        </label>
      </div>
      {error ? (
        <p id={`${id}-err`} className="mt-2 text-[0.85rem] text-[#b23a26]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
