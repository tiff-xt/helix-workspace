import { AlertOctagon, CheckCircle2, Clock3, Loader2, RotateCw } from 'lucide-react'
import type { StepStatus, WorkflowStep } from '@/types'
import { Button, ProgressBar } from '@/design-system'
import { cn } from '@/lib/cn'

const meta: Record<StepStatus, { label: string; Icon: typeof CheckCircle2; card: string; icon: string }> = {
  completed: {
    label: 'Completed',
    Icon: CheckCircle2,
    card: 'border-border bg-surface',
    icon: 'text-success',
  },
  running: {
    label: 'Running',
    Icon: Loader2,
    card: 'border-accent/60 bg-surface ring-[3px] ring-accent/10',
    icon: 'text-accent-text animate-spin',
  },
  pending: {
    label: 'Pending',
    Icon: Clock3,
    card: 'border-dashed border-border-strong bg-surface-2',
    icon: 'text-fg-subtle',
  },
  failed: {
    label: 'Failed',
    Icon: AlertOctagon,
    card: 'border-danger/50 bg-surface ring-[3px] ring-danger/10',
    icon: 'text-danger',
  },
}

interface WorkflowStepCardProps {
  step: WorkflowStep
  index: number
  onRetry?: () => void
}

/**
 * State is carried by four redundant channels: icon shape, a text label,
 * border style (solid / dashed) and color — never color alone.
 */
export function WorkflowStepCard({ step, index, onRetry }: WorkflowStepCardProps) {
  const { label, Icon, card, icon } = meta[step.status]
  const statusText = step.status === 'running' && step.progress !== undefined ? `${label} · ${step.progress}%` : label

  return (
    <article
      aria-label={`Step ${index + 1}: ${step.name}, ${statusText}`}
      className={cn(
        'flex h-full w-full min-w-0 flex-col rounded-lg border p-3 shadow-xs transition-[border-color,box-shadow] duration-200',
        card,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
        <span className="tabular text-2xs font-semibold uppercase tracking-[0.06em] text-fg-subtle">Step {index + 1}</span>
        <span
          className={cn(
            'inline-flex items-center gap-1 text-xs font-medium',
            step.status === 'pending'
              ? 'text-fg-subtle'
              : step.status === 'failed'
                ? 'text-danger'
                : step.status === 'running'
                  ? 'text-accent-text'
                  : 'text-success',
          )}
        >
          <Icon aria-hidden className={cn('size-3.5', icon)} />
          {statusText}
        </span>
      </div>
      <h3 className={cn('mt-2 text-base font-semibold', step.status === 'pending' ? 'text-fg-muted' : 'text-fg')}>{step.name}</h3>
      <p className="mt-0.5 text-sm text-fg-subtle">{step.description}</p>

      <div className="mt-auto pt-3">
        {step.status === 'running' && step.progress !== undefined && (
          <ProgressBar value={step.progress} label={`${step.name} progress`} className="mb-2" />
        )}
        {step.status === 'failed' ? (
          <div className="space-y-2">
            <p className="rounded border border-danger/20 bg-danger-subtle px-2 py-1.5 text-xs text-fg-muted">{step.error}</p>
            {onRetry && (
              <Button size="sm" leadingIcon={<RotateCw className="size-3.5" />} onClick={onRetry} className="w-full">
                Retry with fix
              </Button>
            )}
          </div>
        ) : (
          <div className="text-xs text-fg-subtle">
            <p className="text-fg-muted">{step.output}</p>
            {step.duration && <p className="tabular mt-0.5">Took {step.duration}</p>}
          </div>
        )}
      </div>
    </article>
  )
}
