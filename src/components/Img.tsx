import type { CSSProperties } from 'react'
import images from '../content/images.json'
import type { ImageName } from '../content/content'
import { asset } from '../lib/base'

type Props = {
  name: ImageName
  alt: string
  /** Larghezza a cui viene mostrata, per scegliere il file giusto (attributo sizes). */
  sizes?: string
  className?: string
  style?: CSSProperties
  /** Le foto sotto la piega si caricano solo quando servono. */
  eager?: boolean
  position?: string
  [data: `data-${string}`]: unknown
}

export const imgSrc = (name: ImageName, width?: number) => {
  const m = images[name]
  const w = width ? m.widths.find((x) => x >= width) ?? m.widths[m.widths.length - 1] : m.widths[m.widths.length - 1]
  return asset(`images/${name}-${w}.webp`)
}

/** Foto responsive: WebP in più larghezze con srcset, dimensioni dichiarate (niente salti di layout). */
export function Img({ name, alt, sizes = '100vw', className, style, eager = false, position, ...rest }: Props) {
  const m = images[name]
  const srcSet = m.widths.map((w) => `${asset(`images/${name}-${w}.webp`)} ${w}w`).join(', ')
  return (
    <img
      src={imgSrc(name, 800)}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={m.w}
      height={m.h}
      loading={eager ? 'eager' : 'lazy'}
      decoding={eager ? 'auto' : 'async'}
      {...(eager ? { fetchpriority: 'high' } : {})}
      className={className}
      style={position ? { objectPosition: position, ...style } : style}
      {...rest}
    />
  )
}
