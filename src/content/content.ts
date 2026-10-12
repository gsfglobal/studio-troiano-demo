/**
 * Contenuti del sito. Testi informativi, mai promozionali (L. 145/2018, art. 1 c. 525,
 * come modificato dalla L. 103/2023, e Codice deontologico): niente promesse di
 * risultato, superlativi, confronti, sconti o marchi commerciali di dispositivi.
 */
import images from './images.json'

export type ImageName = keyof typeof images

/** Un paragrafo può contenere testo e link (aperti in una nuova scheda). */
export type Rich = Array<string | { label: string; href: string }>

export type TreatmentId = 'parodontologia' | 'implantologia' | 'ortodonzia' | 'pediatrica' | 'endodonzia' | 'protesi' | 'igiene'

export type Treatment = {
  id: TreatmentId
  title: string
  short: string
  description: string
  details?: Rich[]
  expect: string[]
  steps: { title: string; text: string }[]
}

export const treatments: Treatment[] = [
  {
    id: 'parodontologia',
    title: 'Parodontologia',
    short: 'La salute delle gengive',
    description:
      'La parodontologia si occupa delle gengive e dei tessuti che sostengono il dente. Gengive che sanguinano, arrossate o che si ritirano sono segnali da far valutare: una diagnosi precoce aiuta a scegliere il trattamento più adatto.',
    details: [
      [
        "Il Dott. Troiano è socio della SIdP – Società Italiana di Parodontologia e Implantologia dal 2018. Lo studio è presente nell'elenco della Società per la diagnosi e la cura delle malattie parodontali, consultabile su ",
        { label: 'www.trovaparodontologo.com', href: 'https://www.trovaparodontologo.com' },
        '.',
      ],
    ],
    expect: ['Valutazione dello stato delle gengive', 'Igiene e terapie mirate', 'Mantenimento con richiami periodici'],
    steps: [
      { title: 'Valutazione', text: 'Misurazione dei tessuti di sostegno e, se necessario, esami radiografici.' },
      { title: 'Terapia', text: 'Pulizia profonda delle superfici e, quando indicato, trattamenti specifici.' },
      { title: 'Mantenimento', text: 'Richiami con una frequenza stabilita in base alla situazione di ciascuno.' },
    ],
  },
  {
    id: 'implantologia',
    title: 'Implantologia',
    short: 'Sostituire i denti mancanti',
    description:
      "L'implantologia permette di sostituire uno o più denti mancanti con radici artificiali in titanio, sulle quali viene fissata una corona. La possibilità di procedere si valuta sempre dopo la visita e gli esami radiografici necessari.",
    details: [
      [
        "Nei casi selezionati lo studio utilizza la chirurgia implantare computer guidata: l'intervento viene progettato al computer partendo dagli esami radiografici 3D e dalla scansione digitale, e una mascherina chirurgica su misura guida l'inserimento dell'impianto secondo il progetto. Quando le condizioni lo consentono, si può operare senza incisioni né punti di sutura.",
      ],
    ],
    expect: ['Valutazione clinica e radiografica', 'Chirurgia computer guidata nei casi indicati', 'Controlli periodici nel tempo'],
    steps: [
      { title: 'Valutazione', text: 'Visita, esami radiografici 3D e analisi della quantità di osso disponibile.' },
      { title: 'Intervento', text: "Inserimento dell'impianto in anestesia locale, secondo il piano concordato." },
      { title: 'Corona', text: "Dopo il periodo di guarigione indicato dal professionista, sull'impianto si applica la corona." },
    ],
  },
  {
    id: 'ortodonzia',
    title: 'Ortodonzia',
    short: 'Allineare i denti',
    description:
      "L'ortodonzia corregge la posizione dei denti e il modo in cui le arcate combaciano, per ragazzi e adulti. Lo studio si dedica in particolare all'ortodonzia linguale: l'apparecchio viene applicato sul lato interno dei denti e non si vede dall'esterno.",
    details: [
      ['In alcuni casi si utilizzano retainer attivi, senza attacchi applicati sui denti. Le terapie ortodontiche sono seguite dalla Dott.ssa Carla Romanucci.'],
    ],
    expect: ['Studio del caso con foto e scansione digitale', 'Apparecchio sul lato interno dei denti', 'Controlli regolari durante la terapia'],
    steps: [
      { title: 'Studio del caso', text: 'Visita, fotografie, scansione digitale e radiografie necessarie.' },
      { title: 'Terapia', text: "Applicazione dell'apparecchio scelto e controlli programmati." },
      { title: 'Contenzione', text: 'Al termine, dispositivi di contenzione per mantenere la posizione raggiunta.' },
    ],
  },
  {
    id: 'pediatrica',
    title: 'Odontoiatria pediatrica',
    short: 'I denti dei più piccoli',
    description:
      "Visite di controllo, prevenzione e cure per bambini e ragazzi, sui denti da latte e su quelli permanenti. Il primo incontro serve anche a far conoscere lo studio al bambino con calma. Quando serve, si valuta precocemente la crescita delle arcate insieme all'ortodontista.",
    expect: ['Prevenzione e controlli periodici', 'Cure sui denti da latte e permanenti', 'Valutazione della crescita delle arcate'],
    steps: [
      { title: 'Conoscenza', text: 'Il primo incontro serve a far conoscere lo studio al bambino, senza fretta.' },
      { title: 'Controllo', text: "Visita dei denti e indicazioni ai genitori per l'igiene a casa." },
      { title: 'Nel tempo', text: 'Richiami periodici e, quando serve, una valutazione ortodontica.' },
    ],
  },
  {
    id: 'endodonzia',
    title: 'Endodonzia',
    short: "Curare il dente dall'interno",
    description:
      "L'endodonzia è la cura dei canali radicolari (la cosiddetta devitalizzazione), necessaria quando la polpa del dente è infiammata o infetta. L'obiettivo è conservare il dente naturale.",
    details: [["Il Dott. Troiano ha conseguito il perfezionamento in Endodonzia nel 2001 all'Università Federico II di Napoli."]],
    expect: ['Diagnosi clinica e radiografica', 'Trattamento in anestesia locale', 'Ricostruzione del dente al termine'],
    steps: [
      { title: 'Diagnosi', text: 'Visita e radiografie per valutare lo stato della polpa e delle radici.' },
      { title: 'Trattamento', text: 'Pulizia, sagomatura e chiusura dei canali radicolari.' },
      { title: 'Ricostruzione', text: 'Il dente viene ricostruito; in alcuni casi si valuta una corona.' },
    ],
  },
  {
    id: 'protesi',
    title: 'Protesi',
    short: 'Ricostruire e sostituire',
    description:
      "La protesi dentaria ricostruisce i denti danneggiati o sostituisce quelli mancanti, con corone, ponti, protesi su impianti o rimovibili. L'impronta può essere rilevata in digitale con lo scanner intraorale. La soluzione si sceglie insieme dopo la visita.",
    expect: ['Impronta digitale con scanner intraorale', 'Corone, ponti, protesi su impianti o rimovibili', 'Soluzione scelta insieme dopo la visita'],
    steps: [
      { title: 'Valutazione', text: 'Visita ed esami per individuare la soluzione indicata nel tuo caso.' },
      { title: 'Progetto', text: "Rilevazione dell'impronta e scelta di forma e colore dei denti." },
      { title: 'Consegna', text: 'Prove, applicazione della protesi e controlli nel tempo.' },
    ],
  },
  {
    id: 'igiene',
    title: 'Igiene e prevenzione',
    short: 'Prendersi cura ogni giorno',
    description:
      'Le sedute di igiene professionale e i controlli periodici aiutano a mantenere denti e gengive in salute. La frequenza dei richiami si stabilisce in base alle esigenze di ciascuno, adulti e bambini.',
    details: [
      [
        "Le sedute di igiene professionale si svolgono con la tecnica GBT (Guided Biofilm Therapy): un getto di acqua, aria e micropolveri molto fini rimuove la placca batterica (biofilm) in modo delicato, riducendo l'uso di strumenti manuali. Le sedute sono eseguite dalla Dott.ssa Maria Scarfato, igienista dentale.",
      ],
    ],
    expect: ['Igiene professionale con tecnica GBT', 'Consigli per la cura a casa', 'Richiami personalizzati'],
    steps: [
      { title: 'Controllo', text: 'Visita di controllo e verifica dello stato di denti e gengive.' },
      { title: 'Seduta di igiene', text: 'Rimozione della placca batterica con la tecnica GBT e, dove presente, del tartaro.' },
      { title: 'A casa', text: 'Indicazioni su spazzolino, filo e scovolini adatti a te.' },
    ],
  },
]

