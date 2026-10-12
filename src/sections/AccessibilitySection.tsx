import { Note, Section } from '@/components/Section'
import { Kbd } from '@/design-system'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { ContrastTable } from './accessibility/ContrastTable'
import { GrayscaleDemo } from './accessibility/GrayscaleDemo'

const KEYS: Array<{ keys: string[]; action: string; where: string }> = [
  { keys: ['Tab'], action: 'Move between controls, in reading order', where: 'Everywhere' },
  { keys: ['←', '→'], action: 'Step through significant genes by fold change', where: 'Volcano plot' },
  { keys: ['PgUp', 'PgDn'], action: 'Jump ten genes at a time', where: 'Volcano plot' },
  { keys: ['Enter'], action: 'Select the focused gene', where: 'Volcano plot' },
  { keys: ['Esc'], action: 'Clear selection, close drawer or tooltip', where: 'Plot, drawer, tooltips' },
  { keys: ['←', '→', 'Home', 'End'], action: 'Move between tabs and options', where: 'Tabs, segmented controls' },
]

export function AccessibilitySection() {
  const reducedMotion = useReducedMotion()
  return (
    <Section
      id="accessibility"
      index="05 — Accessibility"
      title="Accessibility is built into the components"
      lede={
        <p>
          Researchers spend hours in tools like this, often on dense screens. Accessibility here isn’t a checklist at the end — it lives in
          the tokens and components, so every screen gets it by default. The parts below are live.
        </p>
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <ContrastTable />
        <div className="grid gap-4">
          <GrayscaleDemo />
          <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-xs">
            <h3 className="border-b border-border px-4 py-3 text-sm font-semibold text-fg">Keyboard support</h3>
            <table className="w-full text-sm">
              <caption className="sr-only">Keyboard shortcuts</caption>
              <thead className="sr-only">
                <tr>
                  <th scope="col">Keys</th>
                  <th scope="col">Action</th>
                  <th scope="col">Where</th>
                </tr>
              </thead>
              <tbody>
                {KEYS.map((k) => (
                  <tr key={k.action} className="border-t border-border first:border-t-0">
                    <td className="whitespace-nowrap px-4 py-2">
                      <span className="flex gap-1">
                        {k.keys.map((key) => (
                          <Kbd key={key}>{key}</Kbd>
                        ))}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-fg-muted">
                      {k.action}
                      <span className="block text-xs text-fg-subtle sm:hidden">{k.where}</span>
                    </td>
                    <td className="hidden px-4 py-2 text-xs text-fg-subtle sm:table-cell">{k.where}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Note title="Visible focus, everywhere">
          One focus ring, defined once in the base styles and used by every component. It’s never removed — try pressing Tab anywhere on
          this page.
        </Note>
        <Note title="A table behind every chart">
          The plot is keyboard navigable and announces each gene, but the gene table holds the same data and selection. Some people will
          always prefer the table.
        </Note>
        <Note title="Semantic structure">
          Landmarks, one heading outline, real tables with sortable headers (aria-sort), native dialog for the mobile drawer, and form
          errors connected with aria-describedby.
        </Note>
        <Note title="Announced changes">
          Async results — assistant answers, workflow retries, pagination — are announced through polite live regions. Loading regions are
          marked aria-busy.
        </Note>
        <Note title="Labels on every control">
          Icon-only buttons require a label in their TypeScript props, so an unlabeled button fails the build rather than the audit.
        </Note>
        <Note title="Reduced motion">
          Transitions are short and only used for state changes. With reduced motion on, they’re removed.{' '}
          <span className="font-medium text-fg">Your system setting: {reducedMotion ? 'reduce motion' : 'no preference'}.</span>
        </Note>
      </div>
    </Section>
  )
}
