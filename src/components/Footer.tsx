import { Link } from 'react-router-dom'
import { nav, studio } from '../config/site'
import { Ph } from './Ph'
import { ToothMark } from './ToothMark'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="on-dark relative overflow-hidden bg-night text-white">
      <ToothMark className="pointer-events-none absolute -right-28 -top-10 h-[130%] opacity-[0.07] md:-right-10" strokeWidth={1.2} />
      <div className="wrap relative pb-10 pt-20 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <img src="images/logo-troiano.webp" alt="Studio Dentistico Troiano" width={1156} height={198} className="h-auto w-[260px] md:w-[320px]" loading="lazy" />
            <p className="mt-8 max-w-[36ch] text-[1.05rem] leading-relaxed text-white/65">
              Un luogo dove ogni sorriso viene ascoltato prima di essere curato.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h2 className="t-eyebrow !text-aqua">Lo studio</h2>
              <ul className="mt-5 grid gap-2 text-[0.95rem] text-white/80">
                <li><Ph value={studio.address.street} label="Indirizzo" /></li>
                <li><Ph value={studio.address.city} label="Città" /></li>
              </ul>
            </div>
            <div>
              <h2 className="t-eyebrow !text-aqua">Contatti</h2>
              <ul className="mt-5 grid gap-2 text-[0.95rem] text-white/80">
                <li><Ph value={studio.phone.display} label="Telefono" /></li>
                <li><Ph value={studio.whatsapp.display} label="WhatsApp" /></li>
                <li><Ph value={studio.email} label="Email" /></li>
              </ul>
            </div>
            <div>
              <h2 className="t-eyebrow !text-aqua">Pagine</h2>
              <ul className="mt-5 grid gap-2 text-[0.95rem]">
                {nav.map((n) => (
                  <li key={n.to}>
                    <Link to={n.to} className="link-underline text-white/80 hover:text-white">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 h-px bg-white/10" />

        <div className="mt-8 grid gap-6 text-[0.82rem] leading-relaxed text-white/55 lg:grid-cols-12">
          <div className="grid gap-1.5 lg:col-span-8">
            <p>
              Direttore sanitario: <Ph value={studio.legal.healthDirector} label="nome, cognome e titolo" />
            </p>
            <p>
              Iscrizione Albo degli Odontoiatri: <Ph value={studio.legal.alboNumber} label="numero" /> · P. IVA:{' '}
              <Ph value={studio.legal.vat} label="partita IVA" />
            </p>
            <p>
              Le informazioni presenti nel sito hanno carattere informativo e non sostituiscono la visita.
            </p>
          </div>
          <div className="flex flex-col gap-1.5 lg:col-span-4 lg:items-end lg:text-right">
            <p>© {year} {studio.name}</p>
            <p>Privacy policy · Cookie policy <span className="ph-tag ml-1">da collegare</span></p>
            <p className="text-white/40">{studio.demo.label}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
