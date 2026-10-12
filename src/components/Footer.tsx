import { Link } from 'react-router-dom'
import { legalLine, nav, studio, telUrl, whatsappUrl } from '../config/site'
import { ToothMark } from './ToothMark'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="on-dark relative overflow-hidden bg-night text-white">
      <ToothMark className="pointer-events-none absolute -right-28 -top-10 h-[130%] opacity-[0.07] md:-right-10" strokeWidth={1.2} />
      <div className="wrap relative pb-10 pt-20 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <img
              src="/images/logo-troiano-640.webp"
              alt="Studio Dentistico Troiano"
              width={640}
              height={110}
              className="h-auto w-[240px] md:w-[300px]"
              loading="lazy"
            />
            <p className="mt-8 max-w-[34ch] text-[1.02rem] leading-relaxed text-white/65">
              Un luogo dove ogni sorriso viene ascoltato prima di essere curato.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
            <div>
              <h2 className="t-eyebrow !text-aqua">Dove siamo</h2>
              <address className="mt-5 grid gap-2 text-[0.95rem] not-italic text-white/80">
                <span>{studio.address.street}</span>
                <span>
                  {studio.address.postalCode} {studio.address.city} ({studio.address.province})
                </span>
                <a href={studio.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="link-underline justify-self-start text-white">
                  Apri in Google Maps
                </a>
              </address>
            </div>
            <div>
              <h2 className="t-eyebrow !text-aqua">Contatti</h2>
              <ul className="mt-5 grid gap-2 text-[0.95rem] text-white/80">
                <li>
                  <a href={telUrl} className="link-underline tabular-nums">Tel. {studio.phone.display}</a>
                </li>
                <li>
                  <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="link-underline tabular-nums">
                    WhatsApp {studio.whatsapp.display}
                  </a>
                </li>
                <li className="break-all">
                  <a href={`mailto:${studio.email}`} className="link-underline">{studio.email}</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="t-eyebrow !text-aqua">Orari</h2>
              <dl className="mt-5 grid gap-2 text-[0.92rem] text-white/80">
                {studio.hours.map((h) => (
                  <div key={h.days}>
                    <dt className="text-white/55">{h.days}</dt>
                    <dd className="tabular-nums">{h.time}</dd>
                  </div>
                ))}
              </dl>
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

        <div className="mt-8 grid gap-6 text-[0.82rem] leading-relaxed text-white/60 lg:grid-cols-12">
          <div className="grid gap-1.5 lg:col-span-8">
            <p>{legalLine}</p>
            <p>Le informazioni presenti nel sito hanno carattere informativo e non sostituiscono la visita.</p>
          </div>
          <div className="flex flex-col gap-1.5 lg:col-span-4 lg:items-end lg:text-right">
            <p>
              © {year} {studio.name}
            </p>
            <p>
              <Link to="/privacy-policy" className="link-underline hover:text-white">Privacy policy</Link>
              {' · '}
              <Link to="/cookie-policy" className="link-underline hover:text-white">Cookie policy</Link>
            </p>
            <p>
              Sito realizzato da{' '}
              <a href={studio.agency.url} target="_blank" rel="noopener" className="link-underline hover:text-white">
                {studio.agency.name}
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
