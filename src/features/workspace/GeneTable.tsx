import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, SearchX, Star } from 'lucide-react'
import type { Gene, Regulation } from '@/types'
import { Button, EmptyState, IconButton, SegmentedControl, Skeleton, SortableTh, Table, Td, Th, Tr, type SortDir } from '@/design-system'
import { formatFc, formatInt, formatP } from '@/lib/format'
import { priorityScore } from '@/lib/genes'
import { cn } from '@/lib/cn'
import { useWorkspace } from './WorkspaceContext'

type Filter = 'significant' | 'up' | 'down' | 'all'
type SortKey = 'priority' | 'symbol' | 'fc' | 'p' | 'baseMean'

const accessor: Record<SortKey, (g: Gene) => number | string> = {
  priority: priorityScore,
  symbol: (g) => g.symbol,
  fc: (g) => g.log2FoldChange,
  p: (g) => g.pValue,
  baseMean: (g) => g.baseMean,
}

const dot: Record<Regulation, string> = { up: 'bg-viz-up', down: 'bg-viz-down', ns: 'bg-viz-ns' }

interface GeneTableProps {
  pageSize?: number
  /** Compact mode trims columns for the overview. */
  compact?: boolean
  title?: string
}

/**
 * The accessible, precise counterpart to the plot: same data, same selection.
 * Paginated so the DOM stays small regardless of dataset size.
 */
