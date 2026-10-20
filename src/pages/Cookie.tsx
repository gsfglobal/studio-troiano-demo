import { Link } from 'react-router-dom'
import { LegalPage, type LegalSection } from '../components/LegalPage'
import { CookiePreferencesLink } from '../components/CookieBanner'
import { studio } from '../config/site'
import { analyticsConfigured } from '../lib/analytics'

const GA_ID = studio.analytics.ga4Id.trim()

export default function Cookie() {
  const technical = (
    <p>
      Possono essere utilizzati cookie tecnici strettamente necessari al funzionamento e alla sicurezza del servizio di hosting (Cloudflare),
      per i quali non è richiesto il consenso (art. 122 del Codice in materia di protezione dei dati personali e Linee guida del Garante sui
      cookie del 10 giugno 2021).
    </p>
  )
  const cloudflareStats = (
    <p>
      Le statistiche di base sono raccolte anche con Cloudflare Web Analytics, che non usa cookie e fornisce solo dati aggregati e anonimi.
    </p>
  )

  const withAnalytics: LegalSection[] = [
    {
      title: 'Cookie usati da questo sito',
      body: (
        <>
          <p>
            <strong>Cookie tecnici.</strong> Il sito ricorda nel tuo browser la scelta che fai nel banner (accetto o rifiuto), per non
            riproportelo a ogni pagina. Non serve il consenso.
          </p>
          {technical}
          {cloudflareStats}
          <p>
            <strong>Cookie statistici di Google Analytics</strong> (solo con il tuo consenso). Servono a contare le visite e a capire quali pagine
            e quali pulsanti di contatto (telefono, WhatsApp, email, mappa) vengono usati, in forma aggregata. Il servizio è fornito da Google
            Ireland Limited. Il sito non invia a Google il tuo nome, il tuo numero o il testo dei messaggi.
          </p>
          <ul>
            <li>
              <strong>_ga</strong>: distingue i visitatori in modo anonimo. Durata: 13 mesi.
            </li>
            <li>
              <strong>_ga_{GA_ID.replace(/^G-/, '')}</strong>: conserva lo stato della visita. Durata: 13 mesi.
            </li>
          </ul>
          <p>
            Google Analytics è configurato senza segnali Google e senza funzioni pubblicitarie: i dati non sono usati per mostrarti pubblicità
            né incrociati con altri servizi. I dati a livello di singolo visitatore sono conservati da Google per 2 mesi.
          </p>
        </>
      ),
    },
    {
      title: 'Il tuo consenso',
      body: (
        <>
          <p>
            Alla prima visita un banner ti chiede se accetti i cookie statistici. Finché non scegli, e se rifiuti o chiudi il banner con la X,
            Google Analytics non viene caricato e non viene installato nessun cookie diverso da quelli tecnici. La scelta ti viene chiesta di
            nuovo dopo 6 mesi.
          </p>
          <p>
            Puoi cambiare idea in qualsiasi momento:{' '}
            <CookiePreferencesLink className="link-underline font-semibold text-ink" />. Se ritiri il consenso, i cookie di Google Analytics
            vengono cancellati.
          </p>
        </>
      ),
    },
  ]

  const withoutAnalytics: LegalSection[] = [
    {
      title: 'Cookie usati da questo sito',
      body: (
        <>
          <p>
            Questo sito <strong>non utilizza cookie di profilazione né cookie di terze parti</strong> e non installa cookie all'apertura delle
            pagine. Non sono presenti mappe, video, widget social o altri contenuti esterni incorporati (le icone di Facebook, Instagram e
            TikTok sono semplici collegamenti), e i caratteri tipografici sono caricati dal sito stesso.
          </p>
          {technical}
          {cloudflareStats}
        </>
      ),
    },
    {
      title: "Perché non c'è il banner dei cookie",
      body: (
        <p>
          Il banner di consenso serve solo quando un sito usa cookie diversi da quelli tecnici. Se in futuro venissero aggiunti servizi esterni
          che ne fanno uso, questa pagina sarà aggiornata e ti verrà chiesto il consenso prima di attivarli.
        </p>
      ),
    },
  ]

  const sections: LegalSection[] = [
    {
      title: 'Cosa sono i cookie',
      body: (
        <p>
          I cookie sono piccoli file di testo che i siti salvano sul dispositivo di chi li visita. Alcuni sono necessari al funzionamento del
          sito (cookie tecnici), altri servono a misurare le visite (cookie statistici) o a mostrare pubblicità (cookie di profilazione).
        </p>
      ),
    },
    ...(analyticsConfigured ? withAnalytics : withoutAnalytics),
    {
      title: 'Collegamenti ad altri siti',
      body: (
        <p>
          I pulsanti e i collegamenti verso WhatsApp, Facebook, Instagram, TikTok, Google Maps o altri siti aprono servizi esterni, che applicano
          le proprie regole sui cookie: ti invitiamo a consultare le rispettive informative.
          {studio.reviews.enabled &&
            ' Nella sezione delle recensioni Google le foto profilo degli autori sono caricate dai server di Google come semplici immagini, senza cookie.'}
        </p>
      ),
    },
    {
      title: 'Come gestire i cookie',
      body: (
        <p>
          Puoi cancellare o bloccare i cookie anche dalle impostazioni del tuo browser. Per sapere come vengono trattati i dati di navigazione,
          consulta la <Link to="/privacy-policy">privacy policy</Link>. Per domande: <a href={`mailto:${studio.email}`}>{studio.email}</a>.
        </p>
      ),
    },
  ]

  return (
    <LegalPage
      eyebrow="Cookie policy"
      title="Informativa sui cookie"
      intro={
        analyticsConfigured
          ? 'Come questo sito utilizza i cookie: cookie tecnici e, solo con il tuo consenso, cookie statistici di Google Analytics. Nessun cookie pubblicitario.'
          : 'Come questo sito utilizza i cookie: solo cookie tecnici, nessun cookie di profilazione.'
      }
      updated="ottobre 2026"
      sections={sections}
    />
  )
}
