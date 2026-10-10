import { useEffect, useRef, useState } from 'react'
import { Info, X } from 'lucide-react'
import { studio } from '../config/site'

/** Indicazione discreta che si tratta di un concept dimostrativo. */
export function DemoBadge() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div
      ref={ref}
      className="fixed left-3 z-30 md:left-5"
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
    >
      {open ? (
        <div
          id="demo-note"
          role="note"
          className="mb-2 w-[min(320px,calc(100vw-24px))] rounded-2xl border border-ink/10 bg-paper/95 p-4 text-[0.82rem] leading-relaxed text-ink-soft shadow-[0_20px_60px_-20px_rgb(var(--night)/0.35)] backdrop-blur-xl"
        >
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-blue-deep">{studio.demo.label}</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Chiudi la nota" className="grid h-7 w-7 place-items-center rounded-full hover:bg-mist">
              <X size={14} />
            </button>
          </div>
          {studio.demo.note}
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="demo-note"
        className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-paper/85 px-3 py-1.5 text-[0.7rem] font-medium tracking-wide text-ink-soft shadow-sm backdrop-blur-md transition-colors hover:text-ink"
      >
        <Info size={12} aria-hidden="true" />
        {studio.demo.label}
      </button>
    </div>
  )
}
