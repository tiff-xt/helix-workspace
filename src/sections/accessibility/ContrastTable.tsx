import { CheckCircle2, AlertTriangle } from 'lucide-react'
import { contrast } from '@/lib/color'
import { useTokens } from '@/hooks/useTokens'
import { useTheme } from '@/hooks/useTheme'

const PAIRS = [
  { fg: 'fg', bg: 'surface', use: 'Primary text', min: 4.5 },
  { fg: 'fg-muted', bg: 'surface', use: 'Secondary text', min: 4.5 },
  { fg: 'fg-subtle', bg: 'bg', use: 'Hints, metadata (worst surface)', min: 4.5 },
  { fg: 'accent-text', bg: 'surface', use: 'Links, selected text', min: 4.5 },
  { fg: 'accent-fg', bg: 'accent', use: 'Primary button label', min: 4.5 },
  { fg: 'danger', bg: 'danger-subtle', use: 'Error text on tint', min: 4.5 },
  { fg: 'success', bg: 'success-subtle', use: 'Success text on tint', min: 4.5 },
  { fg: 'warning', bg: 'warning-subtle', use: 'Warning text on tint', min: 4.5 },
  { fg: 'ring', bg: 'surface', use: 'Focus ring (non-text)', min: 3 },
] as const

const TOKENS = [...new Set(PAIRS.flatMap((p) => [p.fg, p.bg]))]

/** Ratios are computed in the browser from the live tokens — they update when you switch themes. */
export function ContrastTable() {
  const [ref, values] = useTokens<HTMLDivElement>(TOKENS)
  const { resolved } = useTheme()
  return (
    <div ref={ref} className="overflow-hidden rounded-lg border border-border bg-surface shadow-xs">
      <div className="flex items-baseline justify-between gap-3 border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-fg">Contrast, measured live</h3>
        <span className="text-xs text-fg-subtle">{resolved} theme · WCAG 2.2</span>
      </div>
      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full text-sm">
          <caption className="sr-only">Contrast ratios for token pairs in the current theme</caption>
          <thead>
            <tr className="text-left text-xs text-fg-subtle">
              <th scope="col" className="px-4 py-2 font-medium">
                Sample
              </th>
              <th scope="col" className="px-2 py-2 font-medium">
                Used for
              </th>
              <th scope="col" className="px-2 py-2 text-right font-medium">
                Ratio
              </th>
              <th scope="col" className="px-4 py-2 font-medium">
                Result
              </th>
            </tr>
          </thead>
          <tbody>
            {PAIRS.map((p) => {
              const a = values[p.fg]
              const b = values[p.bg]
              const ratio = a && b ? contrast(a, b) : null
              const pass = ratio !== null && ratio >= p.min
              return (
                <tr key={`${p.fg}-${p.bg}`} className="border-t border-border">
                  <td className="px-4 py-2">
                    <span
                      className="inline-flex h-6 w-10 items-center justify-center rounded-sm border border-border text-xs font-semibold"
                      style={{ color: `rgb(var(--${p.fg}))`, background: `rgb(var(--${p.bg}))` }}
                    >
                      Aa
                    </span>
                  </td>
                  <td className="px-2 py-2 text-fg-muted">
                    {p.use}
                    <span className="block font-mono text-2xs text-fg-subtle">
                      {p.fg} / {p.bg}
                    </span>
                  </td>
                  <td className="tabular px-2 py-2 text-right font-semibold text-fg">{ratio ? `${ratio.toFixed(1)}:1` : '–'}</td>
                  <td className="px-4 py-2">
                    {ratio !== null && (
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${pass ? 'text-success' : 'text-warning'}`}>
                        {pass ? <CheckCircle2 aria-hidden className="size-3.5" /> : <AlertTriangle aria-hidden className="size-3.5" />}
                        {pass ? `Pass (≥ ${p.min})` : `Below ${p.min}`}
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
