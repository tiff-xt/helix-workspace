import { cloneElement, isValidElement, useEffect, useId, useState, type ReactElement, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface TooltipProps {
  content: ReactNode
  side?: 'top' | 'bottom' | 'right'
  children: ReactElement<Record<string, unknown>>
  className?: string
}

const sideClasses = {
  top: 'bottom-full left-1/2 mb-1.5 -translate-x-1/2',
  bottom: 'top-full left-1/2 mt-1.5 -translate-x-1/2',
  right: 'left-full top-1/2 ml-1.5 -translate-y-1/2',
}

/**
 * Accessible tooltip: opens on hover *and* keyboard focus, closes on Escape,
 * and is linked to its trigger with aria-describedby. Supplementary text only —
 * anything essential belongs in the visible UI.
 */
export function Tooltip({ content, side = 'top', children, className }: TooltipProps) {
  const id = useId()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (!isValidElement(children)) return children

  return (
    <span
      className={cn('relative inline-flex', className)}
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocus={(e) => e.target.matches(':focus-visible') && setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {cloneElement(children, { 'aria-describedby': id })}
      <span
        role="tooltip"
        id={id}
        className={cn(
          'pointer-events-none absolute z-50 w-max max-w-[16rem] rounded bg-fg px-2 py-1 text-xs font-medium text-bg shadow-md',
          sideClasses[side],
          open ? 'visible animate-fade-in' : 'invisible',
        )}
      >
        {content}
      </span>
    </span>
  )
}
