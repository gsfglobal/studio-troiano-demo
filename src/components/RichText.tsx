import type { Rich } from '../content/content'

/** Testo con eventuali link esterni (aperti in una nuova scheda). */
export function RichText({ parts }: { parts: Rich }) {
  return (
    <>
      {parts.map((p, i) =>
        typeof p === 'string' ? (
          <span key={i}>{p}</span>
        ) : (
          <a key={i} href={p.href} target="_blank" rel="noopener noreferrer" className="link-underline font-semibold text-ink underline decoration-ink/30 underline-offset-4">
            {p.label}
            <span className="sr-only"> (si apre in una nuova scheda)</span>
          </a>
        ),
      )}
    </>
  )
}
