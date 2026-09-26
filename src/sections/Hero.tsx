import { useRef } from 'react'
import { Draggable, gsap, hasFinePointer, prefersReducedMotion, useGSAP } from '../lib/motion'
import { PRODUCT_HUNT_URL } from '../lib/links'
import Lines from '../components/Lines'
import AppStoreButton from '../components/AppStoreButton'

const NOTES = [
  { text: 'call dentist before 5!!', color: 'sun', r: -7, speed: 0.6 },
  { text: "Mum's bday dinner, Fri 7pm", color: 'pink', r: 5, speed: 1.1 },
  { text: 'water the monstera', color: 'mint', r: -3, speed: 0.8 },
  { text: 'reply to the scary email', color: 'sky', r: 8, speed: 1.3 },
  { text: 'standup 9:30', color: 'lilac', r: -10, speed: 0.5 },
]

export default function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const fine = hasFinePointer()
      let z = 10

      const drags = Draggable.create(q('.note'), {
        bounds: root.current,
        cursor: fine ? 'none' : 'grab',
        activeCursor: fine ? 'none' : 'grabbing',
        zIndexBoost: false,
        onPress() {
          ;(this.target.parentElement as HTMLElement).style.zIndex = String(++z)
          gsap.to(this.target, { scale: 1.08, duration: 0.25, ease: 'power2.out' })
        },
        onRelease() {
          gsap.to(this.target, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' })
        },
      })

      if (prefersReducedMotion()) return () => drags.forEach((d) => d.kill())

      const masks = q('.hero-title .mask')
      gsap.set(masks, { overflow: 'hidden' })
      gsap
        .timeline({ defaults: { ease: 'expo.out' }, delay: 0.15 })
        .from(q('.hero-title .mask-inner'), { yPercent: 115, duration: 1.3, stagger: 0.1 })
        .set(masks, { clearProps: 'overflow' })
        .fromTo(
          q('.scribble path'),
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut', stagger: 0.35 },
          '-=0.6',
        )
        .from(q('.ph-pill, .hero-sub, .hero-cta'), { y: 24, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, 0.5)
        .from(
          q('.note'),
          { scale: 0, rotation: () => gsap.utils.random(-40, 40), duration: 0.9, ease: 'back.out(1.8)', stagger: 0.07 },
          0.8,
        )

      q('.note-wrap').forEach((wrap) => {
        gsap.to(wrap, {
          y: -140 * Number((wrap as HTMLElement).dataset.speed),
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      })
      gsap.to(q('.hero-inner'), {
        yPercent: 18,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })

      return () => drags.forEach((d) => d.kill())
    },
    { scope: root },
  )

  return (
    <section ref={root} className="hero" id="top">
      <div className="hero-inner">
        <a className="ph-pill" href={PRODUCT_HUNT_URL} target="_blank" rel="noreferrer">
          <span className="live-dot" />
          Launching today on Product Hunt
          <span aria-hidden="true">→</span>
        </a>

        <Lines
          as="h1"
          intro
          className="hero-title"
          lines={[
            'my brain needs',
            <>
              a{' '}
              <em className="circled">
                list
                <svg className="scribble" viewBox="0 0 300 130" preserveAspectRatio="none" aria-hidden="true">
                  <path
                    pathLength={1}
                    d="M42 70 C30 28 150 10 232 22 C296 32 300 96 222 110 C150 124 30 116 16 78 C8 54 70 30 128 24"
                  />
                </svg>
              </em>
              , not
            </>,
            <>
              a{' '}
              <span className="struck">
                sheet
                <svg className="scribble scribble-strike" viewBox="0 0 300 40" preserveAspectRatio="none" aria-hidden="true">
                  <path pathLength={1} d="M4 26 C60 14 120 30 180 18 C220 10 260 22 296 12" />
                </svg>
              </span>
              .
            </>,
          ]}
        />

        <p className="hero-sub">
          Brainlist is a notes app that’s secretly a calendar. Every entry shows up in your list <b>and</b> your
          calendar, so nothing gets buried again.
        </p>

        <div className="hero-cta">
          <AppStoreButton />
          <span className="hand hero-aside">
            <svg viewBox="0 0 80 40" aria-hidden="true">
              <path d="M76 30 C56 36 30 30 10 12 M10 12 L12 26 M10 12 L24 12" />
            </svg>
            free on iPhone. made by someone with ADHD
          </span>
        </div>
      </div>

      <div className="notes">
        {NOTES.map((n, i) => (
          <div key={n.text} className={`note-wrap note-wrap-${i + 1}`} data-speed={n.speed}>
            <div className={`note bg-${n.color}`} style={{ rotate: `${n.r}deg` }} data-cursor="drag">
              <span className="note-pin" />
              <p>{n.text}</p>
              <span className="note-foot">list ✓ calendar ✓</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
