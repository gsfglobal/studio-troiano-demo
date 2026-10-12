/** Percorso base del sito: '/' in produzione, una sottocartella per l'anteprima su GitHub Pages. */
export const BASE = import.meta.env.BASE_URL

/** URL di un file in public/ (es. asset('images/logo.webp')). */
export const asset = (p: string) => BASE + p.replace(/^\//, '')

/** true nell'anteprima su GitHub Pages (sottocartella), false sul sito definitivo. */
export const IS_PREVIEW = BASE !== '/'

/** basename per React Router ('' quando il sito è alla radice). */
export const routerBase = BASE === '/' ? undefined : BASE.replace(/\/$/, '')
