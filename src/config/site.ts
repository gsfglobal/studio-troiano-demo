/**
 * Dati dello studio — UNICO punto da modificare prima della pubblicazione.
 * I campi vuoti vengono mostrati sul sito come "da inserire" (nessun dato inventato).
 */
export type Hours = { days: string; time: string }

export const studio = {
  name: 'Studio Dentistico Troiano',
  shortName: 'Troiano',

  /** Telefono: formato visibile + numero per il link (es. '+390811234567'). */
  phone: { display: '', tel: '' },
  /** WhatsApp: numero internazionale senza + né spazi (es. '393331234567'). */
  whatsapp: { display: '', number: '' },
  email: '',

  address: {
    street: '',
    city: '',
    /** Link "Apri in Google Maps" (facoltativo). */
    mapsUrl: '',
  },

  hours: [
    { days: 'Lunedì – Venerdì', time: '' },
    { days: 'Sabato', time: '' },
    { days: 'Domenica', time: 'Chiuso' },
  ] as Hours[],

  /** Obblighi informativi per la comunicazione sanitaria. */
  legal: {
    healthDirector: '', // Direttore sanitario: nome, cognome e titolo
    alboNumber: '', // Iscrizione all'Albo degli Odontoiatri
    vat: '', // Partita IVA
    company: '', // Ragione sociale, se diversa
  },

  professional: {
    /** Nome e cognome come desidera essere presentato. */
    name: '',
    /** Ruolo, es. "Odontoiatra, titolare dello studio". */
    role: '',
    /** Titoli e formazione: una voce per riga (solo dati verificati). */
    education: [] as string[],
  },

  /** Indicazioni sul concept. */
  demo: {
    label: 'Concept demo — Dental Go',
    note:
      "Anteprima dimostrativa preparata da Dental Go per lo Studio Dentistico Troiano. Testi, trattamenti e dati sono proposte da validare con lo studio prima della pubblicazione. Il modulo di contatto non invia dati.",
  },
}

export const whatsappUrl = (text = 'Buongiorno, vorrei informazioni per una visita.') =>
  studio.whatsapp.number ? `https://wa.me/${studio.whatsapp.number}?text=${encodeURIComponent(text)}` : ''

export const nav = [
  { to: '/', label: 'Home' },
  { to: '/studio', label: 'Lo studio' },
  { to: '/trattamenti', label: 'Trattamenti' },
  { to: '/professionista', label: 'Il professionista' },
  { to: '/contatti', label: 'Contatti' },
]
