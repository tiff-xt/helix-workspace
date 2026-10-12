import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import type { AssistantCandidate, Confidence, Gene } from '@/types'
import { cn } from '@/lib/cn'

const confidenceMeta: Record<Confidence, { label: string; bars: number; cls: string }> = {
  high: { label: 'High confidence', bars: 3, cls: 'bg-success' },
  moderate: { label: 'Moderate confidence', bars: 2, cls: 'bg-accent' },
  exploratory: { label: 'Exploratory', bars: 1, cls: 'bg-warning' },
}

/** Confidence uses a labelled three-step meter, not a fake-precise percentage. */
function ConfidenceMeter({ level, note }: { level: Confidence; note: string }) {
  const { label, bars, cls } = confidenceMeta[level]
  return (
    <div className="flex items-center gap-2 text-xs">
      <span aria-hidden className="flex items-end gap-0.5">
        {[1, 2, 3].map((b) => (
          <span
            key={b}
            className={cn('w-1 rounded-sm', b === 1 ? 'h-1.5' : b === 2 ? 'h-2.5' : 'h-3.5', b <= bars ? cls : 'bg-surface-3')}
          />
        ))}
      </span>
      <span className="font-medium text-fg">{label}</span>
      <span className="text-fg-subtle">· {note}</span>
    </div>
  )
}

export function CandidateCard({
  rank,
  candidate,
  gene,
  actions,
}: {
  rank: number
  candidate: AssistantCandidate
  gene?: Gene
  actions?: ReactNode
}) {
  const direction = gene ? (gene.log2FoldChange > 0 ? 'Up' : 'Down') : null
  return (
    <article className="rounded-md border border-border bg-surface p-3 shadow-xs">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="tabular text-xs font-semibold text-fg-subtle">{rank}</span>
        <h4 className="font-mono text-base font-semibold text-fg">{candidate.geneId}</h4>
        {direction && (
          <span className="text-xs text-fg-subtle">
            {direction}-regulated · chr {gene?.chromosome}
          </span>
        )}
      </div>
      <p className="mt-1.5 text-sm text-fg-muted">{candidate.rationale}</p>
      <div className="mt-2.5">
        <ConfidenceMeter level={candidate.confidence} note={candidate.confidenceNote} />
      </div>
      <p className="mt-2.5 flex gap-1.5 rounded border border-border bg-surface-2 px-2 py-1.5 text-sm text-fg">
        <ArrowRight aria-hidden className="mt-0.5 size-3.5 shrink-0 text-fg-subtle" />
        <span>
          <span className="font-medium">Suggested next analysis: </span>
          {candidate.nextAnalysis}
        </span>
      </p>
      {actions && <div className="-mx-1 mt-2 flex flex-wrap gap-1">{actions}</div>}
    </article>
  )
}
