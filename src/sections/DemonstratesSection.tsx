import { ShieldCheck } from 'lucide-react'
import { Section } from '@/components/Section'

const ITEMS: Array<{ skill: string; where: string; href: string }> = [
  { skill: 'Interaction design', where: 'Linked selection across plot, table and inspector; threshold controls', href: '#product' },
  { skill: 'Component architecture', where: 'Typed, composable primitives shared by every view', href: '#system' },
  { skill: 'Visual hierarchy', where: 'Summary → plot → table → detail on the overview', href: '#product' },
  { skill: 'Design-system thinking', where: 'Tokens, themes and forced-state specimens from one source', href: '#system' },
  { skill: 'Data visualization', where: 'Volcano plot with thresholds, direct labels and keyboard navigation', href: '#product' },
  { skill: 'Responsive behavior', where: 'Drawer navigation, inline inspector, list view on mobile', href: '#product' },
  { skill: 'Accessibility', where: 'Live contrast checks, non-color status, announced updates', href: '#accessibility' },
  { skill: 'Frontend performance', where: 'Quadtree hit-testing, memoized layers, deferred search, pagination', href: '#decisions' },
  {
    skill: 'Product problem → working interface',
    where: 'Workflow failures, AI suggestions and empty states that guide the next step',
    href: '#workflow',
  },
]

export function DemonstratesSection() {
  return (
    <Section id="demonstrates" index="07 · Scope" title="What this demonstrates">
      <ul className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((item) => (
          <li key={item.skill} className="bg-surface">
            <a href={item.href} className="focus-ring group block h-full p-4 -outline-offset-2 transition-colors is-hover:bg-surface-2">
              <span className="block text-sm font-semibold text-fg">{item.skill}</span>
              <span className="mt-1 block text-sm text-fg-muted">{item.where}</span>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex gap-3 rounded-lg border border-border bg-surface-2 p-4 sm:p-5">
        <ShieldCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-fg-subtle" />
        <div>
          <p className="text-base font-medium text-fg">
            This is an original portfolio case study built to demonstrate my design and frontend engineering approach. It does not reproduce
            proprietary screens, code, data, or branding from any former employer.
          </p>
          <p className="mt-2 text-sm text-fg-muted">
            Gene symbols are public names used as labels only. All values are synthetic and generated in the browser. People, labs and
            datasets are fictional.
          </p>
        </div>
      </div>
    </Section>
  )
}
