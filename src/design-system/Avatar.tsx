import type { CSSProperties } from 'react'
import type { Person } from '@/types'
import { cn } from '@/lib/cn'

// Muted tints that read in both themes; initials carry identity, not color.
const tones = [
  'bg-[#e8e6fb] text-[#3d3a8f] dark:bg-[#2a2850] dark:text-[#c9c6ff]',
  'bg-[#dff1ea] text-[#1d5e45] dark:bg-[#183a2e] dark:text-[#a9e4cc]',
  'bg-[#fbe9dc] text-[#7d3f12] dark:bg-[#43291a] dark:text-[#f5c8a5]',
  'bg-[#e1edf9] text-[#1f4f80] dark:bg-[#1b3048] dark:text-[#b4d4f5]',
  'bg-[#f6e3ec] text-[#7a2a4e] dark:bg-[#43202f] dark:text-[#f2bad2]',
]

export function Avatar({
  person,
  size = 'md',
  className,
  style,
}: {
  person: Person
  size?: 'sm' | 'md'
  className?: string
  style?: CSSProperties
}) {
  return (
    <span
      title={person.name}
      style={style}
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold ring-2 ring-surface',
        size === 'sm' ? 'size-6 text-2xs' : 'size-7 text-xs',
        tones[person.tone % tones.length],
        className,
      )}
    >
      <span aria-hidden>{person.initials}</span>
      <span className="sr-only">{person.name}</span>
    </span>
  )
}

export function AvatarStack({ people, max = 4, size = 'md' }: { people: Person[]; max?: number; size?: 'sm' | 'md' }) {
  const shown = people.slice(0, max)
  const extra = people.length - shown.length
  return (
    <span className="flex items-center -space-x-1">
      {/* Earlier avatars sit on top, so overlaps cover the edge of the next circle rather than initials. */}
      {shown.map((p, i) => (
        <Avatar key={p.id} person={p} size={size} className="relative" style={{ zIndex: shown.length - i }} />
      ))}
      {extra > 0 && (
        <span
          className={cn(
            'inline-flex items-center justify-center rounded-full bg-surface-3 font-semibold text-fg-muted ring-2 ring-surface',
            size === 'sm' ? 'size-6 text-2xs' : 'size-7 text-xs',
          )}
        >
          +{extra}
          <span className="sr-only"> more collaborators</span>
        </span>
      )}
    </span>
  )
}
