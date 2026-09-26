import { useRef } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/motion'
import { FOUNDER_URL } from '../lib/links'

// The founder's own words, word-split so they light up as you scroll.
const QUOTE: { w: string; mark?: 'hi' | 'wave' }[] = [
  ...'I tried'.split(' ').map((w) => ({ w })),
  { w: 'HUNDREDS', mark: 'hi' },
  ...'of calendars and went back to my notes app'.split(' ').map((w) => ({ w })),
  ...'every. single. time.'.split(' ').map((w) => ({ w, mark: 'wave' as const })),
]

export default function Story() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo(
        '.q-word',
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: { trigger: '.story-quote', start: 'top 80%', end: 'bottom 45%', scrub: true },
        },
      )
      gsap.from('.letter', {
        y: 80,
        rotation: -4,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.letter', start: 'top 85%' },
      })
      gsap.fromTo(
        '.signature path',
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 1.6,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: '.signature', start: 'top 90%' },
        },
      )
    },
    { scope: root },
  )

  return (
    <section ref={root} className="section story" id="story">
      <p className="eyebrow eyebrow-light">
        <span>03</span> Why it exists
      </p>
      <blockquote className="story-quote">
        <p>
          {QUOTE.map((q, i) => (
            <span key={i} className={`q-word${q.mark ? ` q-${q.mark}` : ''}`}>
              {q.w}{' '}
            </span>
          ))}
        </p>
      </blockquote>

      <div className="letter">
        <p className="letter-kicker hand">a note from the founder</p>
        <p>
          My brain needs a list, not a sheet. Using my notes app instead just worked so much better, but things would
          get lost all the time and I got so sick of forgetting things that I made Brainlist.
        </p>
        <p>
          Every entry shows up in a list <em>and</em> your calendar. This might sound banal to someone who doesn’t have
          a neurodivergent brain, but it genuinely changed my life.
        </p>
        <p>
          Please try it out and let me know what you think, especially if you struggle with normal calendars.
        </p>
        <div className="letter-sign">
          <svg className="signature" viewBox="0 0 220 70" aria-hidden="true">
            <path
              pathLength={1}
              d="M14 50 C22 30 30 12 34 10 C38 8 30 40 26 54 C40 50 52 48 60 44 C70 38 74 30 68 32 C58 36 60 52 72 50 C80 48 84 40 86 34 C86 44 88 52 96 48 C104 44 108 36 112 32 C112 40 110 48 116 48 C124 48 132 38 136 34 C134 42 136 50 146 48 C160 44 170 40 206 30"
            />
          </svg>
          <a href={FOUNDER_URL} target="_blank" rel="noreferrer">
            Lara Hopf, founder · @hopflara
          </a>
        </div>
      </div>
    </section>
  )
}
