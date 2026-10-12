import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accent-fg shadow-xs enabled:is-hover:bg-accent-hover',
  secondary:
    'border border-border bg-surface text-fg shadow-xs enabled:is-hover:border-border-strong enabled:is-hover:bg-surface-3 aria-pressed:border-accent/40 aria-pressed:bg-accent-subtle aria-pressed:text-accent-text',
  ghost: 'text-fg-muted enabled:is-hover:bg-surface-3 enabled:is-hover:text-fg aria-pressed:bg-accent-subtle aria-pressed:text-accent-text',
  danger: 'bg-danger-solid text-white shadow-xs enabled:is-hover:brightness-110',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-7 gap-1.5 px-2.5 text-sm',
  md: 'h-8 gap-1.5 px-3 text-sm',
  lg: 'h-10 gap-2 px-4 text-base',
}

export const buttonClasses = (variant: ButtonVariant = 'secondary', size: ButtonSize = 'md', className?: string) =>
  cn(
    'focus-ring inline-flex select-none items-center justify-center whitespace-nowrap rounded font-medium',
    'transition-[background-color,border-color,color,box-shadow,filter] duration-150 ease-out',
    'disabled:cursor-not-allowed disabled:border-border disabled:bg-surface-3 disabled:text-fg-subtle disabled:shadow-none',
    variants[variant],
    sizes[size],
    className,
  )
