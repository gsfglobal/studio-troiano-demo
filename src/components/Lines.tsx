import { createElement, type ReactNode } from 'react'

type Props = {
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div'
  lines: ReactNode[]
  className?: string
  reveal?: boolean
  delay?: number
  id?: string
}

/** Testo diviso in righe mascherate per il reveal dal basso. */
export function Lines({ as = 'h2', lines, className, reveal = true, delay, id }: Props) {
  return createElement(
    as,
    { className, id, 'data-reveal': reveal ? 'lines' : undefined, 'data-delay': delay },
    lines.map((l, i) => (
      <span key={i} className="line-mask">
        <span>{l}</span>
      </span>
    )),
  )
}
