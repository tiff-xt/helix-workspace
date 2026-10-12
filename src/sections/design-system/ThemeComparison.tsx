import { Download } from 'lucide-react'
import { Badge, Button, Input, StatusIndicator } from '@/design-system'
import { cn } from '@/lib/cn'

function Composite() {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-base font-semibold text-fg">ERBB2</p>
          <p className="truncate text-xs text-fg-subtle">Erb-b2 receptor tyrosine kinase 2</p>
        </div>
        <StatusIndicator status="completed" label="Significant" />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
        {[
          ['log₂FC', '+2.60'],
          ['p-value', '1.0e-18'],
          ['Mean', '5,400'],
        ].map(([k, v]) => (
          <div key={k} className="rounded border border-border bg-surface-2 px-2 py-1.5">
            <p className="text-2xs text-fg-subtle">{k}</p>
            <p className="tabular font-semibold text-fg">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <Input aria-label="Note" placeholder="Add a note…" tabIndex={-1} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button variant="primary" size="sm" tabIndex={-1}>
          Add to shortlist
        </Button>
        <Button size="sm" leadingIcon={<Download className="size-3.5" />} tabIndex={-1}>
          Export
        </Button>
        <Badge tone="warning" className="ml-auto">
          Needs review
        </Badge>
      </div>
    </div>
  )
}

/**
 * The same component tree rendered under two theme scopes. Nothing here is
 * theme-specific: [data-theme] swaps the token values and everything follows.
 */
export function ThemeComparison() {
  return (
    <div className="grid overflow-hidden rounded-xl border border-border md:grid-cols-2">
      {(['light', 'dark'] as const).map((theme) => (
        <div
          key={theme}
          data-theme={theme}
          className={cn('bg-bg p-5 text-fg sm:p-6', theme === 'dark' && 'border-t border-border md:border-l md:border-t-0')}
        >
          <p className="mb-3 text-2xs font-semibold uppercase tracking-[0.06em] text-fg-subtle">{theme} theme</p>
          <Composite />
        </div>
      ))}
    </div>
  )
}
