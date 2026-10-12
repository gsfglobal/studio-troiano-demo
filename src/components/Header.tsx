import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Phone } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { fullAddress, nav, studio, telUrl, whatsappUrl } from '../config/site'
import { gsap, getLenis, prefersReducedMotion } from '../lib/motion'
import { Button } from './Button'
import { ToothMark } from './ToothMark'
import { asset } from '../lib/base'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const lastY = useRef(0)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      setHidden(y > 320 && y > lastY.current + 2)
      if (y < lastY.current - 2) setHidden(false)
      lastY.current = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const isHome = location.pathname === '/'
  // Sulla pagina Trattamenti l'indice resta agganciato sotto l'header: niente scomparsa allo scroll
  const autoHide = location.pathname !== '/trattamenti'

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-700 ease-out-expo ${
          hidden && !open && autoHide ? '-translate-y-full' : 'translate-y-0'
        } ${scrolled || !isHome ? 'bg-paper/80 shadow-[0_1px_0_rgb(var(--ink)/0.06)] backdrop-blur-xl' : 'bg-transparent'}`}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="wrap flex items-center justify-between gap-6" style={{ height: 'var(--header-h)' }}>
          <Link to="/" className="group flex shrink-0 items-center" aria-label="Studio Dentistico Troiano, torna alla home">
            <img
              src={asset('images/logo-troiano-640.webp')}
              alt="Studio Dentistico Troiano"
              width={640}
              height={110}
              className="h-[30px] w-auto md:h-[36px]"
            />
          </Link>

          <nav aria-label="Navigazione principale" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.slice(1).map((n) => (
                <li key={n.to}>
                  <NavLink
                    to={n.to}
                    className={({ isActive }) =>
                      `relative rounded-full px-4 py-2 text-[0.92rem] font-medium transition-colors duration-300 ${
                        isActive ? 'text-ink' : 'text-ink-soft hover:text-ink'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {n.label}
                        <span
                          className={`absolute inset-x-4 -bottom-0.5 h-[2px] origin-left rounded-full transition-transform duration-500 ease-out-expo ${
                            isActive ? 'scale-x-100' : 'scale-x-0'
                          }`}
                          style={{ background: 'var(--grad-brand)' }}
                        />
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a href={telUrl} className="hidden items-center gap-2 text-[0.92rem] font-semibold tabular-nums text-ink xl:inline-flex" aria-label={`Chiama lo studio: ${studio.phone.display}`}>
              <Phone size={15} strokeWidth={1.8} aria-hidden="true" />
              <span className="link-underline">{studio.phone.display}</span>
            </a>
            <div className="hidden lg:block">
              <Button href={whatsappUrl()} variant="primary" icon={<MessageCircle size={16} strokeWidth={1.8} />} className="!min-h-[46px] !py-1 !pl-5 !pr-1 text-[0.88rem]">
                WhatsApp
              </Button>
            </div>
            <a
              href={telUrl}
              className="grid h-12 w-12 place-items-center rounded-full border border-ink/15 bg-paper/70 backdrop-blur lg:hidden"
              aria-label={`Chiama lo studio: ${studio.phone.display}`}
            >
              <Phone size={18} strokeWidth={1.7} aria-hidden="true" />
            </a>
            <button
              type="button"
              className="relative grid h-12 w-12 place-items-center rounded-full border border-ink/15 bg-paper/70 backdrop-blur lg:hidden"
              aria-label={open ? 'Chiudi il menu' : 'Apri il menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span className={`absolute h-[1.5px] w-5 bg-ink transition-transform duration-500 ease-out-expo ${open ? 'rotate-45' : '-translate-y-[4px]'}`} />
              <span className={`absolute h-[1.5px] w-5 bg-ink transition-transform duration-500 ease-out-expo ${open ? '-rotate-45' : 'translate-y-[4px]'}`} />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  )
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null)
  const firstLink = useRef<HTMLAnchorElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const el = panel.current
    if (!el) return
    const lenis = getLenis()
    const reduce = prefersReducedMotion()
    if (open) {
      setMounted(true)
      lenis?.stop()
      document.documentElement.style.overflow = 'hidden'
      const links = el.querySelectorAll('[data-menu-item]')
      gsap.killTweensOf([el, links])
      if (reduce) {
        gsap.set(el, { autoAlpha: 1, clipPath: 'inset(0 0 0% 0)' })
      } else {
        gsap
          .timeline()
          .set(el, { autoAlpha: 1 })
          .fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'expo.inOut' })
          .fromTo(links, { yPercent: 120, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.9, ease: 'power4.out', stagger: 0.06 }, 0.35)
      }
      setTimeout(() => firstLink.current?.focus(), 400)
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
      window.addEventListener('keydown', onKey)
      return () => window.removeEventListener('keydown', onKey)
    } else if (mounted) {
      lenis?.start()
      document.documentElement.style.overflow = ''
      if (reduce) gsap.set(el, { autoAlpha: 0 })
      else gsap.to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'expo.inOut', onComplete: () => void gsap.set(el, { autoAlpha: 0 }) })
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      id="mobile-menu"
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="on-dark invisible fixed inset-0 z-40 flex flex-col overflow-y-auto bg-night text-white opacity-0 lg:hidden"
      style={{ paddingTop: 'calc(var(--header-h) + env(safe-area-inset-top, 0px) + 12px)', paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}
      aria-hidden={!open}
    >
      <ToothMark className="pointer-events-none absolute -right-24 top-16 h-[70%] opacity-[0.12]" strokeWidth={1.4} />
      <nav className="wrap relative flex-1" aria-label="Menu mobile">
        <ul className="flex flex-col gap-1">
          {nav.map((n, i) => (
            <li key={n.to} className="overflow-hidden">
              <NavLink
                to={n.to}
                end={n.to === '/'}
                ref={i === 0 ? firstLink : undefined}
                data-menu-item
                tabIndex={open ? 0 : -1}
                className={({ isActive }) =>
                  `block py-2 text-[2.6rem] font-light leading-[1.1] tracking-[-0.03em] ${isActive ? 'text-white' : 'text-white/60'}`
                }
              >
                {({ isActive }) => (
                  <span className="inline-flex items-baseline gap-3">
                    {n.label}
                    {isActive ? <span className="accent text-[1.6rem] text-aqua">•</span> : null}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="wrap relative mt-10 grid gap-6" data-menu-item>
        <div className="grad-line w-16" />
        <div className="grid gap-2 text-[0.95rem] text-white/70">
          <p>Telefono {studio.phone.display}</p>
          <p>{fullAddress}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button href={whatsappUrl()} variant="light" icon={<MessageCircle size={17} strokeWidth={1.8} />} className="w-full justify-between">
            Scrivici su WhatsApp
          </Button>
          <Button href={telUrl} variant="outline-light" icon={<Phone size={16} strokeWidth={1.8} />} className="w-full justify-between">
            Chiama lo studio
          </Button>
        </div>
      </div>
    </div>
  )
}
