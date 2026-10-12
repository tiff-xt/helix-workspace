import { cn } from '@/lib/cn'

/** Decorative placeholder. The surrounding region should carry aria-busy and a text label. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'block animate-shimmer rounded bg-[length:200%_100%]',
        'bg-[linear-gradient(90deg,rgb(var(--surface-3))_0%,rgb(var(--surface-3))_40%,rgb(var(--surface-2))_50%,rgb(var(--surface-3))_60%,rgb(var(--surface-3))_100%)]',
        className,
      )}
    />
  )
}
