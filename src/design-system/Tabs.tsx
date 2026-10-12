import { useRef, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { panelId, tabId } from './tabIds'

export interface TabItem<T extends string> {
  id: T
  label: ReactNode
  count?: number
  disabled?: boolean
}

interface TabsProps<T extends string> {
  /** Shared prefix for tab/panel ids so panels can reference their tab. */
  idBase: string
  label: string
  items: TabItem<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

/** WAI-ARIA tabs with roving tabindex: Tab enters the list, arrows/Home/End move, selection follows focus. */
export function Tabs<T extends string>({ idBase, label, items, value, onChange, className }: TabsProps<T>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([])

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const enabled = items.map((t, i) => (t.disabled ? -1 : i)).filter((i) => i >= 0)
    const pos = enabled.indexOf(index)
    let next: number | undefined
    if (e.key === 'ArrowRight') next = enabled[(pos + 1) % enabled.length]
    else if (e.key === 'ArrowLeft') next = enabled[(pos - 1 + enabled.length) % enabled.length]
    else if (e.key === 'Home') next = enabled[0]
    else if (e.key === 'End') next = enabled[enabled.length - 1]
    if (next === undefined) return
    e.preventDefault()
    refs.current[next]?.focus()
    onChange(items[next].id)
  }

  return (
    <div role="tablist" aria-label={label} className={cn('flex items-center gap-1 border-b border-border', className)}>
      {items.map((item, i) => {
        const selected = item.id === value
        return (
          <button
            key={item.id}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="tab"
            id={tabId(idBase, item.id)}
            aria-selected={selected}
            aria-controls={panelId(idBase, item.id)}
            tabIndex={selected ? 0 : -1}
            disabled={item.disabled}
            onClick={() => onChange(item.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              'focus-ring relative -mb-px flex h-9 items-center gap-1.5 rounded-t px-2.5 text-sm font-medium text-fg-subtle transition-colors',
              'enabled:is-hover:text-fg disabled:cursor-not-allowed disabled:opacity-50',
              'after:absolute after:inset-x-1 after:bottom-0 after:h-0.5 after:rounded-full after:bg-transparent',
              'aria-selected:text-fg aria-selected:after:bg-accent',
            )}
          >
            {item.label}
            {item.count !== undefined && (
              <span className="tabular rounded-sm bg-surface-3 px-1 text-2xs font-semibold text-fg-muted">{item.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
