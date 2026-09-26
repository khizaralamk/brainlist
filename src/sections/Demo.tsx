import { useMemo, useRef, useState, type FormEvent } from 'react'
import { gsap, useGSAP } from '../lib/motion'
import Lines from '../components/Lines'

type Entry = { id: number; text: string; date: string; time: string | null; done: boolean }

const pad = (n: number) => String(n).padStart(2, '0')
const toKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const fromKey = (k: string) => {
  const [y, m, d] = k.split('-').map(Number)
  return new Date(y, m - 1, d)
}
const addDays = (d: Date, n: number) => {
  const next = new Date(d)
  next.setDate(next.getDate() + n)
  return next
}

// "call Sam 4pm" or "standup 9:30" becomes an event; anything else is a task.
function parseTime(text: string): string | null {
  const m = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i) ?? text.match(/\b(\d{1,2}):(\d{2})\b/)
  if (!m) return null
  let h = Number(m[1])
  const min = m[2] ?? '00'
  const meridiem = m[3]?.toLowerCase()
  if (meridiem === 'pm' && h < 12) h += 12
  if (meridiem === 'am' && h === 12) h = 0
  if (h > 23 || Number(min) > 59) return null
  return `${pad(h)}:${min}`
}

const SEED: [string, number, string | null][] = [
  ['Standup', 0, '09:30'],
  ['Buy plant food', 0, null],
  ['Dentist (finally)', 1, '14:00'],
  ['Reply to the scary email', 2, null],
  ["Mum's birthday dinner", 4, '19:00'],
  ['Water the monstera', 6, null],
]

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export default function Demo() {
  const root = useRef<HTMLElement>(null)
  const today = useMemo(() => new Date(), [])
  const todayKey = toKey(today)

  const [entries, setEntries] = useState<Entry[]>(() =>
    SEED.map(([text, offset, time], i) => ({ id: i, text, date: toKey(addDays(today, offset)), time, done: false })),
  )
  const [draft, setDraft] = useState('')
  const [day, setDay] = useState(todayKey)
  const [lastAdded, setLastAdded] = useState<number | null>(null)
  const nextId = useRef(SEED.length)

  const quickDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = addDays(today, i)
        const label = i === 0 ? 'Today' : i === 1 ? 'Tmrw' : d.toLocaleDateString('en', { weekday: 'short' })
        return { key: toKey(d), label }
      }),
    [today],
  )

  // Six-week grid starting on the Monday on or before the 1st.
  const grid = useMemo(() => {
    const first = new Date(today.getFullYear(), today.getMonth(), 1)
    const start = addDays(first, -((first.getDay() + 6) % 7))
    return Array.from({ length: 42 }, (_, i) => addDays(start, i))
  }, [today])

  const groups = useMemo(() => {
    const sorted = [...entries].sort(
      (a, b) => a.date.localeCompare(b.date) || (a.time ?? '99').localeCompare(b.time ?? '99') || a.id - b.id,
    )
    const map = new Map<string, Entry[]>()
    sorted.forEach((e) => map.set(e.date, [...(map.get(e.date) ?? []), e]))
    return [...map.entries()]
  }, [entries])

  const byDay = useMemo(() => {
    const map = new Map<string, Entry[]>()
    entries.forEach((e) => map.set(e.date, [...(map.get(e.date) ?? []), e]))
    return map
  }, [entries])

  const dayLabel = (key: string) => {
    if (key === todayKey) return 'Today'
    if (key === toKey(addDays(today, 1))) return 'Tomorrow'
    return fromKey(key).toLocaleDateString('en', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    const id = nextId.current++
    setEntries((prev) => [...prev, { id, text, date: day, time: parseTime(text), done: false }])
    setLastAdded(id)
    setDraft('')
  }

  const toggle = (id: number) => setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, done: !e.done } : e)))

  // The same entry pops into both views at once.
  useGSAP(
    () => {
      if (lastAdded === null) return
      gsap.from(`[data-entry="${lastAdded}"]`, {
        scale: 0.4,
        opacity: 0,
        duration: 0.7,
        ease: 'back.out(2.2)',
        stagger: 0.15,
      })
      gsap.fromTo(`[data-day="${day}"]`, { scale: 1.12 }, { scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.4)' })
    },
    { scope: root, dependencies: [lastAdded] },
  )

  return (
    <section ref={root} className="section demo" id="demo">
      <div className="section-head">
        <p className="eyebrow" data-reveal>
          <span>01</span> How it works
        </p>
        <Lines className="h2" lines={['One entry.', <em key="e">Two places.</em>]} />
        <p className="lede" data-reveal>
          Type a thought. It lands in your list and on your calendar at the same time. That’s the whole trick, and
          it’s the one that finally sticks. Try it.
        </p>
      </div>

      <div className="demo-grid">
        <div className="card demo-list" data-reveal>
          <form className="demo-input" onSubmit={submit}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="e.g. call Sam 4pm"
              aria-label="New entry"
              maxLength={60}
            />
            <button type="submit" className="btn btn-ink btn-sm" data-cursor="add">
              Add
            </button>
          </form>

          <div className="day-chips" role="radiogroup" aria-label="Day">
            {quickDays.map((d) => (
              <button
                key={d.key}
                type="button"
                role="radio"
                aria-checked={day === d.key}
                className={day === d.key ? 'chip is-active' : 'chip'}
                onClick={() => setDay(d.key)}
              >
                {d.label}
              </button>
            ))}
          </div>
          <p className="hand hint">psst: add a time like “4pm” and it becomes an event</p>

          <ol className="timeline" data-lenis-prevent>
            {groups.map(([key, items]) => (
              <li key={key} className={`t-group${key === day ? ' is-selected' : ''}`}>
                <h3 className="t-day">{dayLabel(key)}</h3>
                <ul>
                  {items.map((e) => (
                    <li key={e.id} data-entry={e.id} className={`t-item${e.done ? ' is-done' : ''}`}>
                      {e.time ? (
                        <span className="t-time">{e.time}</span>
                      ) : (
                        <button
                          type="button"
                          className="t-check"
                          aria-pressed={e.done}
                          aria-label={e.done ? `Mark ${e.text} as not done` : `Mark ${e.text} as done`}
                          onClick={() => toggle(e.id)}
                        >
                          <svg viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M3 8.5 L6.5 12 L13 4" />
                          </svg>
                        </button>
                      )}
                      <span className="t-text">{e.text}</span>
                      <span className={`t-kind ${e.time ? 'is-event' : 'is-task'}`}>{e.time ? 'event' : 'task'}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>

        <div className="card demo-cal" data-reveal>
          <div className="cal-head">
            <span className="cal-month">
              {today.toLocaleDateString('en', { month: 'long' })} <em>{today.getFullYear()}</em>
            </span>
            <span className="hand cal-synced">synced automatically ✓</span>
          </div>
          <div className="cal-grid">
            {WEEKDAYS.map((w, i) => (
              <span key={i} className="cal-weekday" aria-hidden="true">
                {w}
              </span>
            ))}
            {grid.map((d) => {
              const key = toKey(d)
              const items = byDay.get(key) ?? []
              const classes = [
                'cal-cell',
                d.getMonth() !== today.getMonth() && 'is-outside',
                key === todayKey && 'is-today',
                key === day && 'is-selected',
              ]
                .filter(Boolean)
                .join(' ')
              return (
                <button
                  key={key}
                  type="button"
                  className={classes}
                  data-day={key}
                  onClick={() => setDay(key)}
                  aria-label={`${dayLabel(key)}, ${items.length} entries`}
                >
                  <span className="cal-num">{d.getDate()}</span>
                  <span className="cal-entries">
                    {items.slice(0, 3).map((e) => (
                      <span
                        key={e.id}
                        data-entry={e.id}
                        className={`cal-entry ${e.time ? 'is-event' : 'is-task'}${e.done ? ' is-done' : ''}`}
                      >
                        {e.text}
                      </span>
                    ))}
                    {items.length > 3 && <span className="cal-more">+{items.length - 3}</span>}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
