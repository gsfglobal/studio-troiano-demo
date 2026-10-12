/**
 * Dati dello studio — UNICO punto da modificare per contatti, orari e dati legali.
 * Non inserire qui codice fiscale, date di nascita o recapiti personali di Dental Go.
 */
export type Hours = { days: string; time: string; schema?: { days: string[]; opens: string; closes: string }[] }

export const SITE_URL = 'https://studiodentisticotroiano.it'

export const studio = {
  name: 'Studio Dentistico Troiano',
  shortName: 'Troiano',

  /** Telefono fisso: formato visibile + numero per il link. */
  phone: { display: '081 012 1278', tel: '+390810121278' },
  /** WhatsApp (solo messaggi): numero internazionale senza + né spazi. */
  whatsapp: { display: '339 235 1808', number: '393392351808' },
  /**
   * Email pubblica. Quando l'inoltro Cloudflare Email Routing è attivo,
   * sostituire con 'info@studiodentisticotroiano.it'.
   */
  email: 'studiodentisticoatroiano@gmail.com',

  address: {
    street: 'Via Cardinal Prisco 90',
    postalCode: '80042',
    city: 'Boscotrecase',
    province: 'NA',
    region: 'Campania',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Via+Cardinal+Prisco+90+Boscotrecase',
  },

  /** Orari di apertura (testo visibile + dati strutturati per Google). */
  hours: [
    { days: 'Lunedì', time: '15:00 – 19:00', schema: [{ days: ['Monday'], opens: '15:00', closes: '19:00' }] },
    {
      days: 'Martedì – Venerdì',
      time: '9:00 – 13:00 e 15:00 – 19:00',
      schema: [
        { days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '13:00' },
        { days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '15:00', closes: '19:00' },
      ],
    },
    { days: 'Sabato e domenica', time: 'Chiuso' },
  ] as Hours[],

  /** Obblighi informativi per la comunicazione sanitaria (footer di ogni pagina). */
  legal: {
    healthDirector: 'Dott. Amedeo Troiano',
    albo: "iscritto all'Albo degli Odontoiatri di Napoli n. 2129",
    vat: '05079421219',
  },

  /** Assistente AI Giulia — spenta al lancio (con enabled: false non compare nulla). */
  giulia: {
    enabled: false,
    /** Numero WhatsApp di Giulia, internazionale senza + né spazi (es. '39333…'). */
    whatsapp: '',
    /** ID dell'agente vocale; la chiave API sta solo nelle variabili d'ambiente di Cloudflare. */
    voiceAgentId: '',
  },

  /** Profili social dello studio (vuoto = icona visibile ma non cliccabile). */
  social: {
    facebook: '', // incollare qui l'indirizzo della pagina, es. 'https://www.facebook.com/…'
    tiktok: 'https://www.tiktok.com/@studiodentisticotroiano',
  },

  agency: { name: 'Dental Go', url: 'https://dentalgo.it' },
}

export const fullAddress = `${studio.address.street}, ${studio.address.postalCode} ${studio.address.city} (${studio.address.province})`

export const telUrl = `tel:${studio.phone.tel}`

/** Con Giulia attiva, il pulsante WhatsApp punta al numero di Giulia. */
const waNumber = () => (studio.giulia.enabled && studio.giulia.whatsapp ? studio.giulia.whatsapp : studio.whatsapp.number)

export const whatsappUrl = (text = 'Buongiorno, vorrei informazioni per una visita.') =>
  `https://wa.me/${waNumber()}?text=${encodeURIComponent(text)}`

export const legalLine = `${studio.name} – ${fullAddress} – P.IVA ${studio.legal.vat} – Direttore sanitario: ${studio.legal.healthDirector}, ${studio.legal.albo}`

export const nav = [
  { to: '/', label: 'Home' },
  { to: '/studio', label: 'Lo studio' },
  { to: '/trattamenti', label: 'Trattamenti' },
  { to: '/tecnologie', label: 'Tecnologie' },
  { to: '/team', label: 'Team' },
  { to: '/contatti', label: 'Contatti' },
]
