import { Button } from '../components/Button'
import { usePageMeta } from '../lib/usePageMeta'

export default function NotFound() {
  usePageMeta('Pagina non trovata · Studio Dentistico Troiano')
  return (
    <section className="pt-header">
      <div className="wrap py-32">
        <p className="t-eyebrow">Errore 404</p>
        <h1 className="t-display mt-6">Pagina non trovata.</h1>
        <p className="t-lead mt-6 max-w-[40ch]">L'indirizzo potrebbe essere cambiato. Torna alla home per continuare.</p>
        <div className="mt-10">
          <Button to="/">Torna alla home</Button>
        </div>
      </div>
    </section>
  )
}
