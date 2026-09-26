import { useRef } from 'react'
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '../lib/motion'
import Lines from '../components/Lines'

const PRO = [
  ['AI that plans your day with you', 'so the list turns into an actual order'],
  ['Time estimates for events', 'because "5 minutes" is never 5 minutes'],
  ['Big tasks broken down', 'into steps small enough to start'],
  ['Meeting transcripts → tasks', 'talk, and the to-dos write themselves'],
  ['Travel-time reminders', 'leave when you actually need to leave'],
  ['Houseplant care', 'yes, really. RIP to the last fern'],
]

export default function Pro() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      ScrollTrigger.batch('.pro-item', {
        start: 'top 85%',
        once: true,
        onEnter: (items) => {
          const tl = gsap.timeline()
          tl.from(items, { x: -30, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' })
          tl.fromTo(
            items.map((el) => el.querySelector('.tick path')),
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.4, stagger: 0.12, ease: 'power2.out' },
            0.35,
          )
        },
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className="section pro" id="pro">
      <div className="pro-copy">
        <p className="eyebrow" data-reveal>
          <span>04</span> Pricing
        </p>
        <Lines className="h2" lines={['Free to start.', <><em>Pro</em> when you</>, 'want backup.']} />
        <p className="lede" data-reveal>
          Brainlist is free to download. Pro adds the extra help on the right, and comes weekly, monthly or yearly.
          Every plan starts with a 7-day free trial.
        </p>
        <p className="hand pro-note" data-reveal>
          try it for a week. keep it if it helps.
        </p>
      </div>

      <div className="notepad" data-reveal>
        <div className="notepad-head">
          <span>brainlist pro</span>
          <span className="hand">things it does for you</span>
        </div>
        <ul>
          {PRO.map(([title, sub]) => (
            <li key={title} className="pro-item">
              <svg className="tick" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <path pathLength={1} d="M6.5 12.5 L10.5 16.5 L18 7.5" />
              </svg>
              <span>
                <strong>{title}</strong>
                <small>{sub}</small>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
