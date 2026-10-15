import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { OPEN_PREFERENCES, analyticsActiveHere, analyticsConfigured, applyStoredChoice, readChoice, setChoice, type Choice } from '../lib/analytics'

/**
 * Banner dei cookie (solo se Google Analytics è configurato in site.ts).
 * «Accetta» e «Rifiuta» hanno lo stesso peso; la X chiude e mantiene solo i cookie tecnici,
 * come indicato dal Garante. Il link «Preferenze cookie» del footer lo riapre.
 */
export function CookieBanner() {
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!analyticsConfigured) return
    applyStoredChoice()
    if (analyticsActiveHere() && readChoice() === null) setOpen(true)
    const reopen = () => {
      setOpen(true)
      window.setTimeout(() => box.current?.focus(), 30)
    }
    window.addEventListener(OPEN_PREFERENCES, reopen)
    return () => window.removeEventListener(OPEN_PREFERENCES, reopen)
  }, [])

  if (!analyticsConfigured || !open) return null

  const choose = (v: Choice) => {
    setChoice(v)
    setOpen(false)
  }

  return (
    <div
      ref={box}
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-titolo"
      tabIndex={-1}
      className="fixed inset-x-4 bottom-4 z-[75] mx-auto max-w-[560px] rounded-2xl border border-ink/10 bg-paper p-5 text-ink shadow-[0_18px_50px_-18px_rgb(11_22_28/0.45)] outline-none sm:inset-x-auto sm:left-6 sm:right-auto sm:p-6"
    >
      <button
        type="button"
        onClick={() => choose('denied')}
        aria-label="Chiudi: continua solo con i cookie tecnici"
        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-mist hover:text-ink"
      >
        <X size={18} strokeWidth={1.8} />
      </button>
      <h2 id="cookie-titolo" className="pr-10 text-[1.05rem] font-semibold tracking-[-0.01em]">
        Statistiche di visita
      </h2>
      <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-soft">
        Con il tuo consenso usiamo i cookie di Google Analytics per contare le visite e capire quali pagine e pulsanti vengono usati, in forma
        statistica. Nessun cookie pubblicitario. Puoi cambiare idea quando vuoi da «Preferenze cookie», in fondo a ogni pagina.{' '}
        <Link to="/cookie-policy" className="link-underline font-semibold text-ink" onClick={() => setOpen(false)}>
          Cookie policy
        </Link>
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => choose('denied')}
          className="min-h-[46px] rounded-full border border-ink/20 px-5 text-[0.92rem] font-semibold text-ink transition-colors hover:border-ink/40 hover:bg-mist"
        >
          Rifiuta
        </button>
        <button
          type="button"
          onClick={() => choose('granted')}
          className="min-h-[46px] rounded-full bg-night px-5 text-[0.92rem] font-semibold text-white transition-colors hover:bg-night-2"
        >
          Accetta
        </button>
      </div>
    </div>
  )
}

/** Link del footer per riaprire il banner (visibile solo se GA è configurato). */
export function CookiePreferencesLink({ className = '', prefix = '' }: { className?: string; prefix?: string }) {
  if (!analyticsConfigured) return null
  return (
    <>
      {prefix}
      <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_PREFERENCES))} className={className}>
        Preferenze cookie
      </button>
    </>
  )
}