export type Technology = {
  id: string
  title: string
  short: string
  text: string
  image: ImageName
  alt: string
  /** Colore dello sfondo della foto (oggi tutte su bianco), per incorniciarla senza stacchi. */
  tone: 'dark' | 'light'
  related: TreatmentId[]
}

/** Nessun nome commerciale o marchio di produttore. Foto illustrative da sostituire con quelle dello studio. */
export const technologies: Technology[] = [
  {
    id: 'scanner-intraorale',
    title: 'Scanner intraorale',
    short: "L'impronta in digitale",
    text: "Rileva l'impronta dei denti in digitale con una piccola telecamera, al posto delle paste tradizionali. Il modello 3D compare subito sullo schermo e si usa per progettare protesi, apparecchi ortodontici e interventi.",
    image: 'tech-scanner-intraorale',
    alt: 'Scanner intraorale: manipolo bianco appoggiato sul suo supporto, su sfondo nero',
    tone: 'light',
    related: ['protesi', 'ortodonzia', 'implantologia'],
  },
  {
    id: 'laser-a-diodi',
    title: 'Laser a diodi',
    short: 'Per i tessuti molli',
    text: "Si utilizza nei trattamenti dei tessuti molli, come le gengive, ad esempio a supporto della terapia parodontale e in piccoli interventi, secondo l'indicazione del professionista.",
    image: 'tech-laser-diodi',
    alt: 'Laser a diodi: apparecchio con schermo e manipolo collegato, su sfondo bianco',
    tone: 'light',
    related: ['parodontologia'],
  },
  {
    id: 'piezochirurgia',
    title: 'Piezochirurgia',
    short: 'Ultrasuoni per la chirurgia',
    text: "Strumento chirurgico a ultrasuoni che lavora sull'osso con micro-vibrazioni, per interventi di precisione che rispettano i tessuti molli circostanti.",
    image: 'tech-piezochirurgia',
    alt: 'Apparecchio per piezochirurgia con manipolo e sacca per la soluzione fisiologica, su sfondo bianco',
    tone: 'light',
    related: ['implantologia'],
  },
  {
    id: 'chirurgia-computer-guidata',
    title: 'Chirurgia implantare computer guidata',
    short: 'Progettazione digitale',
    text: "L'intervento viene progettato in digitale e guidato da una mascherina chirurgica su misura. Nei casi indicati consente di inserire l'impianto senza incisioni né punti di sutura.",
    image: 'tech-chirurgia-guidata',
    alt: "Illustrazione 3D di una mascherina chirurgica trasparente su un modello dell'arcata, con il manipolo che guida l'inserimento dell'impianto",
    tone: 'light',
    related: ['implantologia'],
  },
]

