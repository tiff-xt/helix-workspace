import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-sm border border-border bg-surface-2 px-1 font-sans text-2xs font-semibold text-fg-muted shadow-xs',
        className,
      )}
    >
      {children}
    </kbd>
  )
}

export function ProgressBar({ value, label, className }: { value: number; label: string; className?: string }) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className={cn('h-1.5 overflow-hidden rounded-full bg-surface-3', className)}
    >
      <div className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out" style={{ width: `${value}%` }} />
    </div>
  )
}

/** Small uppercase label used for metadata groups. */
export function Eyebrow({
  children,
  className,
  as: Tag = 'p',
}: {
  children: ReactNode
  className?: string
  as?: 'p' | 'h3' | 'h4' | 'span' | 'dt'
}) {
  return <Tag className={cn('text-2xs font-semibold uppercase tracking-[0.06em] text-fg-subtle', className)}>{children}</Tag>
}
