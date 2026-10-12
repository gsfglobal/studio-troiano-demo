# Studio Dentistico Troiano — sito definitivo (Dental Go)

Sito dello Studio Dentistico Troiano (Boscotrecase, NA): Home, Lo studio, Trattamenti,
Tecnologie, Team, Contatti, Privacy policy e Cookie policy.

React + TypeScript + Vite + Tailwind CSS + GSAP/ScrollTrigger + Lenis, con **pre-rendering
statico**: ogni pagina è un file HTML completo (Google legge i contenuti senza JavaScript).

- URL puliti: `/studio`, `/trattamenti`, `/tecnologie`, `/team`, `/contatti`, `/privacy-policy`, `/cookie-policy`
- Nessun cookie, nessun modulo, nessun servizio esterno caricato all'apertura (font dal sito stesso,
  niente mappa incorporata): **non serve il banner dei cookie**.
- Contatti solo con pulsanti: WhatsApp (solo messaggi) e telefono fisso.
- Testi informativi conformi alla comunicazione sanitaria (L. 145/2018, c. 525, come modificato
  dalla L. 103/2023): nessuna promessa, sconto, superlativo o marchio di dispositivi.

La versione demo approvata dal dottore è salvata nel tag `demo-v1` ed è ancora online su
GitHub Pages (ramo `gh-pages`).

## Comandi

Serve Node.js 18 o superiore.

    npm install
    npm run dev        # sviluppo, http://localhost:5173
    npm run build      # build + pre-rendering → dist/
    npm run preview    # prova locale di dist/ come su Cloudflare Pages, http://localhost:4173
    npm run images     # rigenera le foto responsive da assets/foto/

## Pubblicazione — Cloudflare Pages (piano gratuito)

Progetto Pages collegato a questo repository (account Dental Go):

| Impostazione | Valore |
|---|---|
| Ramo di produzione | `main` |
| Comando di build | `npm run build` |
| Cartella di output | `dist` |
| Variabile d'ambiente | `NODE_VERSION` = `20` |

Ogni push su `main` pubblica il sito. L'anteprima `*.pages.dev` ha `X-Robots-Tag: noindex`
(vedi `dist/_headers`), così Google indicizza solo il dominio definitivo.

**Dominio** `studiodentisticotroiano.it` (OVH, intestato ad Amedeo Troiano):
1. Cloudflare › Aggiungi sito › piano Free; su OVH sostituire i nameserver con quelli indicati da Cloudflare.
2. Pages › progetto › Domini personalizzati: aggiungere `studiodentisticotroiano.it` e `www.studiodentisticotroiano.it`.
3. Regola di reindirizzamento (Rules › Redirect Rules): `www.studiodentisticotroiano.it/*` → `https://studiodentisticotroiano.it/${1}` (301).
4. HTTPS è automatico. Facoltativo: Email Routing `info@` → `studiodentisticoatroiano@gmail.com`
   (poi aggiornare `email` in `src/config/site.ts`).
5. Statistiche: Pages › progetto › Metriche › Web Analytics (senza cookie). Il CSP permette già
   `static.cloudflareinsights.com`.
6. Collegare il sito alla scheda Google Business dello studio e inviare `sitemap.xml` in Search Console.

## Dove si modificano dati e testi

- `src/config/site.ts` — telefono, WhatsApp, email, indirizzo, orari, dati legali, Giulia.
- `src/config/pages.ts` — title e meta description di ogni pagina.
- `src/content/content.ts` — trattamenti, tecnologie, team, galleria, percorso del paziente.
- `assets/foto/` — foto originali; `npm run images` crea le versioni 480/800/1600 px in `public/images/`
  e aggiorna `src/content/images.json`.

### Aggiungere una persona del team

Copiare la foto in `assets/foto/` con il nome previsto (es. `team-maria-scarfato.webp`), lanciare
`npm run images` e fare il commit: la scheda compare da sola. Per le assistenti alla poltrona,
compilare anche nome e testo in `content.ts` (voci `assistente-1` e `assistente-2`, con il nome
della foto). Le schede senza nome o senza foto non vengono mostrate. Prima di pubblicare una foto
serve la liberatoria firmata della persona.

### Foto delle tecnologie

Le immagini in `tech-*.webp` sono illustrative (immagini di catalogo senza marchi; sullo schermo
del laser le scritte sono sfocate). Quando il dottore manda le foto reali delle apparecchiature,
sostituirle in `assets/foto/` con lo stesso nome e lanciare `npm run images`.

## Giulia (assistente AI) — spenta al lancio

In `src/config/site.ts`: `giulia: { enabled: false, whatsapp: '', voiceAgentId: '' }`.
Con `enabled: false` non compare nulla. Per attivarla:

1. `enabled: true`, numero WhatsApp di Giulia e ID dell'agente vocale.
2. In Cloudflare Pages › Impostazioni › Variabili e segreti: `ELEVENLABS_API_KEY` (segreto) e
   `GIULIA_AGENT_ID`. La Pages Function `functions/api/giulia-session.ts` genera l'URL firmato:
   la chiave non è mai nel codice.
3. Nel CSP (`tools/prerender.mjs`) aggiungere a `connect-src`: `https://api.elevenlabs.io wss://api.elevenlabs.io`.
4. Aggiornare la privacy policy (sezione già predisposta in `src/pages/Privacy.tsx`) e farla approvare.

Lo script vocale si carica solo al clic su «Parla con Giulia»; il pulsante dichiara che Giulia è
un'assistente basata su intelligenza artificiale.
