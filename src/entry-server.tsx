import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { Layout } from './components/Layout'
import { routerBase } from './lib/base'

export { pages, notFoundMeta } from './config/pages'
export { studio, SITE_URL, fullAddress } from './config/site'
export { BASE } from './lib/base'

/** HTML statico di una pagina, usato da tools/prerender.mjs in fase di build. */
export function render(url: string) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url} basename={routerBase}>
        <Layout />
      </StaticRouter>
    </StrictMode>,
  )
}
