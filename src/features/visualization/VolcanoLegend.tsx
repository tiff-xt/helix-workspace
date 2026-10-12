import type { Regulation } from '@/types'
import { formatInt } from '@/lib/format'
import { cn } from '@/lib/cn'

const items: Array<{ key: Regulation; label: string; swatch: string; hint: string }> = [
  { key: 'up', label: 'Up-regulated', swatch: 'bg-viz-up', hint: 'Higher in tumor' },
  { key: 'down', label: 'Down-regulated', swatch: 'bg-viz-down', hint: 'Lower in tumor' },
  { key: 'ns', label: 'Not significant', swatch: 'bg-viz-ns', hint: 'Below thresholds' },
]

/** Legend doubles as the summary: each category carries its live count. */
export function VolcanoLegend({ counts, className }: { counts: Record<Regulation, number>; className?: string }) {
  return (
    <ul aria-label="Legend" className={cn('flex flex-wrap gap-x-5 gap-y-2', className)}>
      {items.map((item) => (
        <li key={item.key} className="flex items-center gap-2 text-sm">
          <span aria-hidden className={cn('size-2.5 rounded-full', item.swatch)} />
          <span className="font-medium text-fg">{item.label}</span>
          <span className="tabular text-fg-muted">{formatInt(counts[item.key])}</span>
          <span className="hidden text-xs text-fg-subtle sm:inline">· {item.hint}</span>
        </li>
      ))}
    </ul>
  )
}
