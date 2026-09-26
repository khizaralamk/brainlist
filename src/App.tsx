import { gsap, hasFinePointer, prefersReducedMotion, useGSAP, useSmoothScroll } from './lib/motion'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './sections/Hero'
import Marquee from './sections/Marquee'
import Demo from './sections/Demo'
import Features from './sections/Features'
import Story from './sections/Story'
import Pro from './sections/Pro'
import { Cta, Footer } from './sections/Cta'

export default function App() {
  useSmoothScroll()

  // Shared scroll reveals + magnetic buttons. Runs after every section has mounted.
  useGSAP(() => {
    if (!prefersReducedMotion()) {
      gsap.utils.toArray<HTMLElement>('.lines:not([data-intro])').forEach((heading) => {
        const masks = heading.querySelectorAll('.mask')
        gsap.set(masks, { overflow: 'hidden' })
        gsap.from(heading.querySelectorAll('.mask-inner'), {
          yPercent: 115,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.09,
          scrollTrigger: { trigger: heading, start: 'top 85%' },
          onComplete: () => void gsap.set(masks, { clearProps: 'overflow' }),
        })
      })
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 36,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        })
      })
    }

    if (!hasFinePointer()) return
    const cleanups = gsap.utils.toArray<HTMLElement>('[data-magnetic]').map((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        xTo((e.clientX - r.left - r.width / 2) * 0.28)
        yTo((e.clientY - r.top - r.height / 2) * 0.35)
      }
      const leave = () => {
        xTo(0)
        yTo(0)
      }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      return () => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', leave)
      }
    })
    return () => cleanups.forEach((fn) => fn())
  })

  return (
    <>
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Demo />
        <Features />
        <Story />
        <Pro />
        <Cta />
      </main>
      <Footer />
    </>
  )
}
