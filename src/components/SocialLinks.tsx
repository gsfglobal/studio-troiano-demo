import type { ReactNode } from 'react'
import { studio } from '../config/site'

/** Icone disegnate in proprio: nessuno script o widget dei social, solo collegamenti. */
const FacebookGlyph = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z" />
  </svg>
)
const TikTokGlyph = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" fill="currentColor">
    <path d="M16.6 2h-3.3v13.4a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.2a6.3 6.3 0 1 0 5.3 6.2V8.6a7.6 7.6 0 0 0 4.4 1.4V6.7a4.3 4.3 0 0 1-4.4-4.2V2z" />
  </svg>
)

const items: { key: keyof typeof studio.social; label: string; icon: ReactNode }[] = [
  { key: 'facebook', label: 'Facebook', icon: <FacebookGlyph /> },
  { key: 'tiktok', label: 'TikTok', icon: <TikTokGlyph /> },
]

/** Profili social nel footer. Senza indirizzo, l'icona resta visibile ma non cliccabile. */
export function SocialLinks() {
  const cls = 'grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white/85 transition-colors'
  return (
    <ul className="mt-8 flex gap-3" aria-label="Profili social dello studio">
      {items.map(({ key, label, icon }) => {
        const url = studio.social[key]
        return (
          <li key={key}>
            {url ? (
              <a href={url} target="_blank" rel="noopener noreferrer" className={`${cls} hover:border-white/60 hover:text-white`} aria-label={`${label} dello studio (si apre in una nuova scheda)`}>
                {icon}
              </a>
            ) : (
              <span className={cls} title={label}>
                {icon}
                <span className="sr-only">{label} dello studio</span>
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
