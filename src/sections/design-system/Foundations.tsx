import { toHex } from '@/lib/color'
import { useTokens } from '@/hooks/useTokens'
import { Specimen } from './Specimen'

const COLOR_GROUPS = [
  { label: 'Surfaces', tokens: ['bg', 'surface', 'surface-2', 'surface-3', 'border', 'border-strong'] },
  { label: 'Text', tokens: ['fg', 'fg-muted', 'fg-subtle'] },
  { label: 'Accent', tokens: ['accent', 'accent-subtle', 'accent-text'] },
  { label: 'Status', tokens: ['success', 'warning', 'danger'] },
  { label: 'Data', tokens: ['viz-up', 'viz-down', 'viz-ns'] },
] as const

const ALL_TOKENS = COLOR_GROUPS.flatMap((g) => g.tokens)

export function ColorTokens() {
  const [ref, values] = useTokens<HTMLDivElement>(ALL_TOKENS)
  return (
    <Specimen title="Color tokens" description="Semantic names, resolved live from the active theme.">
      <div ref={ref} className="space-y-4">
        {COLOR_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-2 text-xs font-medium text-fg-muted">{group.label}</p>
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {group.tokens.map((t) => {
                const v = values[t]
                return (
                  <li key={t} className="min-w-0">
                    <span className="block h-9 rounded border border-border" style={{ background: `rgb(var(--${t}))` }} />
                    <span className="mt-1 block truncate font-mono text-2xs text-fg">{t}</span>
                    <span className="block font-mono text-2xs uppercase text-fg-subtle">{v ? toHex(v) : '–'}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </Specimen>
  )
}

const TYPE_SCALE = [
  { cls: 'text-3xl font-semibold', name: '3xl', spec: '36 / 42', use: 'Page title' },
  { cls: 'text-2xl font-semibold', name: '2xl', spec: '28 / 34', use: 'Section title' },
  { cls: 'text-xl font-semibold', name: 'xl', spec: '22 / 28', use: 'View title, key figures' },
  { cls: 'text-md', name: 'md', spec: '16 / 26', use: 'Reading text' },
  { cls: 'text-base', name: 'base', spec: '14 / 22', use: 'Default UI text' },
  { cls: 'text-sm', name: 'sm', spec: '13 / 20', use: 'Controls, tables' },
  { cls: 'text-xs', name: 'xs', spec: '12 / 16', use: 'Metadata, hints' },
  { cls: 'text-2xs font-semibold uppercase tracking-[0.06em]', name: '2xs', spec: '11 / 16', use: 'Labels, axis ticks' },
]

export function TypeScale() {
  return (
    <Specimen title="Typography" description="Inter. Product UI sits at 13–14px; prose steps up to 16px.">
      <ul className="divide-y divide-border">
        {TYPE_SCALE.map((t) => (
          <li key={t.name} className="flex items-baseline gap-4 py-2 first:pt-0 last:pb-0">
            <span className="w-24 shrink-0">
              <span className="block font-mono text-2xs text-fg">{t.name}</span>
              <span className="tabular block text-2xs text-fg-subtle">{t.spec}</span>
            </span>
            <span className={`min-w-0 truncate text-fg ${t.cls}`}>{t.use}</span>
          </li>
        ))}
      </ul>
    </Specimen>
  )
}

const SPACING = [
  [1, 4],
  [2, 8],
  [3, 12],
  [4, 16],
  [5, 20],
  [6, 24],
  [8, 32],
  [10, 40],
  [16, 64],
]

export function SpacingScale() {
  return (
    <Specimen title="Spacing" description="4px base. Dense controls use 4–12; layout uses 16–64.">
      <ul className="space-y-1.5">
        {SPACING.map(([step, px]) => (
          <li key={step} className="flex items-center gap-3">
            <span className="tabular w-8 font-mono text-2xs text-fg">{step}</span>
            <span className="tabular w-10 text-2xs text-fg-subtle">{px}px</span>
            <span className="h-2.5 rounded-sm bg-accent/70" style={{ width: px * 2 }} />
          </li>
        ))}
      </ul>
    </Specimen>
  )
}
