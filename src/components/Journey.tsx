import { useLayoutEffect, useRef } from 'react'
import { journey } from '../content/content'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { Lines } from './Lines'

/** Percorso del paziente: quattro fasi reali, con una linea che avanza durante lo scroll. */
export function Journey() {
  const root = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-jline]', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '[data-jlist]', start: 'top 70%', end: 'bottom 60%', scrub: true } })
      gsap.utils.toArray<HTMLElement>('[data-jstep]').forEach((s) => {
        gsap.from(s, { autoAlpha: 0.15, y: 30, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: s, start: 'top 78%', once: true } })
        gsap.fromTo(
          s.querySelector('[data-jdot]'),
          { backgroundColor: 'rgb(223 230 232)', scale: 0.6 },
          { backgroundColor: 'rgb(101 203 237)', scale: 1, scrollTrigger: { trigger: s, start: 'top 66%', end: 'top 50%', scrub: true } },
        )
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} aria-labelledby="journey-title" className="bg-paper">
      <div className="wrap grid gap-14 py-24 md:py-36 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+56px)]">
            <p className="t-eyebrow" data-reveal="fade">Il percorso del paziente</p>
            <Lines as="h2" id="journey-title" className="t-h2 mt-5" lines={['Dal primo contatto', <>ai controlli <em className="accent">nel tempo.</em></>]} />
            <p className="t-lead mt-7 max-w-[40ch]" data-reveal="fade">
              Sapere cosa succederà, e quando, rende tutto più semplice. Ecco come si svolge il percorso nello studio.
            </p>
          </div>
        </div>
        <ol data-jlist className="relative grid gap-14 pl-10 md:gap-20 md:pl-16 lg:col-span-6 lg:col-start-7">
          <span aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-px bg-line md:left-[11px]" />
          <span aria-hidden="true" data-jline className="absolute bottom-2 left-[7px] top-2 w-px origin-top md:left-[11px]" style={{ background: 'linear-gradient(rgb(var(--green)), rgb(var(--sky)), rgb(var(--blue)))' }} />
          {journey.map((j, i) => (
            <li key={j.title} data-jstep className="relative">
              <span data-jdot aria-hidden="true" className="absolute -left-10 top-[0.55rem] h-[15px] w-[15px] rounded-full bg-sky ring-4 ring-paper md:-left-16 md:h-[23px] md:w-[23px]" />
              <p className="text-[0.78rem] font-semibold tabular-nums tracking-[0.2em] text-blue-deep">0{i + 1}</p>
              <h3 className="t-h3 mt-3">{j.title}</h3>
              <p className="t-body mt-3 max-w-[46ch] text-[1.05rem]">{j.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
