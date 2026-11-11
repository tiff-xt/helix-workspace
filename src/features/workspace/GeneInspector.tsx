import { Check, Crosshair, FileText, Plus } from 'lucide-react'
import { Badge, Button, EmptyState, Eyebrow, Skeleton } from '@/design-system'
import { formatFc, formatInt, formatP } from '@/lib/format'
import { regulationLabel } from '@/lib/genes'
import { cn } from '@/lib/cn'
import { useWorkspace } from './WorkspaceContext'

const regulationDot = { up: 'bg-viz-up', down: 'bg-viz-down', ns: 'bg-viz-ns' } as const

/** Fold change on a fixed ±5 track, so the effect size can be compared across genes at a glance. */
function EffectBar({ value }: { value: number }) {
  const pct = (Math.min(Math.abs(value), 5) / 5) * 50
  return (
    <div aria-hidden className="relative h-2 rounded-full bg-surface-3">
      <span className="absolute inset-y-[-3px] left-1/2 w-px bg-border-strong" />
      <span
        className={cn('absolute inset-y-0 rounded-full', value >= 0 ? 'bg-viz-up' : 'bg-viz-down')}
        style={value >= 0 ? { left: '50%', width: `${pct}%` } : { right: '50%', width: `${pct}%` }}
      />
    </div>
  )
}

export function GeneInspector({ className }: { className?: string }) {
  const { selectedId, byId, regulation, genes, select, shortlist, toggleShortlist, thresholds } = useWorkspace()
  const gene = selectedId ? byId.get(selectedId) : undefined

  if (genes.status === 'loading') {
    return (
      <div role="status" aria-busy="true" aria-label="Loading gene details" className={cn('space-y-3 p-4', className)}>
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="mt-4 h-16 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (!gene) {
    return (
      <EmptyState
        className={className}
        icon={<Crosshair />}
        title="No gene selected"
        description="Click a point in the plot or a row in the table to see its statistics and context here."
      />
    )
  }

  const reg = regulation.get(gene.id) ?? 'ns'
  const listed = shortlist.has(gene.id)
  const related = genes.data
    ?.filter((g) => g.id !== gene.id && g.pathways.some((p) => gene.pathways.includes(p)) && regulation.get(g.id) !== 'ns')
    .slice(0, 6)

  return (
    <div className={cn('p-4', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-mono text-lg font-semibold text-fg">{gene.symbol}</h3>
          <p className="mt-0.5 text-sm text-fg-subtle">{gene.name}</p>
        </div>
        <Badge className="mt-1" icon={<span aria-hidden className={cn('size-1.5 rounded-full', regulationDot[reg])} />}>
          {regulationLabel[reg]}
        </Badge>
      </div>

      <div className="mt-4 space-y-1.5">
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-fg-subtle">Effect size</span>
          <span className="tabular font-semibold text-fg">
            {formatFc(gene.log2FoldChange)}{' '}
            <span className="font-normal text-fg-subtle">({(2 ** Math.abs(gene.log2FoldChange)).toFixed(1)}×)</span>
          </span>
        </div>
        <EffectBar value={gene.log2FoldChange} />
        <div className="flex justify-between text-2xs text-fg-subtle">
          <span>Lower in tumor</span>
          <span>Higher</span>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border text-sm">
        {[
          ['p-value', formatP(gene.pValue), gene.pValue <= thresholds.pValue ? 'Passes' : 'Above threshold'],
          ['Adjusted p', formatP(gene.padj), 'Benjamini–Hochberg'],
          ['Mean expression', formatInt(gene.baseMean), gene.baseMean < 100 ? 'Low: interpret with care' : 'Normalized counts'],
          ['Chromosome', gene.chromosome, gene.annotated ? 'Annotated' : 'Synthetic'],
        ].map(([label, value, note]) => (
          <div key={label} className="bg-surface p-2.5">
            <dt className="text-xs text-fg-subtle">{label}</dt>
            <dd className="tabular mt-0.5 font-semibold text-fg">{value}</dd>
            <dd className={cn('text-2xs', note.startsWith('Low') || note === 'Above threshold' ? 'text-warning' : 'text-fg-subtle')}>
              {note}
            </dd>
          </div>
        ))}
      </dl>

      {gene.pathways.length > 0 && (
        <div className="mt-4">
          <Eyebrow>Pathways</Eyebrow>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {gene.pathways.map((p) => (
              <Badge key={p}>{p}</Badge>
            ))}
          </div>
        </div>
      )}

      {related && related.length > 0 && (
        <div className="mt-4">
          <Eyebrow>Significant in same pathway</Eyebrow>
          <ul className="mt-1.5 flex flex-wrap gap-1">
            {related.map((g) => (
              <li key={g.id}>
                <button
                  type="button"
                  onClick={() => select(g.id)}
                  className="focus-ring inline-flex h-6 items-center gap-1 rounded-sm border border-border bg-surface px-1.5 font-mono text-xs text-fg-muted is-hover:border-border-strong is-hover:text-fg"
                >
                  <span aria-hidden className={cn('size-1.5 rounded-full', regulation.get(g.id) === 'up' ? 'bg-viz-up' : 'bg-viz-down')} />
                  {g.symbol}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={listed ? 'secondary' : 'primary'}
          aria-pressed={listed}
          leadingIcon={listed ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
          onClick={() => toggleShortlist(gene.id)}
        >
          {listed ? 'On shortlist' : 'Add to shortlist'}
        </Button>
        <Button size="sm" disabled aria-describedby="report-disabled-reason" leadingIcon={<FileText className="size-3.5" />}>
          Add to report
        </Button>
      </div>
      <p id="report-disabled-reason" className="mt-2 text-xs text-fg-subtle">
        Reports unlock when gene prioritization finishes.
      </p>
    </div>
  )
}