export type TeamMember = {
  id: string
  name: string
  role: string
  text: string
  /** Nome della foto in assets/foto: la scheda compare solo quando la foto è stata generata. */
  photo: string
  alt: string
  objectPosition?: string
}

/** Titolare e direttore sanitario. */
export const director = {
  name: 'Dott. Amedeo Troiano',
  role: 'Titolare e direttore sanitario',
  photo: 'team-amedeo-troiano' as ImageName,
  alt: 'Il Dott. Amedeo Troiano, sorridente, in polo bianca e con gli occhiali ingranditori, davanti alla parete dello studio con la frase «Un giorno senza un sorriso è un giorno perso»',
  bio: [
    'Titolare e direttore sanitario dello Studio Dentistico Troiano.',
    'Laurea con lode nel 1998, Università degli Studi di Napoli Federico II.',
    'Perfezionamento in Endodonzia nel 2001, stesso ateneo.',
    'Socio SIdP – Società Italiana di Parodontologia e Implantologia dal 2018.',
    "Iscritto all'Albo degli Odontoiatri di Napoli, n. 2129.",
  ],
}

const allTeam: TeamMember[] = [
  {
    id: 'carla-romanucci',
    name: 'Dott.ssa Carla Romanucci',
    role: 'Ortodonzia',
    text: "Si occupa delle terapie ortodontiche dello studio, con particolare attenzione all'ortodonzia linguale.",
    photo: 'team-carla-romanucci',
    alt: 'Ritratto della Dott.ssa Carla Romanucci, sorridente, seduta nel suo studio',
    objectPosition: 'center 30%',
  },
  {
    id: 'maria-scarfato',
    name: 'Dott.ssa Maria Scarfato',
    role: 'Igiene dentale',
    text: 'Igienista dentale, esegue le sedute di igiene professionale con la tecnica GBT e segue i pazienti nei richiami periodici di prevenzione.',
    photo: 'team-maria-scarfato',
    alt: 'Ritratto della Dott.ssa Maria Scarfato, igienista dentale',
  },
  {
    id: 'nunzia-santarpia',
    name: 'Nunzia Santarpia',
    role: 'Segreteria',
    text: 'È il punto di riferimento per appuntamenti e informazioni.',
    photo: 'team-nunzia-santarpia',
    alt: 'Nunzia Santarpia, sorridente, alla scrivania della segreteria',
    objectPosition: 'center 20%',
  },
  // Assistenti alla poltrona: compilare nome e foto quando arrivano (team-nome-cognome.webp)
  { id: 'assistente-1', name: '', role: 'Assistente alla poltrona', text: '', photo: 'team-assistente-1', alt: '' },
  { id: 'assistente-2', name: '', role: 'Assistente alla poltrona', text: '', photo: 'team-assistente-2', alt: '' },
]

