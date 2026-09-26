import { useEffect, useRef, useState } from 'react'
import { gsap, hasFinePointer } from '../lib/motion'

const HOVERABLE = '[data-cursor], a, button, [role="button"], label'

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')

  useEffect(() => {
    const el = dot.current
    if (!el || !hasFinePointer()) return
    const root = document.documentElement
    root.classList.add('has-cursor')

    const xTo = gsap.quickTo(el, 'x', { duration: 0.3, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.3, ease: 'power3' })

    const move = (e: PointerEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
      el.classList.add('is-visible')
    }
    const over = (e: PointerEvent) => {
      const target = (e.target as Element).closest<HTMLElement>(HOVERABLE)
      const text = target?.dataset.cursor ?? ''
      el.classList.toggle('is-hover', !!target && !text)
      el.classList.toggle('has-label', !!text)
      setLabel(text)
    }
    const hide = () => el.classList.remove('is-visible')
    const down = () => el.classList.add('is-down')
    const up = () => el.classList.remove('is-down')

    window.addEventListener('pointermove', move)
    document.addEventListener('pointerover', over)
    root.addEventListener('pointerleave', hide)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    return () => {
      root.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      root.removeEventListener('pointerleave', hide)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
    }
  }, [])

  return (
    <div ref={dot} className="cursor" aria-hidden="true">
      <span>{label}</span>
    </div>
  )
}
