import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface SectionProps {
  id: string
  index: string
  title: string
  lede?: ReactNode
  children: ReactNode
  className?: string
  /** Wider sections hold the product demo; prose sections stay at reading width. */
  width?: 'wide' | 'default'
}

export function Section({ id, index, title, lede, children, className, width = 'default' }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn('scroll-mt-16 border-t border-border py-16 sm:py-20', className)}>
      <div className={cn('mx-auto px-4 sm:px-6', width === 'wide' ? 'max-w-[88rem]' : 'max-w-6xl')}>
        <div className="max-w-3xl">
          <p className="tabular text-xs font-semibold text-accent-text">{index}</p>
          <h2 id={`${id}-title`} className="mt-2 text-2xl font-semibold text-fg">
            {title}
          </h2>
          {lede && <div className="mt-3 text-md text-fg-muted">{lede}</div>}
        </div>
        <div className="mt-8 sm:mt-10">{children}</div>
      </div>
    </section>
  )
}

/** A short annotation that sits next to a demo and explains one decision. */
export function Note({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-l-2 border-border pl-4">
      <h3 className="text-sm font-semibold text-fg">{title}</h3>
      <p className="mt-1 text-sm text-fg-muted">{children}</p>
    </div>
  )
}
