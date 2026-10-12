import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Tooltip } from './Tooltip'

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  /** Required: icon-only controls must have an accessible name. Also shown as the tooltip. */
  label: string
  icon: ReactNode
  size?: 'sm' | 'md'
  variant?: 'ghost' | 'secondary'
  tooltipSide?: 'top' | 'bottom' | 'right'
  showTooltip?: boolean
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, icon, size = 'md', variant = 'ghost', tooltipSide = 'top', showTooltip = true, className, type = 'button', ...rest },
  ref,
) {
  const button = (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      className={cn(
        'focus-ring inline-flex shrink-0 items-center justify-center rounded text-fg-muted transition-colors duration-150',
        'enabled:is-hover:bg-surface-3 enabled:is-hover:text-fg disabled:cursor-not-allowed disabled:text-fg-subtle/60',
        'aria-pressed:bg-accent-subtle aria-pressed:text-accent-text',
        variant === 'secondary' && 'border border-border bg-surface shadow-xs',
        size === 'sm' ? 'size-7' : 'size-8',
        className,
      )}
      {...rest}
    >
      {icon}
    </button>
  )
  return showTooltip ? (
    <Tooltip content={label} side={tooltipSide}>
      {button}
    </Tooltip>
  ) : (
    button
  )
})
