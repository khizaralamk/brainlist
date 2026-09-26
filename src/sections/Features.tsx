import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/motion'
import Wheel from './Wheel'

function BrainDumpArt() {
  return (
    <div className="art art-dump">
      <div className="dump-head">
        <span>Brain Dump</span>
        <span className="dump-count">4 new</span>
      </div>
      <ul className="dump-lines">
        <li>pick up dry cleaning</li>
        <li>idea: shelf for the plants</li>
        <li>email Jo back about Sat</li>
        <li className="is-typing">
          book the car servi<span className="caret" />
        </li>
      </ul>
      <div className="mic">
        <span className="mic-ring" />
        <span className="mic-ring mic-ring-2" />
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="8.5" y="3" width="7" height="12" rx="3.5" />
          <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
        </svg>
      </div>
    </div>
  )
}

function TimelineArt() {
  const rows = [
    ['09:30', 'Standup', 'event'],
    ['', 'Buy plant food', 'task'],
    ['14:00', 'Dentist', 'event'],
    ['', 'Reply to the scary email', 'task'],
    ['19:00', 'Dinner with Mum', 'event'],
  ]
  return (
    <div className="art art-timeline">
      <p className="tl-day">Today</p>
      <ul>
        {rows.map(([time, text, kind]) => (
          <li key={text} className={`tl-row is-${kind}`}>
            <span className="tl-time">{time || '—'}</span>
            <span className="tl-dot" />
            <span className="tl-text">{text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function MatrixArt() {
  const cells = [
    { title: 'Do it now', tasks: ['rent', 'dentist call'], cls: 'm-do' },
    { title: 'Schedule it', tasks: ['gym plan', 'tax thing'], cls: 'm-plan' },
    { title: 'Hand it off', tasks: ['book venue'], cls: 'm-hand' },
    { title: 'Let it go', tasks: ['reorganise apps'], cls: 'm-drop' },
  ]
  return (
    <div className="art art-matrix">
      <span className="m-axis m-axis-top">urgent</span>
      <span className="m-axis m-axis-top m-axis-right">not urgent</span>
      <span className="m-axis m-axis-side">important</span>
      <span className="m-axis m-axis-side m-axis-low">not important</span>
      <div className="m-grid">
        {cells.map((c) => (
          <div key={c.title} className={`m-cell ${c.cls}`}>
            <strong>{c.title}</strong>
            {c.tasks.map((t) => (
              <span key={t} className="m-task">
                {t}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

const PANELS = [
  {
    n: '01',
    title: 'Brain Dump',
    body: 'Type it or say it, then get back to your day. Your thought waits for you instead of getting buried forever.',
    color: 'sun',
    art: <BrainDumpArt />,
  },
  {
    n: '02',
    title: 'One timeline',
    body: 'Events and tasks in a single list for the day, synced with a month view you never have to maintain.',
    color: 'lilac',
    art: <TimelineArt />,
  },
  {
    n: '03',
    title: 'The Matrix',
    body: 'Eisenhower’s urgent vs. important grid, so the loud things stop drowning out the ones that matter.',
    color: 'mint',
    art: <MatrixArt />,
  },
  {
    n: '04',
    title: 'Spin the wheel',
    body: 'Can’t decide what to start with? Hand it to the wheel. Starting is the hard part.',
    color: 'tomato',
    art: <Wheel />,
  },
]

export default function Features() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 960px) and (prefers-reduced-motion: no-preference)', () => {
        const track = root.current!.querySelector<HTMLElement>('.h-track')!
        const distance = () => track.scrollWidth - window.innerWidth
        const scroll = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current!.querySelector('.h-pin'),
            pin: true,
            scrub: 0.8,
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
          },
        })
        // Art inside each panel drifts against the scroll for a bit of depth.
        gsap.utils.toArray<HTMLElement>('.panel .art, .panel .wheel-wrap', root.current).forEach((art) => {
          gsap.from(art, {
            xPercent: 12,
            rotation: 3,
            ease: 'none',
            scrollTrigger: {
              trigger: art.closest('.panel'),
              containerAnimation: scroll,
              start: 'left right',
              end: 'center center',
              scrub: true,
            },
          })
        })
        gsap.to('.h-progress span', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: root.current!.querySelector('.h-pin'), start: 'top top', end: () => `+=${distance()}`, scrub: true },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} className="features" id="features">
      <div className="h-pin">
        <div className="h-track">
          <div className="panel panel-intro">
            <p className="eyebrow">
              <span>02</span> Features
            </p>
            <h2 className="h2">
              Four tools.
              <br />
              <em>Zero</em> buried
              <br />
              notes.
            </h2>
            <p className="hand intro-hint">scroll sideways-ish →</p>
          </div>
          {PANELS.map((p) => (
            <article key={p.n} className={`panel bg-${p.color}`}>
              <header className="panel-head">
                <span className="panel-n">{p.n}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </header>
              <div className="panel-art">{p.art}</div>
            </article>
          ))}
        </div>
        <div className="h-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  )
}
