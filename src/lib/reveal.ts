import { gsap, ScrollTrigger, prefersReducedMotion } from './motion'

/**
 * Animazioni d'ingresso dichiarative, applicate dentro un contenitore:
 *  [data-reveal="lines"]  righe di testo (figli .line-mask > span) che salgono dalla maschera
 *  [data-reveal="fade"]   dissolvenza con leggero spostamento verticale
 *  [data-reveal="image"]  immagine che si scopre (clip-path) con zoom che rientra
 *  [data-reveal="stagger"] i figli diretti entrano in sequenza
 *  [data-parallax="0.15"] spostamento verticale lento durante lo scroll
 * Gli elementi restano visibili se JavaScript o le animazioni sono disattivati.
 */
export function setupReveals(root: HTMLElement) {
  if (prefersReducedMotion()) return
  const q = gsap.utils.selector(root)

  q('[data-reveal="lines"]').forEach((el: HTMLElement) => {
    const inner = el.querySelectorAll('.line-mask > span')
    gsap.from(inner, {
      yPercent: 110,
      duration: 1.15,
      ease: 'power4.out',
      stagger: 0.09,
      delay: Number(el.dataset.delay || 0),
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    })
  })

  q('[data-reveal="fade"]').forEach((el: HTMLElement) => {
    gsap.from(el, {
      autoAlpha: 0,
      y: 28,
      duration: 1.1,
      ease: 'power3.out',
      delay: Number(el.dataset.delay || 0),
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    })
  })

  q('[data-reveal="stagger"]').forEach((el: HTMLElement) => {
    gsap.from(el.children, {
      autoAlpha: 0,
      y: 32,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    })
  })

  q('[data-reveal="image"]').forEach((el: HTMLElement) => {
    const img = el.querySelector('img')
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 86%', once: true } })
    tl.from(el, { clipPath: 'inset(18% 10% 18% 10% round 28px)', duration: 1.5, ease: 'power3.inOut' })
    if (img) tl.from(img, { scale: 1.22, duration: 1.8, ease: 'power3.out' }, 0)
  })

  q('[data-parallax]').forEach((el: HTMLElement) => {
    const amount = Number(el.dataset.parallax || 0.12)
    gsap.fromTo(
      el,
      { yPercent: -amount * 50 },
      {
        yPercent: amount * 50,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    )
  })

  ScrollTrigger.refresh()
}
