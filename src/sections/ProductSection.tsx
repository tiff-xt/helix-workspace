import { Monitor, Smartphone, Tablet } from 'lucide-react'
import { Section } from '@/components/Section'
import { WorkspaceShell } from '@/features/workspace/WorkspaceShell'

const breakpoints = [
  {
    Icon: Monitor,
    title: 'Desktop',
    body: 'Three panes: navigation, workspace, inspector. The selected gene stays in view while you scan the plot and table.',
  },
  {
    Icon: Tablet,
    title: 'Tablet',
    body: 'The inspector folds into the page directly under the plot, so selection still has an immediate, visible result.',
  },
  {
    Icon: Smartphone,
    title: 'Mobile',
    body: 'Navigation moves to a drawer and the table becomes a list that keeps the same order: gene, effect, evidence.',
  },
]

export function ProductSection() {
  return (
    <Section
      id="product"
      index="01 · Product"
      title="A workspace for deciding what to investigate next"
      width="wide"
      lede={
        <p>
          A research team has run a tumor-vs-normal expression study and needs to shortlist genes for follow-up. Everything below is
          interactive: select points, change thresholds, search, switch views. Plot, table and inspector share one selection, so they never
          disagree.
        </p>
      }
    >
      <WorkspaceShell />
      <ul className="mt-8 grid gap-6 md:grid-cols-3" aria-label="Responsive behavior">
        {breakpoints.map(({ Icon, title, body }) => (
          <li key={title} className="flex gap-3">
            <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-fg-subtle" />
            <div>
              <h3 className="text-sm font-semibold text-fg">{title}</h3>
              <p className="mt-1 text-sm text-fg-muted">{body}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}
