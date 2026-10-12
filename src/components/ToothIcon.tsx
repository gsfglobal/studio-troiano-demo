import { useId } from 'react'

/** Dente stilizzato (linea continua con riflesso), usato nella transizione tra le pagine. */
export const TOOTH_ICON_PATHS = [
  'M100 46C86 30 58 26 44 40C28 56 30 86 38 110C46 134 50 162 56 196C58 210 74 212 78 198C84 176 88 150 100 150C112 150 116 176 122 198C126 212 142 210 144 196C150 162 154 134 162 110C170 86 172 56 156 40C142 26 114 30 100 46Z',
  'M60 66C62 56 70 50 80 49',
]

export function ToothIcon({ className, strokeWidth = 2.4 }: { className?: string; strokeWidth?: number }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 200 240" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`ti-${id}`} x1="30" y1="20" x2="170" y2="220" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="rgb(140 194 75)" />
          <stop offset="0.45" stopColor="rgb(126 206 211)" />
          <stop offset="0.75" stopColor="rgb(101 203 237)" />
          <stop offset="1" stopColor="rgb(31 154 211)" />
        </linearGradient>
      </defs>
      {TOOTH_ICON_PATHS.map((d) => (
        <path
          key={d}
          d={d}
          pathLength={1}
          stroke={`url(#ti-${id})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  )
}
