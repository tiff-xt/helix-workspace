import { cloneElement, useId, type ReactElement, type ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/cn'

interface FieldProps {
  label: string
  hint?: ReactNode
  error?: string
  /** Visually hide the label (it stays available to assistive tech). */
  hideLabel?: boolean
  className?: string
  children: ReactElement<Record<string, unknown>>
}

/** Wires label, hint and error text to the control with the right ARIA attributes. */
export function Field({ label, hint, error, hideLabel, className, children }: FieldProps) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className={cn('text-sm font-medium text-fg', hideLabel && 'sr-only')}>
        {label}
      </label>
      {cloneElement(children, {
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': [errorId, hintId].filter(Boolean).join(' ') || undefined,
      })}
      {error ? (
        <p id={errorId} className="flex items-center gap-1 text-xs font-medium text-danger">
          <AlertCircle aria-hidden className="size-3.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-fg-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
