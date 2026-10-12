import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Specimen({
  title,
  description,
  children,
  className,
}: {
  title: string
  description?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-xs', className)}>
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-fg">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-fg-subtle">{description}</p>}
      </div>
      <div className="flex-1 p-4">{children}</div>
    </div>
  )
}

export function StateLabel({ children }: { children: ReactNode }) {
  return <span className="text-2xs font-medium uppercase tracking-[0.06em] text-fg-subtle">{children}</span>
}
