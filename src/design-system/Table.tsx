import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/cn'

export function Table({ className, children, label }: { className?: string; children: ReactNode; label: string }) {
  return (
    <div className={cn('scrollbar-thin overflow-x-auto', className)}>
      <table aria-label={label} className="w-full border-separate border-spacing-0 text-sm">
        {children}
      </table>
    </div>
  )
}

export function Th({ className, align = 'left', ...rest }: ThHTMLAttributes<HTMLTableCellElement> & { align?: 'left' | 'right' }) {
  return (
    <th
      scope="col"
      className={cn(
        'sticky top-0 z-[1] h-8 whitespace-nowrap border-b border-border bg-surface-2 px-3 text-xs font-medium text-fg-subtle',
        align === 'right' ? 'text-right' : 'text-left',
        className,
      )}
      {...rest}
    />
  )
}

export type SortDir = 'asc' | 'desc'

export function SortableTh({
  label,
  active,
  dir,
  onSort,
  align = 'left',
  className,
}: {
  label: string
  active: boolean
  dir: SortDir
  onSort: () => void
  align?: 'left' | 'right'
  className?: string
}) {
  const Icon = !active ? ArrowUpDown : dir === 'asc' ? ArrowUp : ArrowDown
  return (
    <Th align={align} aria-sort={active ? (dir === 'asc' ? 'ascending' : 'descending') : 'none'} className={cn('p-0', className)}>
      <button
        type="button"
        onClick={onSort}
        className={cn(
          'focus-ring inline-flex h-8 w-full items-center gap-1 px-3 is-hover:text-fg',
          align === 'right' && 'justify-end',
          active && 'text-fg',
        )}
      >
        {label}
        <Icon aria-hidden className={cn('size-3', !active && 'opacity-50')} />
      </button>
    </Th>
  )
}

interface TrProps extends HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean
  interactive?: boolean
}

export function Tr({ selected, interactive, className, ...rest }: TrProps) {
  return (
    <tr
      className={cn(
        'group/row transition-colors duration-100',
        interactive && 'cursor-pointer is-hover:bg-surface-2',
        selected && 'bg-accent-subtle/70 is-hover:bg-accent-subtle',
        className,
      )}
      {...rest}
    />
  )
}

export function Td({ className, align = 'left', ...rest }: TdHTMLAttributes<HTMLTableCellElement> & { align?: 'left' | 'right' }) {
  return (
    <td
      className={cn(
        'h-9 whitespace-nowrap border-b border-border px-3 text-fg-muted group-last/row:border-b-0',
        align === 'right' && 'tabular text-right',
        className,
      )}
      {...rest}
    />
  )
}
