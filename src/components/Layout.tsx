import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation, type Location } from 'react-router-dom'
import Lenis from 'lenis'
import { Header } from './Header'
import { Footer } from './Footer'
import { DemoBadge } from './DemoBadge'
import { ToothMark } from './ToothMark'
import { gsap, ScrollTrigger, isFinePointer, prefersReducedMotion, scrollToTop, setLenis } from '../lib/motion'
import Home from '../pages/Home'
import Studio from '../pages/Studio'
import Trattamenti from '../pages/Trattamenti'
import Professionista from '../pages/Professionista'
import Contatti from '../pages/Contatti'
import NotFound from '../pages/NotFound'

export function Layout() {
  const location = useLocation()
  const [shown, setShown] = useState<Location>(location)
  const curtain = useRef<HTMLDivElement>(null)
  const busy = useRef(false)

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

  // Transizione tra le pagine: una tenda bianca con il tratto del dente
  useEffect(() => {
    if (location.pathname === shown.pathname) {
      if (location.search !== shown.search) setShown(location)
      return
    }
    const c = curtain.current
    if (!c || prefersReducedMotion() || busy.current) {
      scrollToTop()
      setShown(location)
      return
    }
    busy.current = true
    const path = c.querySelector('path')
    const len = path ? path.getTotalLength() : 0
    gsap
      .timeline({ onComplete: () => void (busy.current = false) })
      .set(c, { display: 'flex', yPercent: 100 })
      .set(path, { strokeDasharray: len, strokeDashoffset: len })
      .to(c, { yPercent: 0, duration: 0.6, ease: 'expo.inOut' })
      .to(path, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' }, 0.2)
      .add(() => {
        scrollToTop()
        setShown(location)
      })
      .to(c, { yPercent: -100, duration: 0.75, ease: 'expo.inOut', delay: 0.12 })
      .set(c, { display: 'none' })
  }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
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
          <Route path="/professionista" element={<Professionista />} />
          <Route path="/contatti" element={<Contatti />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <DemoBadge />
      <div ref={curtain} aria-hidden="true" className="fixed inset-0 z-[80] hidden items-center justify-center bg-paper">
        <ToothMark className="h-[22vh] w-auto" strokeWidth={2.4} />
      </div>
    </>
  )
}
