import type { ReactNode } from 'react'
import { Lines } from './Lines'

type Props = { eyebrow: string; lines: ReactNode[]; lead?: ReactNode; aside?: ReactNode; children?: ReactNode }

/** Apertura delle pagine interne: titolo editoriale, sottotitolo e nota. */
export function PageHero({ eyebrow, lines, lead, aside, children }: Props) {
  return (
    <section className="pt-header relative overflow-hidden">
      <div aria-hidden="true" className="ambient pointer-events-none absolute -right-[20%] -top-[30%] h-[70vmax] w-[70vmax] rounded-full opacity-60 blur-3xl" style={{ background: 'radial-gradient(closest-side, rgb(var(--aqua) / 0.22), transparent)' }} />
      <div className="wrap relative pb-14 pt-16 md:pb-20 md:pt-28">
        <p className="t-eyebrow flex items-center gap-3" data-reveal="fade">
          <span className="grad-line inline-block w-8" />
          {eyebrow}
        </p>
        <div className="mt-7 grid gap-10 lg:grid-cols-12 lg:items-end">
          <Lines as="h1" lines={lines} className="t-display lg:col-span-8" />
          {lead || aside ? (
            <div className="grid gap-5 lg:col-span-4 lg:pb-3" data-reveal="fade" data-delay="0.2">
              {lead ? <p className="t-lead max-w-[44ch]">{lead}</p> : null}
              {aside}
            </div>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  )
}
