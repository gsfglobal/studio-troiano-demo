import { useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation, type Location } from 'react-router-dom'
import Lenis from 'lenis'
import { Header } from './Header'
import { Footer } from './Footer'
import { LogoTooth } from './LogoTooth'
import { gsap, ScrollTrigger, isFinePointer, prefersReducedMotion, scrollToTop, setLenis } from '../lib/motion'
import { useIsoLayoutEffect } from '../lib/hooks'
import { markHydrated } from '../lib/reveal'
import { metaFor } from '../config/pages'
import { SITE_URL } from '../config/site'
import Home from '../pages/Home'
import Studio from '../pages/Studio'
import Trattamenti from '../pages/Trattamenti'
import Tecnologie from '../pages/Tecnologie'
import Team from '../pages/Team'
import Contatti from '../pages/Contatti'
import Privacy from '../pages/Privacy'
import Cookie from '../pages/Cookie'
import NotFound from '../pages/NotFound'

export function Layout() {
  const location = useLocation()
  const [shown, setShown] = useState<Location>(location)
  const curtain = useRef<HTMLDivElement>(null)
  const busy = useRef(false)

  // Dopo il primo montaggio le pagine successive si animano per intero
  useEffect(() => markHydrated(), [])

  // Scorrimento morbido solo con mouse/trackpad e senza preferenza di movimento ridotto
  useEffect(() => {
    if (prefersReducedMotion() || !isFinePointer()) return
    const lenis = new Lenis({ lerp: 0.11, smoothWheel: true, wheelMultiplier: 1 })
    setLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  // Aggiorna le misure delle animazioni quando font e immagini sono pronti
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh).catch(() => undefined)
    return () => window.removeEventListener('load', refresh)
  }, [])

  // Title, description e canonical durante la navigazione (al primo caricamento li scrive il pre-rendering)
  useEffect(() => {
    const m = metaFor(shown.pathname)
    document.title = m.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', m.description)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', SITE_URL + (m.path === '/' ? '/' : m.path))
  }, [shown.pathname])

  // Transizione tra le pagine: una tenda bianca con il tratto del dente
  useEffect(() => {
    if (location.pathname === shown.pathname) {
      if (location.search !== shown.search || location.hash !== shown.hash) setShown(location)
      return
    }
    const c = curtain.current
    if (!c || prefersReducedMotion() || busy.current) {
      scrollToTop()
      setShown(location)
      return
    }
    busy.current = true
    const tooth = c.querySelector('svg')
    gsap
      .timeline({ onComplete: () => void (busy.current = false) })
      .set(c, { display: 'flex', yPercent: 100 })
      .set(tooth, { clipPath: 'inset(0% 0% 100% 0%)', autoAlpha: 0, scale: 0.94 })
      .to(c, { yPercent: 0, duration: 0.6, ease: 'expo.inOut' })
      // il dente del logo compare dall'alto verso il basso, come una pennellata
      .to(tooth, { clipPath: 'inset(0% 0% 0% 0%)', autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power2.inOut' }, 0.25)
      .add(() => {
        scrollToTop()
        setShown(location)
      })
      .to(c, { yPercent: -100, duration: 0.75, ease: 'expo.inOut', delay: 0.12 })
      .set(c, { display: 'none' })
  }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

  useIsoLayoutEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120)
    return () => window.clearTimeout(id)
  }, [shown.pathname])

  return (
    <>
      <a href="#contenuto" onClick={(e) => { e.preventDefault(); document.getElementById('contenuto')?.focus() }} className="fixed left-3 top-3 z-[70] -translate-y-24 rounded-full bg-night px-4 py-2 text-sm text-white focus:translate-y-0">
        Vai al contenuto
      </a>
      <Header />
      <main id="contenuto" tabIndex={-1} className="outline-none">
        <Routes location={shown} key={shown.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/trattamenti" element={<Trattamenti />} />
          <Route path="/tecnologie" element={<Tecnologie />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contatti" element={<Contatti />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/cookie-policy" element={<Cookie />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <div ref={curtain} aria-hidden="true" className="fixed inset-0 z-[80] hidden items-center justify-center bg-paper">
        <LogoTooth className="h-[22vh] w-auto" />
      </div>
    </>
  )
}
