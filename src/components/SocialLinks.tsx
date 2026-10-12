import { studio } from '../config/site'

/** Icona "f" disegnata in proprio (nessuno script o widget di Facebook: solo un collegamento). */
function FacebookGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z" />
    </svg>
  )
}

/** Collegamenti ai profili social nel footer. Finché l'indirizzo non è inserito, l'icona resta visibile ma non cliccabile. */
export function SocialLinks() {
  const url = studio.social.facebook
  const cls = 'grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white/85 transition-colors'
  return (
    <div className="mt-8 flex gap-3">
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className={`${cls} hover:border-white/60 hover:text-white`} aria-label="Pagina Facebook dello studio (si apre in una nuova scheda)">
          <FacebookGlyph />
        </a>
      ) : (
        <span className={cls} title="Pagina Facebook">
          <FacebookGlyph />
          <span className="sr-only">Pagina Facebook dello studio</span>
        </span>
      )}
    </div>
  )
}
