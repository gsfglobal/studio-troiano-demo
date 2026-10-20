/**
 * Google Analytics 4 con consenso preventivo (Linee guida cookie del Garante, 10 giugno 2021).
 *
 * - Nessuna richiesta a Google finché il visitatore non sceglie «Accetta».
 * - Solo statistiche: segnali Google e personalizzazione pubblicitaria spenti,
 *   consenso pubblicitario sempre negato.
 * - Attivo solo sul dominio definitivo; sull'anteprima (GitHub Pages, *.pages.dev) non parte mai.
 * - Eventi di contatto: clic su telefono, WhatsApp, Google Maps, email e social.
 *   Non vengono inviati numeri, testi o altri dati personali.
 */
import { SITE_URL, studio } from '../config/site'

type Gtag = (...args: unknown[]) => void
declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: Gtag
  }
}

export type Choice = 'granted' | 'denied'

const STORAGE_KEY = 'troiano-consenso-statistiche'
/** Il Garante indica di non riproporre il banner prima di 6 mesi: dopo 6 mesi si richiede. */
const CHOICE_MAX_AGE = 182 * 24 * 60 * 60 * 1000
/** Durata dei cookie _ga: 13 mesi invece dei 2 anni predefiniti. */
const COOKIE_EXPIRES = 395 * 24 * 60 * 60
/** Evento con cui il link «Preferenze cookie» del footer riapre il banner. */
export const OPEN_PREFERENCES = 'troiano:preferenze-cookie'

const GA_ID = studio.analytics.ga4Id.trim()

/** true se è stato inserito un ID GA4 valido in site.ts (decide i testi delle policy). */
export const analyticsConfigured = /^G-[A-Z0-9]+$/.test(GA_ID)

/** true solo sul dominio definitivo (con o senza www). Per i test: build con VITE_ANALYTICS_TEST=1. */
export function analyticsActiveHere(): boolean {
  if (!analyticsConfigured || typeof window === 'undefined') return false
  if (import.meta.env.VITE_ANALYTICS_TEST === '1') return true
  const host = new URL(SITE_URL).hostname
  return location.hostname === host || location.hostname === `www.${host}`
}

export function readChoice(): Choice | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const { v, t } = JSON.parse(raw) as { v: Choice; t: number }
    if ((v !== 'granted' && v !== 'denied') || !t || Date.now() - t > CHOICE_MAX_AGE) return null
    return v
  } catch {
    return null
  }
}

function saveChoice(v: Choice) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ v, t: Date.now() }))
  } catch {
    /* navigazione privata o archiviazione bloccata: la scelta vale per questa visita */
  }
}

let loaded = false
let sending = false
let clicksBound = false

function gtag(...args: unknown[]) {
  window.gtag?.(...args)
}

function load() {
  if (loaded) return
  loaded = true
  window.dataLayer = window.dataLayer || []
  window.gtag = function () {
    // gtag.js richiede l'oggetto arguments, non un array
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }
  gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
  gtag('js', new Date())
  gtag('config', GA_ID, {
    send_page_view: false, // le pagine le invia trackPageView, con il titolo giusto
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_expires: COOKIE_EXPIRES,
  })
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`
  document.head.appendChild(s)
}

/** Visualizzazione di pagina (chiamata dal Layout dopo l'aggiornamento del titolo). */
export function trackPageView() {
  if (!sending) return
  gtag('event', 'page_view', {
    page_location: location.origin + location.pathname,
    page_title: document.title,
  })
}

type ContactEvent = { name: string; params?: Record<string, string> }

function classify(href: string): ContactEvent | null {
  if (href.startsWith('tel:')) return { name: 'click_telefono' }
  if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) return { name: 'click_whatsapp' }
  if (href.startsWith('mailto:')) return { name: 'click_email' }
  if (href.startsWith('https://search.google.com/local/writereview')) return { name: 'click_lascia_recensione' }
  if (/^https:\/\/(www\.)?google\.[a-z.]+\/maps|^https:\/\/maps\.(app\.goo\.gl|google\.)/.test(href)) return { name: 'click_maps' }
  const social = href.match(/^https:\/\/(?:www\.)?(facebook|instagram|tiktok)\.com\//)
  if (social) return { name: 'click_social', params: { social: social[1] } }
  return null
}

function onClick(e: MouseEvent) {
  if (!sending) return
  const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
  if (!a) return
  const ev = classify(a.href)
  if (!ev) return
  const posizione = a.closest('header') ? 'menu' : a.closest('footer') ? 'footer' : 'pagina'
  gtag('event', ev.name, { ...ev.params, posizione })
}

/** Attiva GA (solo sul dominio definitivo) e registra la pagina corrente. */
function enable() {
  if (!analyticsActiveHere()) return
  load()
  if (!sending) gtag('consent', 'update', { analytics_storage: 'granted' })
  sending = true
  if (!clicksBound) {
    document.addEventListener('click', onClick, { capture: true })
    clicksBound = true
  }
  trackPageView()
}

/** Ritira il consenso: niente più invii e cancellazione dei cookie _ga già creati. */
function disable() {
  sending = false
  if (loaded) gtag('consent', 'update', { analytics_storage: 'denied' })
  const parts = location.hostname.split('.')
  const domains = ['', ...parts.map((_, i) => '.' + parts.slice(i).join('.')).filter((d) => d.split('.').length > 2)]
  for (const c of document.cookie.split(';')) {
    const name = c.split('=')[0].trim()
    if (!/^_ga(_|$)/.test(name)) continue
    for (const d of domains) document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ''}`
  }
}

/** Applica la scelta salvata all'apertura del sito. */
export function applyStoredChoice() {
  if (readChoice() === 'granted') enable()
}

export function setChoice(v: Choice) {
  saveChoice(v)
  if (v === 'granted') enable()
  else disable()
}