export function GeneTable({ pageSize = 12, compact = false, title = 'Genes' }: GeneTableProps) {
  const { genes, regulation, counts, selectedId, select, shortlist } = useWorkspace()
  const [filter, setFilter] = useState<Filter>('significant')
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'priority', dir: 'desc' })
  const [page, setPage] = useState(0)

  const rows = useMemo(() => {
    if (!genes.data) return []
    const filtered = genes.data.filter((g) => {
      const r = regulation.get(g.id)
      if (filter === 'all') return true
      if (filter === 'significant') return r !== 'ns'
      return r === filter
    })
    const get = accessor[sort.key]
    const mult = sort.dir === 'asc' ? 1 : -1
    return filtered.sort((a, b) => {
      const va = get(a)
      const vb = get(b)
      return (typeof va === 'string' ? va.localeCompare(vb as string) : va - (vb as number)) * mult
    })
  }, [genes.data, regulation, filter, sort])

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))
  const safePage = Math.min(page, pageCount - 1)
  const visible = rows.slice(safePage * pageSize, safePage * pageSize + pageSize)

  const toggleSort = (key: SortKey) => {
    setPage(0)
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: key === 'symbol' || key === 'p' ? 'asc' : 'desc' },
    )
  }

  const filters = [
    { value: 'significant' as const, label: `Significant ${formatInt(counts.up + counts.down)}` },
    { value: 'up' as const, label: `Up ${formatInt(counts.up)}` },
    { value: 'down' as const, label: `Down ${formatInt(counts.down)}` },
    { value: 'all' as const, label: 'All' },
  ]

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <h3 className="text-base font-semibold text-fg">{title}</h3>
        <SegmentedControl
          label="Filter genes"
          size="sm"
          options={filters}
          value={filter}
          onChange={(v) => {
            setFilter(v)
            setPage(0)
          }}
        />
      </div>

      {genes.status === 'loading' ? (
        <div aria-busy="true" aria-label="Loading genes" className="space-y-2 border-t border-border p-4">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          className="border-t border-border"
          icon={<SearchX />}
          title="No genes pass these thresholds"
          description="Lower the fold-change or p-value threshold above to include more genes."
        />
      ) : (
        <>
          {/* Desktop/tablet: a real table. */}
          <Table label={`${title}, sorted by ${sort.key}`} className="hidden border-t border-border sm:block">
            <thead>
              <tr>
                <SortableTh label="Gene" active={sort.key === 'symbol'} dir={sort.dir} onSort={() => toggleSort('symbol')} />
                {!compact && <Th className="hidden lg:table-cell">Pathway</Th>}
                <SortableTh label="log₂FC" align="right" active={sort.key === 'fc'} dir={sort.dir} onSort={() => toggleSort('fc')} />
                <SortableTh label="p-value" align="right" active={sort.key === 'p'} dir={sort.dir} onSort={() => toggleSort('p')} />
                {!compact && (
                  <SortableTh
                    label="Mean expr."
                    align="right"
                    active={sort.key === 'baseMean'}
                    dir={sort.dir}
                    onSort={() => toggleSort('baseMean')}
                    className="hidden md:table-cell"
                  />
                )}
                <SortableTh
                  label="Priority"
                  align="right"
                  active={sort.key === 'priority'}
                  dir={sort.dir}
                  onSort={() => toggleSort('priority')}
                />
              </tr>
            </thead>
            <tbody>
              {visible.map((g) => {
                const r = regulation.get(g.id) ?? 'ns'
                const selected = g.id === selectedId
                return (
                  <Tr key={g.id} interactive selected={selected} onClick={() => select(g.id)}>
                    <Td className="text-fg">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          select(g.id)
                        }}
                        aria-pressed={selected}
                        className="focus-ring -mx-1 inline-flex items-center gap-2 rounded px-1 font-mono text-sm font-semibold"
                      >
                        <span aria-hidden className={cn('size-2 shrink-0 rounded-full', dot[r])} />
                        {g.symbol}
                        {shortlist.has(g.id) && <Star aria-label="On shortlist" className="size-3 fill-warning text-warning" />}
                      </button>
                    </Td>
                    {!compact && <Td className="hidden max-w-[12rem] truncate lg:table-cell">{g.pathways[0] ?? '—'}</Td>}
                    <Td align="right" className={cn('font-medium', r === 'up' ? 'text-fg' : r === 'down' ? 'text-fg' : 'text-fg-subtle')}>
                      {formatFc(g.log2FoldChange)}
                    </Td>
                    <Td align="right">{formatP(g.pValue)}</Td>
                    {!compact && (
                      <Td align="right" className="hidden md:table-cell">
                        {formatInt(g.baseMean)}
                      </Td>
                    )}
                    <Td align="right">
                      <PriorityBar value={priorityScore(g)} />
                    </Td>
                  </Tr>
                )
              })}
            </tbody>
          </Table>

          {/* Mobile: the same rows as a list, keeping the hierarchy (gene → effect → evidence). */}
          <ul className="divide-y divide-border border-t border-border sm:hidden" aria-label={title}>
            {visible.map((g) => {
              const r = regulation.get(g.id) ?? 'ns'
              const selected = g.id === selectedId
              return (
                <li key={g.id}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => select(g.id)}
                    className={cn(
                      'focus-ring flex w-full items-center gap-3 px-4 py-2.5 text-left',
                      selected ? 'bg-accent-subtle/70' : 'is-hover:bg-surface-2',
                    )}
                  >
                    <span aria-hidden className={cn('size-2 shrink-0 rounded-full', dot[r])} />
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-sm font-semibold text-fg">{g.symbol}</span>
                      <span className="block truncate text-xs text-fg-subtle">{g.annotated ? g.name : 'Synthetic transcript'}</span>
                    </span>
                    <span className="tabular text-right text-sm">
                      <span className="block font-medium text-fg">{formatFc(g.log2FoldChange)}</span>
                      <span className="block text-xs text-fg-subtle">p {formatP(g.pValue)}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center justify-between gap-2 border-t border-border px-4 py-2 text-xs text-fg-subtle">
            <span className="tabular" aria-live="polite">
              {formatInt(safePage * pageSize + 1)}–{formatInt(Math.min(rows.length, (safePage + 1) * pageSize))} of {formatInt(rows.length)}
            </span>
            <div className="flex items-center gap-1">
              <IconButton
                size="sm"
                label="Previous page"
                icon={<ChevronLeft className="size-4" />}
                disabled={safePage === 0}
                onClick={() => setPage(safePage - 1)}
              />
              <span className="tabular px-1">
                {safePage + 1} / {pageCount}
              </span>
              <IconButton
                size="sm"
                label="Next page"
                icon={<ChevronRight className="size-4" />}
                disabled={safePage >= pageCount - 1}
                onClick={() => setPage(safePage + 1)}
              />
            </div>
          </div>
        </>
      )}
      {genes.status === 'error' && (
        <div className="p-4">
          <Button size="sm" onClick={genes.reload}>
            Retry
          </Button>
        </div>
      )}
    </div>
  )
}

function PriorityBar({ value }: { value: number }) {
  const pct = Math.min(100, (value / 80) * 100)
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden className="hidden h-1.5 w-12 overflow-hidden rounded-full bg-surface-3 xl:block">
        <span className="block h-full rounded-full bg-fg-subtle" style={{ width: `${pct}%` }} />
      </span>
      <span className="tabular w-8 text-right">{value.toFixed(1)}</span>
    </span>
  )
}
