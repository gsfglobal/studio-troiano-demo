import { useLayoutEffect, useRef } from 'react'
import { gallery } from '../content/content'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { useIsDesktop } from '../lib/hooks'
import { Lines } from './Lines'

/** Galleria degli ambienti: scorrimento orizzontale bloccato su desktop, swipe su smartphone. */
export function Gallery() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const desktop = useIsDesktop()

  useLayoutEffect(() => {
    const el = section.current
    const tr = track.current
    if (!el || !tr || !desktop || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const distance = () => Math.max(0, tr.scrollWidth - window.innerWidth)
      const tween = gsap.to(tr, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })
      gsap.utils.toArray<HTMLElement>('[data-gimg]').forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -8, scale: 1.12 },
          { xPercent: 8, scale: 1.12, ease: 'none', scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } },
        )
      })
    }, el)
    return () => ctx.revert()
  }, [desktop])

  return (
    <section ref={section} aria-labelledby="gallery-title" className="relative overflow-hidden bg-mist">
      <div className={desktop ? 'flex h-[100svh] flex-col justify-center' : 'py-24'}>
        <div className="wrap grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="t-eyebrow" data-reveal="fade">Gli ambienti</p>
            <Lines as="h2" id="gallery-title" className="t-h2 mt-5" lines={['Uno spazio luminoso,', <>pensato per <em className="accent">accogliere.</em></>]} />
          </div>
          <p className="t-body max-w-[42ch] lg:col-span-5 lg:justify-self-end" data-reveal="fade">
            Fotografie d'archivio pubblicate dallo studio: gli ambienti e le attrezzature attuali potrebbero essere cambiati.
          </p>
        </div>
        <div
          ref={track}
          className={`mt-10 flex gap-5 md:mt-14 md:gap-8 ${
            desktop ? 'w-max pl-[var(--gutter)] pr-[12vw]' : 'no-scrollbar snap-x snap-mandatory overflow-x-auto px-[var(--gutter)] pb-2'
          }`}
          tabIndex={desktop ? undefined : 0}
          aria-label="Galleria fotografica, scorri in orizzontale"
        >
          {gallery.map((g, i) => {
            const portrait = g.h > g.w
            return (
              <figure key={g.src} className={`shrink-0 snap-start ${portrait ? 'w-[64vw] sm:w-[40vw] lg:w-[24vw]' : 'w-[82vw] sm:w-[60vw] lg:w-[42vw]'} ${i % 2 ? 'lg:mt-16' : ''}`}>
                <div className={`img-frame rounded-[22px] ${portrait ? 'aspect-[3/4]' : 'aspect-[16/10]'}`}>
                  <img data-gimg src={g.src} alt={g.alt} width={g.w} height={g.h} loading="lazy" decoding="async" className="will-change-transform" />
                </div>
                <figcaption className="mt-4 flex items-baseline justify-between gap-4 text-[0.9rem]">
                  <span className="font-medium text-ink">{g.title}</span>
                  <span className="text-[0.78rem] text-ink-soft">{g.note}</span>
                </figcaption>
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
