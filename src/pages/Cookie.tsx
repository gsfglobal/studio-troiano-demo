import { Link } from 'react-router-dom'
import { LegalPage, type LegalSection } from '../components/LegalPage'
import { studio } from '../config/site'

export default function Cookie() {
  const sections: LegalSection[] = [
    {
      title: 'Cosa sono i cookie',
      body: (
        <p>
          I cookie sono piccoli file di testo che i siti salvano sul dispositivo di chi li visita. Alcuni sono necessari al funzionamento del
          sito (cookie tecnici), altri servono a profilare i visitatori o a mostrare pubblicità (cookie di profilazione e di terze parti).
        </p>
      ),
    },
    {
      title: 'Cookie usati da questo sito',
      body: (
        <>
          <p>
            Questo sito <strong>non utilizza cookie di profilazione né cookie di terze parti</strong> e non installa cookie all'apertura delle
            pagine. Non sono presenti mappe, video, widget social o altri contenuti esterni incorporati (l'icona di Facebook è un semplice collegamento), e i caratteri tipografici sono caricati
            dal sito stesso.
          </p>
          <p>
            Possono essere utilizzati solo cookie tecnici strettamente necessari al funzionamento e alla sicurezza del servizio di hosting
            (Cloudflare), per i quali non è richiesto il consenso (art. 122 del Codice in materia di protezione dei dati personali e Linee guida
            del Garante sui cookie del 10 giugno 2021).
          </p>
          <p>
            Le statistiche di visita sono raccolte con Cloudflare Web Analytics, che non usa cookie e fornisce solo dati aggregati e anonimi.
          </p>
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
    {
      title: 'Collegamenti ad altri siti',
      body: (
        <p>
          I pulsanti e i collegamenti verso WhatsApp, Facebook, Google Maps o altri siti aprono servizi esterni, che applicano le proprie regole sui cookie:
          ti invitiamo a consultare le rispettive informative.
        </p>
      ),
    },
    {
      title: 'Come gestire i cookie',
      body: (
        <p>
          Puoi cancellare o bloccare i cookie dalle impostazioni del tuo browser. Per sapere come vengono trattati i dati di navigazione, consulta
          la <Link to="/privacy-policy">privacy policy</Link>. Per domande: <a href={`mailto:${studio.email}`}>{studio.email}</a>.
        </p>
      ),
    },
  ]

  return (
    <LegalPage
      eyebrow="Cookie policy"
      title="Informativa sui cookie"
      intro="Come questo sito utilizza i cookie: solo cookie tecnici, nessun cookie di profilazione."
      updated="ottobre 2026"
      sections={sections}
    />
  )
}
