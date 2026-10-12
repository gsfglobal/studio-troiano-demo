import { useRef, useState } from 'react'
import { AudioLines, Loader2, PhoneOff } from 'lucide-react'
import { studio } from '../config/site'

type State = 'idle' | 'connecting' | 'active' | 'error'
type Session = { endSession: () => Promise<void> }

/**
 * "Parla con Giulia" — assistente vocale AI dello studio, spenta al lancio.
 * Con giulia.enabled = false non viene mostrato nulla.
 * Lo script vocale si carica solo al clic (nessun cookie o script esterno all'apertura);
 * la sessione si apre tramite la Cloudflare Pages Function /api/giulia-session, che genera
 * un URL firmato: la chiave API sta solo nelle variabili d'ambiente protette di Cloudflare.
 */
export function GiuliaButton({ dark = false }: { dark?: boolean }) {
  const [state, setState] = useState<State>('idle')
  const session = useRef<Session | null>(null)
  const { enabled, voiceAgentId } = studio.giulia
  if (!enabled || !voiceAgentId) return null

  const start = async () => {
    if (state === 'active') {
      await session.current?.endSession()
      session.current = null
      setState('idle')
      return
    }
    setState('connecting')
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      const res = await fetch(`/api/giulia-session?agent=${encodeURIComponent(voiceAgentId)}`, { cache: 'no-store' })
      if (!res.ok) throw new Error(`session ${res.status}`)
      const { signedUrl } = (await res.json()) as { signedUrl: string }
      const { VoiceConversation } = await import('@elevenlabs/client')
      session.current = await VoiceConversation.startSession({
        signedUrl,
        connectionType: 'websocket',
        onConnect: () => setState('active'),
        onDisconnect: () => {
          session.current = null
          setState('idle')
        },
        onError: () => setState('error'),
      })
    } catch {
      setState('error')
    }
  }

  const label = state === 'active' ? 'Termina la conversazione' : state === 'connecting' ? 'Collegamento…' : 'Parla con Giulia'
  const icon = state === 'connecting' ? <Loader2 size={17} className="animate-spin" /> : state === 'active' ? <PhoneOff size={17} /> : <AudioLines size={17} />

  return (
    <div className="grid gap-2">
      <button type="button" onClick={start} disabled={state === 'connecting'} className={`btn ${dark ? 'btn-outline-light' : 'btn-ghost'}`} aria-live="polite">
        <span>{label}</span>
        <span className="btn-icon" aria-hidden="true">
          {icon}
        </span>
      </button>
      <p className={`max-w-[34ch] text-[0.78rem] leading-snug ${dark ? 'text-white/60' : 'text-ink-soft'}`}>
        {state === 'error'
          ? 'Non è stato possibile avviare la conversazione: chiama lo studio o scrivici su WhatsApp.'
          : "Giulia è l'assistente virtuale dello studio, basata su intelligenza artificiale. Si attiva il microfono solo dopo il clic."}
      </p>
    </div>
  )
}
