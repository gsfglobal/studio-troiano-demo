import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'

/** Immagine che si espande durante lo scroll (sezione bloccata), con didascalia. */
export function ExpandImage({ src, alt, w, h, caption, overlay, maxWidth = 1280 }: { src: string; alt: string; w: number; h: number; caption?: ReactNode; overlay?: ReactNode; maxWidth?: number }) {
  const root = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.8 } })
      tl.fromTo('[data-xframe]', { clipPath: 'inset(22% 26% 22% 26% round 36px)' }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', ease: 'none', duration: 1 }, 0)
        .fromTo('[data-ximg]', { scale: 1.25 }, { scale: 1, ease: 'none', duration: 1 }, 0)
        .fromTo('[data-xover]', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.25 }, 0.7)
    }, el)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={root} className="relative h-[200svh] bg-paper">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <div className="wrap flex h-full items-center justify-center py-[calc(var(--header-h)+16px)]">
          <figure className="relative w-full" style={{ maxWidth }}>
            <div data-xframe className="img-frame relative w-full overflow-hidden rounded-[28px]" style={{ aspectRatio: `${w} / ${h}`, maxHeight: '78svh' }}>
              <img data-ximg src={src} alt={alt} width={w} height={h} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              {overlay ? (
                <div data-xover className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/70 to-transparent p-6 text-white md:p-10">
                  {overlay}
                </div>
              ) : null}
            </div>
            {caption ? <figcaption className="mt-3 text-[0.78rem] text-ink-soft">{caption}</figcaption> : null}
          </figure>
        </div>
      </div>
    </section>
  )
}
