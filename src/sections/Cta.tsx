import { useRef } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/motion'
import { APP_STORE_URL, FOUNDER_URL, PRODUCT_HUNT_URL } from '../lib/links'
import Lines from '../components/Lines'
import AppStoreButton from '../components/AppStoreButton'

export function Cta() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.to('.sticker-ring', { rotation: 360, duration: 18, ease: 'none', repeat: -1 })
      gsap.fromTo(
        '.sticker',
        { rotation: -30, scale: 0.6 },
        {
          rotation: 10,
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'center center', scrub: true },
        },
      )
    },
    { scope: root },
  )

  return (
    <section ref={root} className="section cta">
      <Lines className="cta-title" lines={['Stop losing', <em key="t">things.</em>]} />
      <p className="cta-sub" data-reveal>
        Get it out of your head and into a list that’s also a calendar. It’s free on iPhone.
      </p>
      <div className="cta-actions" data-reveal>
        <AppStoreButton />
        <a className="btn btn-ghost" href={PRODUCT_HUNT_URL} target="_blank" rel="noreferrer" data-magnetic>
          Support the launch on Product Hunt
        </a>
      </div>

      <div className="sticker" aria-hidden="true">
        <svg className="sticker-ring" viewBox="0 0 200 200">
          <defs>
            <path id="ring" d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" />
          </defs>
          <text>
            <textPath href="#ring" textLength="486" lengthAdjust="spacing">
              made by someone with ADHD ✺ for brains that need a list ✺
            </textPath>
          </text>
        </svg>
        <svg className="sticker-star" viewBox="0 0 24 24">
          <path d="M12 0 L14 9 L24 12 L14 15 L12 24 L10 15 L0 12 L10 9 Z" />
        </svg>
      </div>
    </section>
  )
}

const WORD = 'brainlist'

export function Footer() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('.wordmark span', {
        yPercent: 100,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.05,
        scrollTrigger: { trigger: '.wordmark', start: 'top 95%' },
      })
    },
    { scope: root },
  )

  return (
    <footer ref={root} className="footer">
      <div className="footer-top">
        <p className="footer-line">
          Made by someone with ADHD, for everyone who gave up on calendars and went back to their notes app.
        </p>
        <nav className="footer-links" aria-label="Links">
          <a href={APP_STORE_URL} target="_blank" rel="noreferrer">
            App Store
          </a>
          <a href={PRODUCT_HUNT_URL} target="_blank" rel="noreferrer">
            Product Hunt
          </a>
          <a href={FOUNDER_URL} target="_blank" rel="noreferrer">
            Founder
          </a>
        </nav>
      </div>
      <p className="wordmark" aria-label="Brainlist">
        {WORD.split('').map((c, i) => (
          <span key={i} aria-hidden="true">
            {c}
          </span>
        ))}
      </p>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Brainlist Calendar</span>
        <span className="hand">now go drink some water</span>
      </div>
    </footer>
  )
}
