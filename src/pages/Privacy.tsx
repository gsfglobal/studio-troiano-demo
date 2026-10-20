import { Link } from 'react-router-dom'
import { LegalPage, type LegalSection } from '../components/LegalPage'
import { fullAddress, studio } from '../config/site'
import { analyticsConfigured } from '../lib/analytics'
import { CookiePreferencesLink } from '../components/CookieBanner'

export default function Privacy() {
  const sections: LegalSection[] = [
    {
      title: 'Titolare del trattamento',
      body: (
        <>
          <p>
            {studio.legal.healthDirector} – {studio.name}, {fullAddress}, P.IVA {studio.legal.vat}.
          </p>
          <p>
            Per qualsiasi richiesta sulla privacy puoi scrivere a <a href={`mailto:${studio.email}`}>{studio.email}</a> o chiamare il numero{' '}
            <a href={`tel:${studio.phone.tel}`}>{studio.phone.display}</a>.
          </p>
        </>
      ),
    },
    {
      title: 'Quali dati raccoglie questo sito',
      body: (
        <>
          <p>
            Il sito non contiene moduli, non richiede registrazioni e non raccoglie dati inseriti dai visitatori. Non utilizza cookie di
            profilazione né strumenti di tracciamento pubblicitario.
          </p>
          <p>
            <strong>Dati di navigazione.</strong> Nel normale funzionamento, i sistemi del fornitore di hosting acquisiscono alcuni dati tecnici
            la cui trasmissione è implicita nell'uso di internet (ad esempio indirizzo IP, tipo di browser, data e ora della richiesta, pagina
            visitata). Servono a far funzionare il sito e a proteggerlo da abusi e attacchi, non a identificare i visitatori. Il sito è ospitato
            da Cloudflare, Inc., che tratta questi dati come responsabile del trattamento.
          </p>
          <p>
            <strong>Statistiche.</strong> Il sito utilizza Cloudflare Web Analytics, un servizio di statistiche che non usa cookie, non crea
            profili e fornisce solo dati aggregati e anonimi (ad esempio il numero di visite e le pagine più consultate).
          </p>
          {studio.reviews.enabled && (
            <p>
              <strong>Recensioni Google.</strong> In home page il sito mostra la valutazione e alcune recensioni pubblicate dagli utenti sulla
              scheda Google dello studio, lette in tempo reale da Google senza essere conservate dal sito. Le foto profilo degli autori vengono
              caricate dai server di Google (googleusercontent.com), che ricevono il tuo indirizzo IP come per qualsiasi immagine; non vengono
              installati cookie. I pulsanti «Lascia una recensione» e «Tutte le recensioni» aprono Google, con la sua{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                informativa privacy
              </a>
              .
            </p>
          )}
          {analyticsConfigured && (
            <p>
              <strong>Google Analytics (solo con il tuo consenso).</strong> Se accetti i cookie statistici nel banner, il sito usa Google
              Analytics 4 di Google Ireland Limited per misurare le visite e i clic sui pulsanti di contatto (telefono, WhatsApp, email,
              mappa). Google riceve dati tecnici sulla navigazione (pagine viste, tipo di dispositivo, città approssimativa, identificativo
              casuale del cookie) ma non il tuo nome, il tuo numero o il testo dei messaggi; nell'Unione europea l'indirizzo IP non viene
              memorizzato. Segnali Google e funzioni pubblicitarie sono disattivati. Le statistiche sono gestite per conto dello studio da{' '}
              {studio.agency.name}, che opera come responsabile del trattamento. Puoi ritirare il consenso in qualsiasi momento da{' '}
              <CookiePreferencesLink className="link-underline font-semibold text-ink" />.
            </p>
          )}
        </>
      ),
    },
    {
      title: 'Se contatti lo studio',
      body: (
        <>
          <p>
            Se scegli di contattare lo studio con i pulsanti del sito (telefono, WhatsApp o email), i dati che comunichi, come il numero di
            telefono, il nome e il testo del messaggio, sono trattati dallo studio solo per rispondere alla tua richiesta e organizzare
            l'eventuale appuntamento.
          </p>
          <p>
            Il pulsante WhatsApp apre un servizio di WhatsApp Ireland Limited (gruppo Meta), che tratta i dati secondo la propria{' '}
            <a href="https://www.whatsapp.com/legal/privacy-policy-eea" target="_blank" rel="noopener noreferrer">
              informativa privacy
            </a>
            . Le icone di Facebook, Instagram e TikTok aprono i profili dello studio su servizi di Meta Platforms Ireland Limited e di TikTok Technology Limited, ciascuno con la propria informativa privacy (
            <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            ,{' '}
            <a href="https://privacycenter.instagram.com/policy" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            ,{' '}
            <a href="https://www.tiktok.com/legal/page/eea/privacy-policy/it" target="_blank" rel="noopener noreferrer">
              TikTok
            </a>
            ). Il collegamento «Apri in Google Maps» apre un servizio di Google, con la propria{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              informativa privacy
            </a>
            .
          </p>
          <p>Per la tua riservatezza, ti chiediamo di non inviare su WhatsApp o per email referti, radiografie o informazioni sulla tua salute.</p>
        </>
      ),
    },
    ...(studio.giulia.enabled
      ? [
          {
            title: 'Assistente virtuale Giulia',
            body: (
              <p>
                Giulia è un'assistente virtuale basata su intelligenza artificiale, che risponde a domande organizzative (orari, appuntamenti,
                informazioni sullo studio) e non fornisce diagnosi. La conversazione vocale si avvia solo dopo il clic su «Parla con Giulia» e
                l'autorizzazione all'uso del microfono. Il servizio vocale è fornito da un fornitore esterno che opera come responsabile del
                trattamento. <em>Testo da completare e far approvare prima dell'attivazione.</em>
              </p>
            ),
          },
        ]
      : []),
    {
      title: 'Perché trattiamo i dati',
      body: (
        <ul>
          <li>
            Dati di navigazione e statistiche aggregate: legittimo interesse dello studio al funzionamento sicuro del sito e alla misura
            anonima delle visite (art. 6, par. 1, lett. f del Regolamento UE 2016/679).
          </li>
          {analyticsConfigured && (
            <li>Statistiche con Google Analytics: il tuo consenso, che puoi ritirare in qualsiasi momento (art. 6, par. 1, lett. a).</li>
          )}
          <li>Richieste di contatto: rispondere a una tua richiesta prima di un eventuale appuntamento (art. 6, par. 1, lett. b).</li>
        </ul>
      ),
    },
    {
      title: "Trasferimento dei dati fuori dall'Unione europea",
      body: (
        <p>
          Cloudflare, Inc.{analyticsConfigured ? ' e Google LLC (capogruppo di Google Ireland Limited) hanno' : ' ha'} sede negli Stati Uniti. L'eventuale trasferimento dei dati di navigazione avviene con le garanzie previste dal
          Regolamento UE 2016/679, come il Data Privacy Framework UE-USA e le clausole contrattuali standard approvate dalla Commissione
          europea.
        </p>
      ),
    },
    {
      title: 'Per quanto tempo',
      body: (
        <p>
          I dati di navigazione sono conservati dal fornitore di hosting per il tempo strettamente necessario alla sicurezza del servizio.
          {analyticsConfigured &&
            ' I dati di Google Analytics a livello di singolo visitatore sono conservati per 2 mesi e i cookie statistici durano al massimo 13 mesi; restano solo i totali aggregati, che non identificano nessuno.'}{' '}
          I dati delle richieste di contatto sono conservati per il tempo necessario a gestirle.
        </p>
      ),
    },
    {
      title: 'I tuoi diritti',
      body: (
        <>
          <p>
            Puoi chiedere in qualsiasi momento l'accesso ai tuoi dati, la rettifica, la cancellazione, la limitazione del trattamento, la
            portabilità o opporti al trattamento (artt. 15–22 del Regolamento UE 2016/679), scrivendo ai recapiti del titolare indicati sopra.
          </p>
          <p>
            Hai anche il diritto di proporre reclamo al Garante per la protezione dei dati personali (
            <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">
              www.garanteprivacy.it
            </a>
            ).
          </p>
        </>
      ),
    },
    {
      title: 'Pazienti dello studio',
      body: (
        <p>
          I dati dei pazienti raccolti durante le visite e le cure sono trattati secondo l'informativa specifica consegnata in studio. Per i
          cookie, consulta la <Link to="/cookie-policy">cookie policy</Link>.
        </p>
      ),
    },
  ]

  return (
    <LegalPage
      eyebrow="Privacy policy"
      title="Informativa sul trattamento dei dati personali"
      intro="Informativa ai sensi degli articoli 13 e 14 del Regolamento (UE) 2016/679 (GDPR) per chi visita questo sito."
      updated="ottobre 2026"
      sections={sections}
    />
  )
}
