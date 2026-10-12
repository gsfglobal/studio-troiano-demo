/** Title e meta description di ogni pagina (usati dal pre-rendering e durante la navigazione). */
export type PageMeta = { path: string; title: string; description: string; sitemap?: boolean; priority?: number }

export const pages: PageMeta[] = [
  {
    path: '/',
    title: 'Studio Dentistico Troiano | Dentista a Boscotrecase (NA)',
    description:
      'Studio Dentistico Troiano a Boscotrecase (NA): parodontologia, implantologia, ortodonzia linguale, odontoiatria pediatrica, endodonzia, protesi, igiene e prevenzione.',
    priority: 1,
  },
  {
    path: '/studio',
    title: 'Lo studio | Studio Dentistico Troiano, Boscotrecase',
    description:
      'Gli ambienti dello Studio Dentistico Troiano a Boscotrecase: sala operativa, area di sterilizzazione, chirurgia e implantologia, spazio per i colloqui.',
    priority: 0.8,
  },
  {
    path: '/trattamenti',
    title: 'Trattamenti | Studio Dentistico Troiano, Boscotrecase',
    description:
      'Parodontologia, implantologia, ortodonzia linguale, odontoiatria pediatrica, endodonzia, protesi, igiene e prevenzione: come si svolgono i trattamenti dello studio.',
    priority: 0.9,
  },
  {
    path: '/tecnologie',
    title: 'Tecnologie | Studio Dentistico Troiano, Boscotrecase',
    description:
      'Scanner intraorale, laser a diodi, piezochirurgia e chirurgia implantare computer guidata: le tecnologie in uso allo Studio Dentistico Troiano.',
    priority: 0.8,
  },
  {
    path: '/team',
    title: 'Team | Studio Dentistico Troiano, Boscotrecase',
    description:
      'Il Dott. Amedeo Troiano, titolare e direttore sanitario, e le persone che lavorano nello Studio Dentistico Troiano a Boscotrecase.',
    priority: 0.8,
  },
  {
    path: '/contatti',
    title: 'Contatti e orari | Studio Dentistico Troiano, Boscotrecase',
    description:
      'Indirizzo, telefono, WhatsApp e orari dello Studio Dentistico Troiano, in Via Cardinal Prisco 90 a Boscotrecase (NA).',
    priority: 0.9,
  },
  {
    path: '/privacy-policy',
    title: 'Privacy policy | Studio Dentistico Troiano',
    description: 'Informativa sul trattamento dei dati personali del sito dello Studio Dentistico Troiano.',
    priority: 0.2,
  },
  {
    path: '/cookie-policy',
    title: 'Cookie policy | Studio Dentistico Troiano',
    description: 'Informativa sui cookie del sito dello Studio Dentistico Troiano: solo cookie tecnici, nessun cookie di profilazione.',
    priority: 0.2,
  },
]

export const notFoundMeta: PageMeta = {
  path: '/404',
  title: 'Pagina non trovata | Studio Dentistico Troiano',
  description: "La pagina richiesta non esiste. Torna alla home dello Studio Dentistico Troiano.",
  sitemap: false,
}

export const metaFor = (path: string): PageMeta => pages.find((p) => p.path === path) ?? notFoundMeta
