/** Mostra un dato configurabile oppure un segnaposto "da inserire" (mai dati inventati). */
export function Ph({ value, label, tag = 'da inserire' }: { value?: string; label: string; tag?: string }) {
  if (value) return <>{value}</>
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span className="ph">{label}</span>
      <span className="ph-tag">{tag}</span>
    </span>
  )
}
