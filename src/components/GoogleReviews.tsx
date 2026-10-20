import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, PenLine, Star } from 'lucide-react'
import { Lines } from './Lines'
import { Button } from './Button'
import { asset } from '../lib/base'
import { googleReviewsUrl, studio, writeReviewUrl } from '../config/site'

type Review = {
  rating: number
  text: string
  translated: boolean
  when: string
  url?: string
  author: { name: string; url?: string; photo?: string }
}
type Data = { rating: number | null; count: number | null; mapsUrl: string | null; reviews: Review[] }

const it = new Intl.NumberFormat('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

function Stars({ value, size = 15 }: { value: number; size?: number }) {
  const full = Math.round(value)
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${it.format(value)} stelle su 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} strokeWidth={1.6} aria-hidden="true" className={i <= full ? 'fill-[#F4B400] text-[#F4B400]' : 'fill-transparent text-ink/25'} />
      ))}
    </span>
  )
}

function Author({ a }: { a: Review['author'] }) {
  const img = a.photo ? (
    <img src={a.photo} alt="" width={40} height={40} loading="lazy" referrerPolicy="no-referrer" className="h-10 w-10 shrink-0 rounded-full bg-mist object-cover" />
  ) : (
    <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mist font-semibold text-ink-soft">
      {a.name.charAt(0).toUpperCase()}
    </span>
  )
  const name = <span className="font-semibold text-ink">{a.name}</span>
  return a.url ? (
    <a href={a.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:underline">
      {img}
      {name}
    </a>
  ) : (
    <span className="flex items-center gap-3">
      {img}
      {name}
    </span>
  )
}

/**
 * «Le recensioni su Google»: valutazione e recensioni lette in tempo reale dalla scheda Google
 * dello studio (/api/recensioni). Le recensioni non vengono scelte né modificate dal sito:
 * sono quelle che Google mostra per prime (ordine di pertinenza). Se i dati non arrivano
 * restano i pulsanti verso Google.
 */
export function GoogleReviews() {
  const root = useRef<HTMLElement>(null)
  const [data, setData] = useState<Data | null>(null)

  useEffect(() => {
    if (!studio.reviews.enabled) return
    const el = root.current
    if (!el) return
    let done = false
    const load = () => {
      if (done) return
      done = true
      fetch('/api/recensioni', { cache: 'no-store' })
        .then((r) => (r.ok ? (r.json() as Promise<Data>) : null))
        .then((d) => d && (d.rating !== null || d.reviews.length) && setData(d))
        .catch(() => undefined)
    }
    // La richiesta parte solo quando la sezione sta per entrare nello schermo (meno richieste a Google)
    if (!('IntersectionObserver' in window)) return load()
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && (load(), io.disconnect()), { rootMargin: '400px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (!studio.reviews.enabled) return null
  const allUrl = data?.mapsUrl ?? googleReviewsUrl

  return (
    <section ref={root} aria-labelledby="reviews-title" className="bg-mist">
      <div className="wrap grid gap-12 py-24 md:py-32 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="t-eyebrow" data-reveal="fade">Recensioni</p>
          <Lines as="h2" id="reviews-title" className="t-h2 mt-5" lines={['Le recensioni', <>su <em className="accent">Google.</em></>]} />

          {data?.rating !== null && data?.rating !== undefined && (
            <div className="mt-8 flex items-center gap-4">
              <span className="text-[3.2rem] font-light leading-none tracking-[-0.04em] tabular-nums">{it.format(data.rating)}</span>
              <span className="grid gap-1.5">
                <Stars value={data.rating} size={18} />
                {data.count !== null && <span className="text-[0.9rem] text-ink-soft">{data.count} recensioni su Google</span>}
              </span>
            </div>
          )}

          <p className="t-body mt-6 max-w-[38ch]">
            Hai già fatto una visita da noi? Puoi raccontare la tua esperienza direttamente sulla scheda Google dello studio.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={writeReviewUrl} variant="primary" icon={<PenLine size={16} strokeWidth={1.8} />}>
              Lascia una recensione
            </Button>
            <Button href={allUrl} variant="ghost" icon={<ArrowUpRight size={18} strokeWidth={1.8} />}>
              Tutte le recensioni
            </Button>
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          {data && data.reviews.length > 0 && (
            <>
              <ul className="grid gap-4 md:grid-cols-2">
                {data.reviews.map((r, i) => (
                  <li key={i} className="flex flex-col gap-4 rounded-[22px] border border-ink/[0.07] bg-paper p-6">
                    <div className="flex items-start justify-between gap-3">
                      <Author a={r.author} />
                    </div>
                    <div className="flex items-center gap-3 text-[0.82rem] text-ink-soft">
                      <Stars value={r.rating} />
                      {r.when && <span>{r.when}</span>}
                    </div>
                    <p className="line-clamp-[7] whitespace-pre-line text-[0.95rem] leading-relaxed text-ink-soft">{r.text}</p>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-2 text-[0.8rem] text-ink-soft">
                      {r.translated ? <span>Tradotta da Google</span> : <span />}
                      {r.url && (
                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="link-underline font-semibold text-ink">
                          Leggi su Google Maps
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <p className="max-w-[60ch] text-[0.8rem] leading-relaxed text-ink-soft">
                  Recensioni scritte dagli utenti su Google Maps e mostrate nell'ordine di pertinenza scelto da Google, senza selezione né modifiche da
                  parte dello studio. Le opinioni sono personali e non sostituiscono la valutazione clinica.
                </p>
                <img src={asset('images/google-logo.png')} alt="Google" width={66} height={26} className="h-[22px] w-auto" />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
