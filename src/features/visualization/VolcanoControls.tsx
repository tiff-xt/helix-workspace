import { useState } from 'react'
import { ChevronDown, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react'
import type { Thresholds } from '@/types'
import { Field, IconButton, Input, Select, Switch } from '@/design-system'
import { cn } from '@/lib/cn'

const P_OPTIONS = [0.05, 0.01, 0.001, 0.0001]

interface VolcanoControlsProps {
  query: string
  onQueryChange: (q: string) => void
  onSubmitQuery: () => void
  matchCount: number | null
  thresholds: Thresholds
  onThresholdsChange: (t: Thresholds) => void
  onReset: () => void
  isDefault: boolean
  showLabels: boolean
  onShowLabelsChange: (v: boolean) => void
}

export function VolcanoControls({
  query,
  onQueryChange,
  onSubmitQuery,
  matchCount,
  thresholds,
  onThresholdsChange,
  onReset,
  isDefault,
  showLabels,
  onShowLabelsChange,
}: VolcanoControlsProps) {
  const fill = ((thresholds.log2Fc - 0.5) / 2.5) * 100
  // On phones, thresholds collapse behind a summary so the plot stays near the top.
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,0.8fr)_auto]">
      <Field
        label="Find genes"
        error={matchCount === 0 ? `No genes match “${query}”` : undefined}
        hint={
          matchCount !== null && matchCount > 0
            ? `${matchCount} match${matchCount === 1 ? '' : 'es'} · Enter selects the first`
            : 'Symbol, e.g. TP53 or BRCA'
        }
      >
        <Input
          type="search"
          value={query}
          placeholder="Search symbols"
          autoComplete="off"
          spellCheck={false}
          leadingIcon={<Search />}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSubmitQuery()
            if (e.key === 'Escape' && query) {
              e.stopPropagation()
              onQueryChange('')
            }
          }}
          trailing={
            query ? (
              <IconButton
                size="sm"
                label="Clear search"
                icon={<X className="size-3.5" />}
                showTooltip={false}
                onClick={() => onQueryChange('')}
              />
            ) : undefined
          }
          className="[&::-webkit-search-cancel-button]:hidden"
        />
      </Field>

      <button
        type="button"
        aria-expanded={expanded}
        aria-controls="volcano-thresholds"
        onClick={() => setExpanded((v) => !v)}
        className="focus-ring flex h-8 items-center gap-2 rounded border border-border bg-surface px-2.5 text-sm text-fg-muted shadow-xs sm:hidden"
      >
        <SlidersHorizontal aria-hidden className="size-3.5" />
        <span className="flex-1 text-left">
          Thresholds{' '}
          <span className="tabular text-fg">
            |log₂FC| ≥ {thresholds.log2Fc} · p &lt; {thresholds.pValue}
          </span>
        </span>
        <ChevronDown aria-hidden className={cn('size-3.5 transition-transform', expanded && 'rotate-180')} />
      </button>

      <div id="volcano-thresholds" className={expanded ? 'contents' : 'hidden sm:contents'}>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between">
            <label htmlFor="fc-threshold" className="text-sm font-medium text-fg">
              Min. |log₂ fold change|
            </label>
            <output htmlFor="fc-threshold" className="tabular text-sm font-semibold text-fg">
              {thresholds.log2Fc.toFixed(2)}
            </output>
          </div>
          <input
            id="fc-threshold"
            type="range"
            className="range w-full"
            min={0.5}
            max={3}
            step={0.25}
            value={thresholds.log2Fc}
            aria-valuetext={`${thresholds.log2Fc} log2 fold change, ${(2 ** thresholds.log2Fc).toFixed(1)}-fold`}
            style={{ ['--fill' as string]: `${fill}%` }}
            onChange={(e) => onThresholdsChange({ ...thresholds, log2Fc: Number(e.target.value) })}
          />
          <p className="text-xs text-fg-subtle">≈ {(2 ** thresholds.log2Fc).toFixed(1)}× change in expression</p>
        </div>

        <Field label="Max. p-value" hint="Dashed horizontal line">
          <Select value={thresholds.pValue} onChange={(e) => onThresholdsChange({ ...thresholds, pValue: Number(e.target.value) })}>
            {P_OPTIONS.map((p) => (
              <option key={p} value={p}>
                p &lt; {p}
              </option>
            ))}
          </Select>
        </Field>

        <div className="flex items-end justify-between gap-3 sm:col-span-2 lg:col-span-1 lg:flex-col lg:items-stretch lg:justify-end">
          <Switch label="Gene labels" checked={showLabels} onChange={onShowLabelsChange} className="min-w-[8.5rem]" />
          <IconButton
            label="Reset thresholds"
            variant="secondary"
            icon={<RotateCcw className="size-3.5" />}
            disabled={isDefault}
            onClick={onReset}
            className="lg:self-end"
          />
        </div>
      </div>
    </div>
  )
}
