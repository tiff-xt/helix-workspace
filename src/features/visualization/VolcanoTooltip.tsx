import type { Gene, Regulation } from '@/types'
import { formatFc, formatP } from '@/lib/format'
import { regulationLabel } from '@/lib/genes'
import { cn } from '@/lib/cn'

const swatch: Record<Regulation, string> = { up: 'bg-viz-up', down: 'bg-viz-down', ns: 'bg-viz-ns' }

/** Hover detail. Positioned in the plot's coordinate space and flipped near edges. */
export function VolcanoTooltip({
  gene,
  regulation,
  x,
  y,
  containerWidth,
  selected,
}: {
  gene: Gene
  regulation: Regulation
  x: number
  y: number
  containerWidth: number
  selected: boolean
}) {
  const flipX = x > containerWidth - 200
  const flipY = y < 120
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-10 w-48 animate-fade-in rounded-md border border-border bg-surface p-2.5 text-xs shadow-lg"
      style={{
        left: x,
        top: y,
        transform: `translate(${flipX ? 'calc(-100% - 12px)' : '12px'}, ${flipY ? '12px' : 'calc(-100% - 12px)'})`,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-sm font-semibold text-fg">{gene.symbol}</span>
        {selected && <span className="text-2xs font-medium text-accent-text">Selected</span>}
      </div>
      {gene.annotated && <p className="mt-0.5 line-clamp-1 text-fg-subtle">{gene.name}</p>}
      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
        <dt className="text-fg-subtle">log₂FC</dt>
        <dd className="tabular text-right font-medium text-fg">{formatFc(gene.log2FoldChange)}</dd>
        <dt className="text-fg-subtle">p-value</dt>
        <dd className="tabular text-right font-medium text-fg">{formatP(gene.pValue)}</dd>
        <dt className="text-fg-subtle">adj. p</dt>
        <dd className="tabular text-right font-medium text-fg">{formatP(gene.padj)}</dd>
      </dl>
      <div className="mt-2 flex items-center gap-1.5 border-t border-border pt-2 font-medium text-fg-muted">
        <span className={cn('size-2 rounded-full', swatch[regulation])} />
        {regulationLabel[regulation]}
      </div>
    </div>
  )
}
