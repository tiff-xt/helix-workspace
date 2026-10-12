export function LogoMark({ className = 'size-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className}>
      <rect width="32" height="32" rx="8" className="fill-accent" />
      <path d="M11 7c0 6 10 6 10 12s-10 6-10 6M21 7c0 6-10 6-10 12" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}