/** Solo le persone con nome e foto: online nessun riquadro vuoto. */
export const team = allTeam.filter((m) => m.name && m.photo in images)

export const journey = [
  { title: 'Il primo contatto', text: "Chiami lo studio o scrivi su WhatsApp: scegliamo insieme il giorno e l'orario più comodi." },
  { title: 'La prima visita', text: 'Ascolto, visita ed eventuali esami. Ti spieghiamo cosa vediamo, con parole semplici.' },
  { title: 'Il piano di cura', text: 'Ricevi un piano scritto con fasi, tempi e costi, da valutare con calma prima di decidere.' },
  { title: 'Nel tempo', text: 'Controlli e igiene periodica per prendersi cura del sorriso anche dopo le cure.' },
]

export type GalleryItem = { image: ImageName; alt: string; title: string; position?: string }

export const gallery: GalleryItem[] = [
  {
    image: 'studio-sala-operativa',
    alt: 'Sala operativa dello studio con il riunito verde, la lampada e il braccio radiografico, in un ambiente bianco e luminoso',
    title: 'Sala operativa',
  },
  {
    image: 'studio-sterilizzazione',
    alt: 'Area di sterilizzazione con pensili bianchi, lavello, imbustatrice e la scritta Studio Dentistico Troiano sulla parete',
    title: 'Area di sterilizzazione',
  },
  {
    image: 'studio-strumentario-chirurgico',
    alt: 'Strumentario chirurgico disposto sul telo sterile, con il kit per implantologia; sul vetro, il logo dello studio visto dal retro',
    title: 'Strumentario chirurgico',
  },
  {
    image: 'studio-autoclave',
    alt: "Autoclave e imbustatrice nell'area di sterilizzazione, con la scritta dello studio sulla parete",
    title: 'Autoclave e imbustatrice',
    position: 'top',
  },
  {
    image: 'studio-ufficio',
    alt: 'Ufficio per i colloqui con scrivania in vetro, due sedie bianche e pensili a giorno',
    title: 'Ufficio e colloqui',
  },
]

export const findGallery = (image: ImageName) => gallery.find((g) => g.image === image)!
