import { useState } from 'react'
import { Switch, StatusIndicator } from '@/design-system'
import { WorkflowStepCard } from '@/features/workflow/WorkflowStepCard'
import { getWorkflow } from '@/data/workflow'
import { cn } from '@/lib/cn'

const steps = getWorkflow('failed')

export function GrayscaleDemo() {
  const [gray, setGray] = useState(false)
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-fg">Status without color</h3>
        <Switch label="Preview in grayscale" checked={gray} onChange={setGray} className="gap-3" />
      </div>
      <div className={cn('space-y-4 p-4 transition-[filter] duration-300', gray && 'grayscale-preview')}>
        <div className="flex flex-wrap gap-2">
          <StatusIndicator status="completed" />
          <StatusIndicator status="running" />
          <StatusIndicator status="pending" />
          <StatusIndicator status="failed" />
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {[steps[1], steps[2], steps[3]].map((s, i) => (
            <WorkflowStepCard key={s.id} step={s} index={i + 1} />
          ))}
        </div>
      </div>
    </div>
  )
}
