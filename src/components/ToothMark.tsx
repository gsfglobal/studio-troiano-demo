import { forwardRef, useId } from 'react'

/** Tratto del dente ispirato al logo originale (linea aperta che prosegue nell'onda). */
export const TOOTH_PATH =
  'M381 305C382.7 297.8 388.2 277.0 391 262C393.8 247.0 397.2 229.0 398 215C398.8 201.0 397.7 188.5 396 178C394.3 167.5 392.7 160.7 388 152C383.3 143.3 376.0 133.7 368 126C360.0 118.3 349.3 110.5 340 106C330.7 101.5 321.7 99.5 312 99C302.3 98.5 291.0 100.8 282 103C273.0 105.2 264.8 109.3 258 112C251.2 114.7 246.7 119.3 241 119C235.3 118.7 230.0 113.8 224 110C218.0 106.2 211.8 102.0 205 96C198.2 90.0 191.0 81.7 183 74C175.0 66.3 165.5 57.2 157 50C148.5 42.8 139.8 35.2 132 31C124.2 26.8 117.7 24.8 110 25C102.3 25.2 93.7 27.8 86 32C78.3 36.2 71.0 43.2 64 50C57.0 56.8 49.5 64.7 44 73C38.5 81.3 34.5 88.8 31 100C27.5 111.2 24.8 125.0 23 140C21.2 155.0 20.3 173.3 20 190C19.7 206.7 20.0 224.2 21 240C22.0 255.8 23.8 270.0 26 285C28.2 300.0 30.8 315.0 34 330C37.2 345.0 41.0 361.3 45 375C49.0 388.7 53.0 398.7 58 412C63.0 425.3 68.8 440.8 75 455C81.2 469.2 88.8 485.0 95 497C101.2 509.0 107.2 518.0 112 527C116.8 536.0 120.7 545.8 124 551C127.3 556.2 129.8 561.2 132 558C134.2 554.8 135.8 543.3 137 532C138.2 520.7 138.5 504.5 139 490C139.5 475.5 139.0 460.0 140 445C141.0 430.0 142.5 414.2 145 400C147.5 385.8 150.8 372.5 155 360C159.2 347.5 164.2 335.3 170 325C175.8 314.7 182.8 305.7 190 298C197.2 290.3 204.7 284.3 213 279C221.3 273.7 230.8 268.0 240 266C249.2 264.0 258.7 264.0 268 267C277.3 270.0 286.5 276.2 296 284C305.5 291.8 315.7 303.2 325 314C334.3 324.8 342.8 336.2 352 349C361.2 361.8 371.2 378.8 380 391C388.8 403.2 397.5 412.3 405 422C412.5 431.7 419.2 441.3 425 449C430.8 456.7 437.5 464.8 440 468'

type Props = {
  className?: string
  strokeWidth?: number
  /** 'brand' = sfumatura verde-acquamarina-azzurro; altrimenti un colore CSS. */
  stroke?: 'brand' | string
  title?: string
}

export const ToothMark = forwardRef<SVGPathElement, Props>(function ToothMark(
  { className, strokeWidth = 2.2, stroke = 'brand', title },
  ref,
) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 450 580" className={className} fill="none" aria-hidden={title ? undefined : true} role={title ? 'img' : undefined}>
      {title ? <title>{title}</title> : null}
      {stroke === 'brand' ? (
        <defs>
          <linearGradient id={`tg-${id}`} x1="40" y1="20" x2="430" y2="560" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="rgb(140 194 75)" />
            <stop offset="0.45" stopColor="rgb(126 206 211)" />
            <stop offset="0.75" stopColor="rgb(101 203 237)" />
            <stop offset="1" stopColor="rgb(31 154 211)" />
          </linearGradient>
        </defs>
      ) : null}
      <path
        ref={ref}
        d={TOOTH_PATH}
        stroke={stroke === 'brand' ? `url(#tg-${id})` : stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
})
