# Studio Dentistico Troiano — concept demo (Dental Go)

Sito dimostrativo di 5 pagine (Home, Lo studio, Trattamenti, Il professionista, Contatti)
realizzato con React, TypeScript, Vite, Tailwind CSS, GSAP + ScrollTrigger, Lenis e
React Three Fiber (Three.js).

## Avvio in locale

Serve Node.js 18 o superiore.

    npm install
    npm run dev        # http://localhost:5173

## Build di produzione

    npm run build      # crea la cartella dist/

La cartella `dist/` (già inclusa in questo pacchetto) è un sito statico: i percorsi sono
relativi e la navigazione usa l'hash (`#/studio`), quindi funziona su qualsiasi hosting
senza configurazioni.

## Pubblicazione online

- **GitHub Pages** (attuale): https://gsfglobal.github.io/studio-troiano-demo/ — il ramo `gh-pages` contiene la build; per aggiornarla: `npm run build` e pubblicare il contenuto di `dist/` su `gh-pages`.

- **Vercel**: `npx vercel --prod` dalla cartella del progetto (build `npm run build`, output `dist`).
- **Netlify**: trascina la cartella `dist/` su https://app.netlify.com/drop
- **Hosting Register.it (dentalgo.it)**: carica via FTP il contenuto di `dist/` in una
  sottocartella, ad esempio `/demo-troiano/` → `https://dentalgo.it/demo-troiano/`

Il sito ha `noindex` nel `<head>`: non viene indicizzato dai motori di ricerca.

## Dove si modificano dati e testi

- `src/config/site.ts` — telefono, WhatsApp, email, indirizzo, link Google Maps, orari,
  direttore sanitario, iscrizione all'Albo, P. IVA, nome e titoli del professionista.
  I campi vuoti compaiono sul sito come "da inserire".
- `src/content/content.ts` — trattamenti, percorso del paziente, didascalie delle foto.
- `public/images/` — fotografie (WebP).

## Funzioni dimostrative (da collegare prima della pubblicazione)

1. Modulo di contatto: valida i campi ma non invia dati (manca il backend: es. email
   transazionale, CRM o Hey Doc).
2. Dati dello studio: telefono, WhatsApp, indirizzo, orari, direttore sanitario, P. IVA,
   iscrizione all'Albo, nome e titoli del professionista non sono stati forniti.
3. Mappa: segnaposto grafico; si collega con il link Google Maps in `site.ts`.
4. Privacy policy e cookie policy: da redigere e collegare (oggi il sito non usa cookie
   né strumenti di tracciamento).
5. Tour virtuale a 360°: sezione predisposta, da realizzare con un servizio fotografico.
6. Elenco trattamenti e testi: proposte da validare con lo studio.

## Note sui contenuti

- Le fotografie sono quelle d'archivio pubblicate dallo studio (alcune del 2016), ritagliate
  dalle schermate social e ottimizzate. Hanno bassa risoluzione: per la versione definitiva
  è consigliato un servizio fotografico degli ambienti attuali.
- Il logo della Società Italiana di Parodontologia e Implantologia non è usato.
- Il modello 3D del molare è generato in modo procedurale (`tools/gen_tooth.py`), senza
  asset di terzi; è illustrativo, non un modello anatomico certificato.
