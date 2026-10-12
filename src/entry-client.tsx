import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Layout } from './components/Layout'
import { routerBase } from './lib/base'
// Font caricati dal sito stesso (nessuna richiesta a Google Fonts, nessun cookie)
import '@fontsource-variable/manrope'
import '@fontsource/cormorant-garamond/latin-400-italic.css'
import '@fontsource/cormorant-garamond/latin-500-italic.css'
import '@fontsource/cormorant-garamond/latin-400.css'
import './index.css'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

const el = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter basename={routerBase}>
      <Layout />
    </BrowserRouter>
  </StrictMode>
)

// Le pagine arrivano già pre-renderizzate in HTML: React le "idrata" senza ridisegnarle
if (el.firstElementChild) hydrateRoot(el, app)
else createRoot(el).render(app)
