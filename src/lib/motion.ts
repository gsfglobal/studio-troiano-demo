import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)
gsap.config({ nullTargetWarn: false })

export { gsap, ScrollTrigger }

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

/** Istanza Lenis condivisa (null su touch o con movimento ridotto). */
let lenisRef: Lenis | null = null
export const setLenis = (l: Lenis | null) => {
  lenisRef = l
}
export const getLenis = () => lenisRef

export const scrollToTop = () => {
  if (lenisRef) lenisRef.scrollTo(0, { immediate: true, force: true })
  window.scrollTo(0, 0)
}

export const scrollToEl = (el: Element | null, offset = -90) => {
  if (!el) return
  if (lenisRef) lenisRef.scrollTo(el as HTMLElement, { offset, duration: 1.4 })
  else {
    const y = el.getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top: y, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }
}
