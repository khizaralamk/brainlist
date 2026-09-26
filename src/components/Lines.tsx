import type { ReactNode } from 'react'

// Heading split into masked lines; App animates every `.lines` on scroll unless it has data-intro.
export default function Lines({
  as: Tag = 'h2',
  lines,
  className = '',
  intro = false,
}: {
  as?: 'h1' | 'h2' | 'p'
  lines: ReactNode[]
  className?: string
  intro?: boolean
}) {
  return (
    <Tag className={`lines ${className}`} data-intro={intro || undefined}>
      {lines.map((line, i) => (
        <span key={i} className="mask">
          <span className="mask-inner">{line}</span>
        </span>
      ))}
    </Tag>
  )
}
