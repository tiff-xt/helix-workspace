const integer = new Intl.NumberFormat('en-US')

export const formatInt = (n: number) => integer.format(n)

export const formatFc = (n: number) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n).toFixed(2)}`

/** Scientific notation for small p-values, fixed for readable ones. */
export function formatP(p: number): string {
  if (p >= 0.001) return p.toFixed(3)
  const [mantissa, exponent] = p.toExponential(1).split('e')
  return `${mantissa}e${exponent.replace('+', '')}`
}

export const negLog10 = (p: number) => -Math.log10(Math.max(p, 1e-300))

export function formatRelative(iso: string, now = new Date('2026-10-12T16:00:00Z')): string {
  const diff = (now.getTime() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`
  const days = Math.round(diff / 86400)
  return days === 1 ? 'yesterday' : `${days}d ago`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
