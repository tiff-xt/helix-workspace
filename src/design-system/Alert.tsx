import type { ReactNode } from 'react'
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'
import { cn } from '@/lib/cn'

type AlertTone = 'info' | 'success' | 'warning' | 'danger'

const tones: Record<AlertTone, { cls: string; Icon: typeof Info }> = {
  info: { cls: 'border-border bg-surface-2 [&_.alert-icon]:text-accent-text', Icon: Info },
  success: { cls: 'border-success/25 bg-success-subtle [&_.alert-icon]:text-success', Icon: CheckCircle2 },
  warning: { cls: 'border-warning/30 bg-warning-subtle [&_.alert-icon]:text-warning', Icon: AlertTriangle },
  danger: { cls: 'border-danger/25 bg-danger-subtle [&_.alert-icon]:text-danger', Icon: XCircle },
}

interface AlertProps {
  tone?: AlertTone
  title: string
  children?: ReactNode
  action?: ReactNode
  className?: string
  /** Use for messages that appear in response to an action and must be announced. */
  live?: boolean
}

export function Alert({ tone = 'info', title, children, action, className, live }: AlertProps) {
  const { cls, Icon } = tones[tone]
  return (
    <div
      role={live ? (tone === 'danger' ? 'alert' : 'status') : undefined}
      className={cn('flex gap-2.5 rounded-md border p-3 text-sm', cls, className)}
    >
      <Icon aria-hidden className="alert-icon mt-0.5 size-4 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-fg">{title}</p>
        {children && <div className="mt-0.5 text-fg-muted">{children}</div>}
        {action && <div className="mt-2.5 flex flex-wrap gap-2">{action}</div>}
      </div>
    </div>
  )
}
