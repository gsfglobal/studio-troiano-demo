import { useRef, type ReactNode, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { gsap, isFinePointer, prefersReducedMotion } from '../lib/motion'

type Variant = 'primary' | 'ghost' | 'light' | 'outline-light'
type Props = {
  children: ReactNode
  to?: string
  href?: string
  onClick?: () => void
  variant?: Variant
  className?: string
  icon?: ReactNode
  type?: 'button' | 'submit'
  magnetic?: boolean
  ariaLabel?: string
}

/** Pulsante con micro-interazione magnetica moderata (solo con mouse). */
export function Button({ children, to, href, onClick, variant = 'primary', className = '', icon, type = 'button', magnetic = true, ariaLabel }: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const cls = `btn btn-${variant} ${className}`

  const move = (e: MouseEvent) => {
    if (!magnetic || !ref.current || !isFinePointer() || prefersReducedMotion()) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left - r.width / 2) * 0.18
    const y = (e.clientY - r.top - r.height / 2) * 0.28
    gsap.to(ref.current, { x, y, duration: 0.6, ease: 'power3.out' })
  }
  const leave = () => {
    if (!ref.current) return
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)' })
  }

  const inner = (
    <>
      <span>{children}</span>
      <span className="btn-icon" aria-hidden="true">
        {icon ?? <ArrowUpRight size={18} strokeWidth={1.8} />}
      </span>
    </>
  )
  const common = { className: cls, onMouseMove: move, onMouseLeave: leave, 'aria-label': ariaLabel }

  if (to)
    return (
      <Link to={to} ref={ref as React.Ref<HTMLAnchorElement>} {...common}>
        {inner}
      </Link>
    )
  if (href)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" ref={ref as React.Ref<HTMLAnchorElement>} {...common}>
        {inner}
      </a>
    )
  return (
    <button type={type} onClick={onClick} ref={ref as React.Ref<HTMLButtonElement>} {...common}>
      {inner}
    </button>
  )
}
