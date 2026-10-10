/**
 * Contenuti del sito. Tutti i testi sono proposte da validare con lo studio:
 * informativi, senza promesse di risultato, superlativi o leve promozionali
 * (L. 145/2018, c. 525 e codice deontologico).
 */

export type TreatmentId = 'implantologia' | 'parodontologia' | 'ortodonzia' | 'estetica' | 'igiene'

export type Treatment = {
  id: TreatmentId
  title: string
  short: string
  description: string
  expect: string[]
  steps: { title: string; text: string }[]
}

export const treatments: Treatment[] = [
  {
    id: 'implantologia',
    title: 'Implantologia',
    short: 'Sostituire i denti mancanti',
    description:
      "L'implantologia permette di sostituire uno o più denti mancanti con radici artificiali in titanio, sulle quali viene fissata una corona. La possibilità di procedere si valuta sempre dopo la visita e gli esami radiografici necessari.",
    expect: ['Valutazione clinica e radiografica', 'Piano di cura spiegato fase per fase', 'Controlli periodici nel tempo'],
    steps: [
      { title: 'Valutazione', text: "Visita, esami radiografici e analisi della quantità di osso disponibile." },
      { title: 'Intervento', text: "Inserimento dell'impianto in anestesia locale, secondo il piano concordato." },
      { title: 'Corona', text: "Dopo il periodo di guarigione indicato dal professionista, si applica la corona definitiva." },
    ],
  },
  {
    id: 'parodontologia',
    title: 'Parodontologia',
    short: 'La salute delle gengive',
    description:
      "La parodontologia si occupa delle gengive e dei tessuti che sostengono il dente. Gengive che sanguinano o arrossate sono segnali da far valutare: un controllo tempestivo aiuta a scegliere il trattamento più adatto.",
    expect: ['Valutazione dello stato delle gengive', 'Igiene e terapie mirate', 'Mantenimento con richiami periodici'],
    steps: [
      { title: 'Valutazione', text: 'Misurazione dei tessuti di sostegno e, se necessario, esami radiografici.' },
      { title: 'Terapia', text: 'Pulizia profonda delle superfici e, quando indicato, trattamenti specifici.' },
      { title: 'Mantenimento', text: 'Richiami con una frequenza stabilita in base alla situazione di ciascuno.' },
    ],
  },
  {
    id: 'ortodonzia',
    title: 'Ortodonzia',
    short: 'Allineare i denti',
    description:
      "L'ortodonzia corregge la posizione dei denti e il modo in cui le arcate combaciano, con apparecchi fissi o mascherine trasparenti, per ragazzi e adulti. Il tipo di apparecchio si sceglie insieme dopo la visita.",
    expect: ['Studio del caso con foto e impronte', 'Scelta condivisa dell’apparecchio', 'Controlli regolari durante la terapia'],
    steps: [
      { title: 'Studio del caso', text: 'Visita, fotografie, impronte o scansione e radiografie necessarie.' },
      { title: 'Terapia', text: "Applicazione dell'apparecchio scelto e controlli programmati." },
      { title: 'Contenzione', text: 'Al termine, dispositivi di contenzione per mantenere la posizione raggiunta.' },
    ],
  },
  {
    id: 'estetica',
    title: 'Estetica dentale',
    short: 'Colore, forma, armonia',
    description:
      "Gli interventi di estetica dentale migliorano colore, forma e proporzioni dei denti, ad esempio con lo sbiancamento professionale o le faccette, sempre nel rispetto della salute dei tessuti.",
    expect: ['Analisi del sorriso e delle aspettative', 'Proposte valutate insieme', 'Attenzione alla salute dei tessuti'],
    steps: [
      { title: 'Analisi', text: 'Valutazione del sorriso, del colore e delle proporzioni dei denti.' },
      { title: 'Proposta', text: 'Spiegazione delle possibili soluzioni, con vantaggi e limiti di ciascuna.' },
      { title: 'Trattamento', text: 'Esecuzione del percorso scelto e indicazioni per il mantenimento.' },
    ],
  },
  {
    id: 'igiene',
    title: 'Igiene e prevenzione',
    short: 'Prendersi cura ogni giorno',
    description:
      "Le sedute di igiene professionale e i controlli periodici aiutano a mantenere denti e gengive in salute. La frequenza dei richiami si stabilisce in base alle esigenze di ciascuno, adulti e bambini.",
    expect: ['Igiene professionale', 'Consigli per la cura a casa', 'Richiami personalizzati'],
    steps: [
      { title: 'Controllo', text: 'Visita di controllo e verifica dello stato di denti e gengive.' },
      { title: 'Seduta di igiene', text: 'Rimozione di placca e tartaro e lucidatura delle superfici.' },
      { title: 'A casa', text: 'Indicazioni su spazzolino, filo e scovolini adatti a te.' },
    ],
  },
]

export const journey = [
  { title: 'Il primo contatto', text: 'Chiami, scrivi su WhatsApp o compili il modulo. Scegliamo insieme il giorno e l’orario più comodi.' },
  { title: 'La prima visita', text: 'Ascolto, visita ed eventuali esami. Ti spieghiamo cosa vediamo, con parole semplici.' },
  { title: 'Il piano di cura', text: 'Ricevi un piano scritto con fasi, tempi e costi, da valutare con calma prima di decidere.' },
  { title: 'Nel tempo', text: 'Controlli e igiene periodica per prendersi cura del sorriso anche dopo le cure.' },
]

export type GalleryItem = { src: string; alt: string; title: string; note: string; w: number; h: number }

export const gallery: GalleryItem[] = [
  {
    src: 'images/studio-sterilizzazione.webp',
    alt: "Area di sterilizzazione dello studio con pensili bianchi, lavello, imbustatrice e la scritta Studio Dentistico Troiano sulla parete",
    title: 'Area di sterilizzazione',
    note: 'Archivio, 2016',
    w: 738,
    h: 411,
  },
  {
    src: 'images/studio-strumentario.webp',
    alt: "Strumentario chirurgico disposto sul telo sterile, con il kit per implantologia e il logo dello studio sulla vetrata",
    title: 'Strumentario chirurgico',
    note: 'Archivio dello studio',
    w: 540,
    h: 960,
  },
  {
    src: 'images/studio-autoclave.webp',
    alt: "Autoclave e imbustatrice nell'area di sterilizzazione, con la scritta dello studio sulla parete",
    title: 'Autoclave e imbustatrice',
    note: 'Archivio, 2016',
    w: 738,
    h: 1032,
  },
  {
    src: 'images/studio-ufficio.webp',
    alt: "Ufficio dello studio con scrivania in vetro, due sedie bianche e pensili a giorno",
    title: 'Ufficio e colloqui',
    note: 'Archivio dello studio',
    w: 738,
    h: 1258,
  },
  {
    src: 'images/studio-libreria.webp',
    alt: "Mensola con libri per il book sharing e cornice con le istruzioni, nella sala d'attesa",
    title: "Book sharing in sala d'attesa",
    note: 'Archivio, 2016',
    w: 738,
    h: 411,
  },
]
