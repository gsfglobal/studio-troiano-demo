import { useRef, type CSSProperties, type ReactNode } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { useIsoLayoutEffect } from '../lib/hooks'
import { Img } from './Img'
import images from '../content/images.json'
import type { ImageName } from '../content/content'

type Props = {
  name: ImageName
  alt: string
  caption?: ReactNode
  overlay?: ReactNode
  maxWidth?: number
  /** Su smartphone la foto è ritagliata in verticale (4:5) con questa inquadratura. */
  mobilePosition?: string
}

/**
 * Immagine che si espande durante lo scroll (sezione bloccata) su schermi grandi.
 * Su smartphone, o con movimento ridotto, è una foto statica ritagliata in verticale.
 */
export function ExpandImage({ name, alt, caption, overlay, maxWidth = 1280, mobilePosition = 'center' }: Props) {
  const { w, h } = images[name]
  const root = useRef<HTMLElement>(null)
  useIsoLayoutEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion() || !window.matchMedia('(min-width: 1024px)').matches) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.8 } })
      tl.fromTo('[data-xframe]', { clipPath: 'inset(22% 26% 22% 26% round 36px)' }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', ease: 'none', duration: 1 }, 0)
        .fromTo('[data-ximg]', { scale: 1.25 }, { scale: 1, ease: 'none', duration: 1 }, 0)
        .fromTo('[data-xover]', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.25 }, 0.7)
    }, el)
    return () => ctx.revert()
  }, [])
  const vars = { '--ar': `${w} / ${h}`, '--mpos': mobilePosition } as CSSProperties
  return (
    <section ref={root} className="relative bg-paper lg:motion-safe:h-[200svh]">
      <div className="flex items-center justify-center overflow-hidden lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:h-[100svh]">
        <div className="wrap flex h-full items-center justify-center pb-6 lg:py-8 lg:motion-safe:py-[calc(var(--header-h)+16px)]">
          <figure className="relative w-full" style={{ maxWidth }}>
            <div data-xframe className="expand-frame img-frame relative w-full overflow-hidden rounded-[28px]" style={vars}>
              <Img data-ximg name={name} alt={alt} sizes={`(min-width: ${maxWidth}px) ${maxWidth}px, 100vw`} className="h-full w-full object-cover" />
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
