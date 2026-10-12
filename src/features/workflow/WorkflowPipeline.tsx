import { ArrowDown, ArrowRight } from 'lucide-react'
import type { WorkflowStep } from '@/types'
import { Skeleton } from '@/design-system'
import { cn } from '@/lib/cn'
import { WorkflowStepCard } from './WorkflowStepCard'

interface WorkflowPipelineProps {
  steps: WorkflowStep[] | null
  onRetry?: (stepId: string) => void
  className?: string
}

function Connector({ done }: { done: boolean }) {
  return (
    <div aria-hidden className={cn('flex shrink-0 items-center justify-center', done ? 'text-fg-muted' : 'text-border-strong')}>
      <ArrowDown className="size-4 @4xl:hidden" />
      <ArrowRight className="hidden size-4 @4xl:block" />
    </div>
  )
}

/** Linear pipeline. Vertical in narrow containers, horizontal once there's room (container query, not viewport). */
export function WorkflowPipeline({ steps, onRetry, className }: WorkflowPipelineProps) {
  if (!steps) {
    return (
      <div aria-busy="true" aria-label="Loading workflow" className={cn('@container', className)}>
        <div className="flex flex-col gap-2 @4xl:flex-row">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex-1 rounded-lg border border-border bg-surface p-3">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="mt-3 h-4 w-3/4" />
              <Skeleton className="mt-2 h-3 w-full" />
              <Skeleton className="mt-5 h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('@container', className)}>
      <ol aria-label="Analysis workflow" className="flex flex-col gap-1.5 @4xl:flex-row @4xl:gap-1.5">
        {steps.map((step, i) => (
          <li
            key={step.id}
            aria-current={step.status === 'running' || step.status === 'failed' ? 'step' : undefined}
            className="flex min-w-0 flex-1 flex-col items-stretch gap-1.5 @4xl:flex-row @4xl:items-center"
          >
            <div className="min-w-0 flex-1 self-stretch">
              <WorkflowStepCard step={step} index={i} onRetry={onRetry ? () => onRetry(step.id) : undefined} />
            </div>
            {i < steps.length - 1 && <Connector done={step.status === 'completed'} />}
          </li>
        ))}
      </ol>
    </div>
  )
}
