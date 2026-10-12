import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { Layout } from './components/Layout'

export { pages, notFoundMeta } from './config/pages'
export { studio, SITE_URL, fullAddress } from './config/site'

/** HTML statico di una pagina, usato da tools/prerender.mjs in fase di build. */
export function render(url: string) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <Layout />
      </StaticRouter>
    </StrictMode>,
  )
}
