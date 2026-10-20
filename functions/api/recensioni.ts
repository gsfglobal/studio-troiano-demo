/**
 * Cloudflare Pages Function — GET /api/recensioni
 *
 * Legge da Google (Places API New) la valutazione e le recensioni della scheda Google dello studio.
 * La chiave non è mai nel codice: si imposta in Cloudflare › Pages › progetto ›
 * Impostazioni › Variabili e segreti, come segreto cifrato:
 *   GOOGLE_PLACES_KEY  (segreto — chiave limitata alla sola «Places API (New)»)
 * Finché la chiave non c'è risponde 503 e il sito mostra solo i pulsanti verso Google.
 *
 * Regole di Google rispettate: nessuna memorizzazione dei contenuti (cache-control: no-store),
 * recensioni nell'ordine di Google (pertinenza), autore con foto, nome e link, link all'originale.
 * Costo: ogni richiesta è una «Place Details Enterprise + Atmosphere»; Google ne regala 1.000 al mese.
 * Per non superarle mai c'è un limite giornaliero (DAILY_LIMIT) contato nel KV di Cloudflare
 * RECENSIONI_KV (binding facoltativo, piano gratuito): 30 al giorno = massimo ~930 al mese.
 */
type KV = {
  get(key: string): Promise<string | null>
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>
}
type Env = { GOOGLE_PLACES_KEY?: string; RECENSIONI_KV?: KV }
type Ctx = { request: Request; env: Env }

/** Richieste massime a Google al giorno (fuso orario di Roma). */
const DAILY_LIMIT = 30

const todayRome = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(new Date())

/** true se la richiesta rientra nel limite di oggi (e la conta). Senza KV non limita. */
async function withinDailyLimit(kv?: KV): Promise<boolean> {
  if (!kv) return true
  const key = `richieste:${todayRome()}`
  const used = Number((await kv.get(key)) ?? '0') || 0
  if (used >= DAILY_LIMIT) return false
  await kv.put(key, String(used + 1), { expirationTtl: 3 * 24 * 60 * 60 })
  return true
}

/** ID della scheda Google dello studio (Google permette di conservarlo senza limiti). */
const PLACE_ID = 'ChIJYShCM9ilOxMROKJk1hZhWhM'

type GText = { text?: string; languageCode?: string }
type GReview = {
  rating?: number
  text?: GText
  originalText?: GText
  relativePublishTimeDescription?: string
  publishTime?: string
  googleMapsUri?: string
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string }
}
type GPlace = { rating?: number; userRatingCount?: number; googleMapsUri?: string; reviews?: GReview[] }

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })

const safeUrl = (u?: string) => (u && /^https:\/\//.test(u) ? u : undefined)

export const onRequestGet = async ({ request, env }: Ctx): Promise<Response> => {
  if (!env.GOOGLE_PLACES_KEY) return json({ error: 'not_configured' }, 503)

  // Solo richieste dal sito stesso
  const origin = request.headers.get('origin')
  if (origin && new URL(origin).host !== new URL(request.url).host) return json({ error: 'forbidden' }, 403)

  // Limite giornaliero: oltre, il sito mostra solo i pulsanti verso Google (costo sempre 0 €)
  try {
    if (!(await withinDailyLimit(env.RECENSIONI_KV))) return json({ error: 'quota' }, 503)
  } catch {
    return json({ error: 'quota_check_failed' }, 503)
  }

  let upstream: Response
  try {
    upstream = await fetch(`https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=it&regionCode=IT`, {
      headers: {
        'X-Goog-Api-Key': env.GOOGLE_PLACES_KEY,
        'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews',
      },
    })
  } catch {
    return json({ error: 'upstream_unreachable' }, 502)
  }
  // 429 = quota giornaliera finita: il sito mostra solo i pulsanti, nessun costo extra
  if (!upstream.ok) return json({ error: upstream.status === 429 ? 'quota' : 'upstream_error' }, upstream.status === 429 ? 503 : 502)

  const p = (await upstream.json()) as GPlace
  const reviews = (p.reviews ?? [])
    .filter((r) => r.authorAttribution?.displayName && (r.text?.text || r.originalText?.text))
    .map((r) => ({
      rating: Math.max(0, Math.min(5, Math.round(r.rating ?? 0))),
      text: r.text?.text ?? r.originalText?.text ?? '',
      translated: Boolean(r.text?.languageCode && r.originalText?.languageCode && r.text.languageCode !== r.originalText.languageCode),
      when: r.relativePublishTimeDescription ?? '',
      url: safeUrl(r.googleMapsUri),
      author: {
        name: r.authorAttribution!.displayName!,
        url: safeUrl(r.authorAttribution?.uri),
        photo: safeUrl(r.authorAttribution?.photoUri),
      },
    }))

  return json({
    rating: typeof p.rating === 'number' ? p.rating : null,
    count: typeof p.userRatingCount === 'number' ? p.userRatingCount : null,
    mapsUrl: safeUrl(p.googleMapsUri) ?? null,
    reviews,
  })
}
