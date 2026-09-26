import { useRef, type MouseEvent } from 'react'
import { ScrollTrigger, scrollToTarget, useGSAP } from '../lib/motion'
import { APP_STORE_URL } from '../lib/links'

const LINKS = [
  { href: '#demo', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#story', label: 'Story' },
  { href: '#pro', label: 'Pro' },
]

export default function Nav() {
  const nav = useRef<HTMLElement>(null)

  // Tuck the nav away while scrolling down, bring it back on the way up.
  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        nav.current?.classList.toggle('is-hidden', self.direction === 1 && self.scroll() > 160)
        nav.current?.classList.toggle('is-scrolled', self.scroll() > 40)
      },
    })
  })

  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    scrollToTarget(href)
  }

  return (
    <header ref={nav} className="nav">
      <a href="#top" className="logo" onClick={(e) => go(e, '#top')}>
        brainlist<span className="logo-dot" />
      </a>
      <nav className="nav-links" aria-label="Sections">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)}>
            {l.label}
          </a>
        ))}
      </nav>
      <a className="btn btn-ink btn-sm" href={APP_STORE_URL} target="_blank" rel="noreferrer" data-magnetic>
        Get the app
      </a>
    </header>
  )
}
