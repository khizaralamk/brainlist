import { useRef } from 'react'
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '../lib/motion'

const ROW_A = ['tried hundreds of calendars', 'went back to my notes app', 'every. single. time.', 'so I made Brainlist']
const ROW_B = ['brain dump', 'list view', 'month view', 'eisenhower matrix', 'spin the wheel', 'dictation']

function Row({ items, className }: { items: string[]; className: string }) {
  // Two copies so a -50% loop is seamless.
  const doubled = [...items, ...items]
  return (
    <div className={`tape ${className}`}>
      <div className="tape-track">
        {doubled.map((item, i) => (
          <span key={i} className="tape-item" aria-hidden={i >= items.length || undefined}>
            {item}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0 L14 9 L24 12 L14 15 L12 24 L10 15 L0 12 L10 9 Z" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Marquee() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const [a, b] = gsap.utils.toArray<HTMLElement>('.tape-track', root.current)
      const loops = [
        gsap.to(a, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 }),
        gsap.fromTo(b, { xPercent: -50 }, { xPercent: 0, duration: 32, ease: 'none', repeat: -1 }),
      ]
      // Scroll speed pushes the tapes faster, then they settle back.
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 6)
          loops.forEach((loop) => {
            gsap.killTweensOf(loop)
            loop.timeScale(boost)
            gsap.to(loop, { timeScale: 1, duration: 1.2, ease: 'power2.out' })
          })
        },
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className="tapes" role="presentation">
      <Row items={ROW_A} className="tape-ink" />
      <Row items={ROW_B} className="tape-sun" />
    </div>
  )
}
