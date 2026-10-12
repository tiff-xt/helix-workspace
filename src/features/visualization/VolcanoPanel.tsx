import { useDeferredValue, useMemo, useState } from 'react'
import { Download, Info } from 'lucide-react'
import { Alert, Button, Card, CardHeader, IconButton, Skeleton } from '@/design-system'
import { useWorkspace } from '@/features/workspace/WorkspaceContext'
import { DEFAULT_THRESHOLDS } from '@/features/workspace/constants'
import { VolcanoControls } from './VolcanoControls'
import { VolcanoLegend } from './VolcanoLegend'
import { VolcanoPlot } from './VolcanoPlot'

export function VolcanoPanel() {
  const { genes, regulation, counts, thresholds, setThresholds, selectedId, select } = useWorkspace()
  const [query, setQuery] = useState('')
  const [showLabels, setShowLabels] = useState(true)
  // Typing stays responsive; re-dimming 2,400 points happens at lower priority.
  const deferredQuery = useDeferredValue(query.trim().toUpperCase())

  const matches = useMemo(() => {
    if (!deferredQuery || !genes.data) return null
    return new Set(genes.data.filter((g) => g.symbol.includes(deferredQuery)).map((g) => g.id))
  }, [deferredQuery, genes.data])

  const firstMatch = () => {
    if (!matches || !genes.data) return
    const exact = genes.data.find((g) => g.symbol === deferredQuery)
    const first = exact ?? genes.data.find((g) => matches.has(g.id))
    if (first) select(first.id)
  }

  const isDefault = thresholds.log2Fc === DEFAULT_THRESHOLDS.log2Fc && thresholds.pValue === DEFAULT_THRESHOLDS.pValue

  return (
    <Card>
      <CardHeader
        as="h3"
        title="Differential expression"
        description="Tumor vs. adjacent normal · run 14 · each point is a gene"
        actions={
          <>
            <IconButton
              label="Points top-right and top-left are the strongest, best-supported changes"
              icon={<Info className="size-4" />}
              tooltipSide="bottom"
            />
            <Button size="sm" leadingIcon={<Download className="size-3.5" />} disabled={genes.status !== 'success'}>
              Export
            </Button>
          </>
        }
      />
      <div className="border-b border-border px-4 pb-4 pt-3">
        <VolcanoControls
          query={query}
          onQueryChange={setQuery}
          onSubmitQuery={firstMatch}
          matchCount={matches ? matches.size : null}
          thresholds={thresholds}
          onThresholdsChange={setThresholds}
          onReset={() => setThresholds(DEFAULT_THRESHOLDS)}
          isDefault={isDefault}
          showLabels={showLabels}
          onShowLabelsChange={setShowLabels}
        />
      </div>
      <div className="px-2 pb-3 pt-4 sm:px-4">
        {genes.status === 'loading' && (
          <div aria-busy="true" aria-label="Loading expression results" className="flex h-[300px] flex-col gap-3 sm:h-[400px]">
            <div className="relative flex-1">
              <Skeleton className="absolute inset-0 rounded-md" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="rounded bg-surface px-2 py-1 text-sm text-fg-subtle shadow-xs">Loading 2,412 genes…</span>
              </div>
            </div>
            <Skeleton className="h-4 w-1/2" />
          </div>
        )}
        {genes.status === 'error' && (
          <Alert
            tone="danger"
            title="Couldn’t load expression results"
            live
            action={
              <Button size="sm" onClick={genes.reload}>
                Try again
              </Button>
            }
          >
            {genes.error.message}
          </Alert>
        )}
        {genes.status === 'success' && (
          <>
            <VolcanoPlot
              genes={genes.data}
              regulation={regulation}
              thresholds={thresholds}
              selectedId={selectedId}
              onSelect={select}
              matches={matches}
              showLabels={showLabels}
            />
            <VolcanoLegend counts={counts} className="mt-3 px-2 sm:px-0" />
          </>
        )}
      </div>
    </Card>
  )
}
