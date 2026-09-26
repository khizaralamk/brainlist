import { useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'

const TASKS = ['water the monstera', 'reply to Jo', '10-min tidy', 'the tax thing', 'go for a walk', 'call the dentist']
const COLORS = ['var(--sun)', 'var(--mint)', 'var(--lilac)', 'var(--sky)', 'var(--pink)', 'var(--card)']
const SLICE = 360 / TASKS.length

// Angle is measured clockwise from 12 o'clock.
const point = (deg: number, r: number) => {
  const rad = (deg * Math.PI) / 180
  return `${100 + r * Math.sin(rad)} ${100 - r * Math.cos(rad)}`
}

export default function Wheel() {
  const wheel = useRef<HTMLDivElement>(null)
  const rotation = useRef(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const spin = () => {
    if (spinning) return
    const pick = Math.floor(Math.random() * TASKS.length)
    const jitter = gsap.utils.random(-SLICE * 0.35, SLICE * 0.35)
    // Land slice `pick` under the pointer after at least five full turns.
    const landing = (((360 - (pick + 0.5) * SLICE + jitter) % 360) + 360) % 360
    const target = Math.ceil((rotation.current + 1800) / 360) * 360 + landing
    rotation.current = target
    setSpinning(true)
    setResult(null)
    gsap.to(wheel.current, {
      rotation: target,
      duration: prefersReducedMotion() ? 0.01 : 4.2,
      ease: 'power4.out',
      onComplete: () => {
        setSpinning(false)
        setResult(TASKS[pick])
      },
    })
  }

  return (
    <div className="wheel-wrap">
      <div className="wheel-stage">
        <svg className="wheel-pointer" viewBox="0 0 30 34" aria-hidden="true">
          <path d="M15 32 L2 4 Q15 -2 28 4 Z" />
        </svg>
        <div ref={wheel} className="wheel" aria-hidden="true">
          <svg viewBox="0 0 200 200">
            {TASKS.map((task, i) => {
              const a0 = i * SLICE
              const a1 = a0 + SLICE
              const mid = a0 + SLICE / 2
              return (
                <g key={task}>
                  <path d={`M100 100 L${point(a0, 96)} A96 96 0 0 1 ${point(a1, 96)} Z`} fill={COLORS[i]} />
                  <text transform={`rotate(${mid - 90} 100 100)`} x="186" y="102.5" textAnchor="end">
                    {task}
                  </text>
                </g>
              )
            })}
            <circle cx="100" cy="100" r="96" className="wheel-rim" />
            <circle cx="100" cy="100" r="13" className="wheel-hub" />
          </svg>
        </div>
      </div>
      <button type="button" className="btn btn-ink" onClick={spin} disabled={spinning} data-cursor="spin!">
        {spinning ? 'Spinning…' : 'Spin the wheel'}
      </button>
      <p className="wheel-result hand" aria-live="polite">
        {result ? `→ ${result}. go!` : ' '}
      </p>
    </div>
  )
}
