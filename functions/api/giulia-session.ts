/**
 * Cloudflare Pages Function — GET /api/giulia-session?agent=<id>
 *
 * Restituisce un URL firmato e temporaneo per avviare la conversazione vocale con Giulia.
 * La chiave API non è mai nel codice: si imposta in Cloudflare › Pages › progetto ›
 * Impostazioni › Variabili e segreti, come segreto cifrato:
 *   ELEVENLABS_API_KEY  (segreto)
 *   GIULIA_AGENT_ID     (testo: l'unico agente autorizzato)
 * Finché le variabili non sono impostate risponde 503 e il sito non mostra nulla di rotto
 * (il pulsante compare solo con giulia.enabled = true in src/config/site.ts).
 */
type Env = { ELEVENLABS_API_KEY?: string; GIULIA_AGENT_ID?: string }
type Ctx = { request: Request; env: Env }

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })

export const onRequestGet = async ({ request, env }: Ctx): Promise<Response> => {
  if (!env.ELEVENLABS_API_KEY || !env.GIULIA_AGENT_ID) return json({ error: 'not_configured' }, 503)

  const agent = new URL(request.url).searchParams.get('agent')
  if (agent && agent !== env.GIULIA_AGENT_ID) return json({ error: 'agent_not_allowed' }, 403)

  // Solo richieste dal sito stesso
  const origin = request.headers.get('origin')
  if (origin && new URL(origin).host !== new URL(request.url).host) return json({ error: 'forbidden' }, 403)

  const upstream = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(env.GIULIA_AGENT_ID)}`,
    { headers: { 'xi-api-key': env.ELEVENLABS_API_KEY } },
  )
  if (!upstream.ok) return json({ error: 'upstream_error' }, 502)
  const data = (await upstream.json()) as { signed_url?: string }
  if (!data.signed_url) return json({ error: 'upstream_error' }, 502)
  return json({ signedUrl: data.signed_url })
}
