import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

const controlClasses = cn(
  'h-8 w-full rounded border border-border bg-surface text-base text-fg shadow-xs outline-none',
  'transition-[border-color,box-shadow] duration-150 placeholder:text-fg-subtle',
  'is-hover:border-border-strong',
  'is-focus:border-accent is-focus:ring-[3px] is-focus:ring-accent/25',
  'aria-[invalid=true]:border-danger aria-[invalid=true]:is-focus:ring-danger/25',
  'disabled:cursor-not-allowed disabled:border-border disabled:bg-surface-3 disabled:text-fg-subtle disabled:shadow-none',
)

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: ReactNode
  trailing?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ leadingIcon, trailing, className, ...rest }, ref) {
  return (
    <div className="relative flex w-full items-center">
      {leadingIcon && (
        <span aria-hidden className="pointer-events-none absolute left-2.5 flex text-fg-subtle [&>svg]:size-3.5">
          {leadingIcon}
        </span>
      )}
      <input ref={ref} className={cn(controlClasses, leadingIcon ? 'pl-8' : 'pl-2.5', trailing ? 'pr-8' : 'pr-2.5', className)} {...rest} />
      {trailing && <span className="absolute right-1 flex">{trailing}</span>}
    </div>
  )
})

/** Native <select>: correct keyboard, screen reader and mobile behavior for free. */
export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select(
  { className, children, ...rest },
  ref,
) {
  return (
    <div className="relative flex w-full items-center">
      <select ref={ref} className={cn(controlClasses, 'cursor-pointer appearance-none pl-2.5 pr-8', className)} {...rest}>
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute right-2.5 size-3.5 text-fg-subtle" />
    </div>
  )
})
