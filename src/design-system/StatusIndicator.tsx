import { AlertTriangle, CheckCircle2, Clock3, Loader2, XCircle } from 'lucide-react'
import type { DatasetStatus, StepStatus } from '@/types'
import { Badge, type Tone } from './Badge'

type Status = StepStatus | DatasetStatus | 'warning'

const config: Record<Status, { label: string; tone: Tone; Icon: typeof CheckCircle2; spin?: boolean }> = {
  completed: { label: 'Completed', tone: 'success', Icon: CheckCircle2 },
  ready: { label: 'Ready', tone: 'success', Icon: CheckCircle2 },
  running: { label: 'Running', tone: 'accent', Icon: Loader2, spin: true },
  processing: { label: 'Processing', tone: 'accent', Icon: Loader2, spin: true },
  pending: { label: 'Pending', tone: 'neutral', Icon: Clock3 },
  failed: { label: 'Failed', tone: 'danger', Icon: XCircle },
  warning: { label: 'Needs review', tone: 'warning', Icon: AlertTriangle },
}

/** Status is always icon + text + color, so it survives grayscale, color blindness and screen readers. */
export function StatusIndicator({ status, label }: { status: Status; label?: string }) {
  const { label: defaultLabel, tone, Icon, spin } = config[status]
  return (
    <Badge tone={tone} icon={<Icon aria-hidden className={spin ? 'animate-spin' : undefined} />}>
      {label ?? defaultLabel}
    </Badge>
  )
}
