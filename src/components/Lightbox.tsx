import { useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { GalleryItem } from '../content/content'
import { gsap, getLenis, prefersReducedMotion } from '../lib/motion'

/** Visualizzazione a schermo intero delle fotografie, con tastiera (frecce, Esc). */
export function Lightbox({ items, index, onClose, onIndex }: { items: GalleryItem[]; index: number | null; onClose: () => void; onIndex: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const open = index !== null

  useEffect(() => {
    if (!open) return
    const lenis = getLenis()
    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
    const prevFocus = document.activeElement as HTMLElement | null
    closeBtn.current?.focus()
    if (!prefersReducedMotion() && ref.current) gsap.fromTo(ref.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: 'power2.out' })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onIndex(((index ?? 0) + 1) % items.length)
      if (e.key === 'ArrowLeft') onIndex(((index ?? 0) - 1 + items.length) % items.length)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      lenis?.start()
      document.documentElement.style.overflow = ''
      prevFocus?.focus()
    }
  }, [open, index, items.length, onClose, onIndex])

  useEffect(() => {
    const img = ref.current?.querySelector('img')
    if (img && !prefersReducedMotion()) gsap.fromTo(img, { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'power3.out' })
  }, [index])

  if (!open || index === null) return null
  const it = items[index]
  return (
    <div ref={ref} role="dialog" aria-modal="true" aria-label={`Fotografia: ${it.title}`} className="on-dark fixed inset-0 z-[60] flex flex-col bg-night/95 text-white backdrop-blur-xl" style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="wrap flex h-16 items-center justify-between">
        <p className="text-[0.85rem] tabular-nums text-white/60">
          {index + 1} / {items.length}
        </p>
        <button ref={closeBtn} type="button" onClick={onClose} aria-label="Chiudi" className="grid h-11 w-11 place-items-center rounded-full border border-white/20 hover:bg-white/10">
          <X size={18} />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20">
        <img src={it.src} alt={it.alt} className="h-full w-full max-w-[1100px] object-contain" />
        <button type="button" onClick={() => onIndex((index - 1 + items.length) % items.length)} aria-label="Fotografia precedente" className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-night/40 hover:bg-white/10 md:left-6">
          <ChevronLeft size={20} />
        </button>
        <button type="button" onClick={() => onIndex((index + 1) % items.length)} aria-label="Fotografia successiva" className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-night/40 hover:bg-white/10 md:right-6">
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="wrap flex flex-wrap items-baseline justify-between gap-3 py-5">
        <p className="text-[1rem] font-medium">{it.title}</p>
        <p className="text-[0.8rem] text-white/55">{it.note}</p>
      </div>
    </div>
  )
}
