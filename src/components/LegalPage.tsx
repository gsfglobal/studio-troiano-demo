import type { ReactNode } from 'react'

export type LegalSection = { title: string; body: ReactNode }

/** Impaginazione semplice e leggibile per privacy e cookie policy. */
export function LegalPage({ eyebrow, title, intro, updated, sections }: { eyebrow: string; title: string; intro: string; updated: string; sections: LegalSection[] }) {
  return (
    <div className="pt-header bg-paper">
      <div className="wrap grid gap-12 pb-24 pt-16 md:pb-32 md:pt-24 lg:grid-cols-12">
        <header className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+48px)]">
            <p className="t-eyebrow flex items-center gap-3">
              <span className="grad-line inline-block w-8" />
              {eyebrow}
            </p>
            <h1 className="mt-6 text-[clamp(2.1rem,1.5rem+2.2vw,3.4rem)] font-light leading-[1.05] tracking-[-0.035em]">{title}</h1>
            <p className="t-body mt-6 max-w-[40ch]">{intro}</p>
            <p className="mt-6 text-[0.82rem] text-ink-soft">Ultimo aggiornamento: {updated}</p>
          </div>
        </header>
        <div className="legal grid gap-12 lg:col-span-7 lg:col-start-6">
          {sections.map((s, i) => (
            <section key={s.title} aria-labelledby={`s-${i}`} className="border-t border-ink/10 pt-8">
              <h2 id={`s-${i}`} className="text-[1.3rem] font-semibold tracking-[-0.015em]">
                {s.title}
              </h2>
              <div className="mt-4 grid gap-4 text-[1rem] leading-[1.75] text-ink-soft">{s.body}</div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
