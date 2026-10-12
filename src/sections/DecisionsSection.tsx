import { Section } from '@/components/Section'

const DECISIONS = [
  {
    title: 'Dense information needs a clear order',
    body: 'Expression results have thousands of rows and a dozen numbers per gene. Showing all of it at once makes nothing stand out. The interface leads with the answer — how many genes changed and in which direction — then the plot, then the table, then the details. Each layer is denser than the one before.',
  },
  {
    title: 'Progressive disclosure keeps the first view calm',
    body: 'Adjusted p-values, pathway context and expression levels matter, but only once you care about a specific gene. They live in the inspector and tooltips. The assistant’s sources sit behind a disclosure. Nothing is hidden that you’d need to make the first decision.',
  },
  {
    title: 'Reusable components made consistency the default',
    body: 'Status always looks the same whether it’s a dataset, a pipeline step or a run. That’s because there is one StatusIndicator, not five similar ones. When the same thing looks the same everywhere, people stop re-reading the interface and start reading the data.',
  },
  {
    title: 'Experts get shortcuts, newcomers get labels',
    body: 'Experienced users can search, adjust thresholds and step through genes with the keyboard. Newer users see plain-language axis hints (“higher in tumor →”), a fold-change slider that also shows the multiplier, and empty states that say what to do next. Neither group pays for the other.',
  },
  {
    title: 'Performance is part of the experience',
    body: 'The plot renders ~2,400 points. Hover uses a quadtree for nearest-point lookups instead of thousands of event listeners. The point layer is memoized so hovering never re-renders it, search input is deferred so typing stays smooth, and tables paginate so the DOM stays small as datasets grow.',
  },
  {
    title: 'Accessibility belongs in the system, not the screen',
    body: 'Contrast is a token decision. Focus styling is a base style. Labels are required props. When accessibility lives in the foundation, each new screen inherits it instead of re-solving it — and audits find fewer surprises.',
  },
  {
    title: 'Shared patterns make the team faster',
    body: 'A new view in this app is mostly composition: a header, a card, a table, a status. Engineers spend their time on what’s new about a feature, and designers can review behavior instead of pixel-pushing. The data layer is behind one async API, so a real backend can replace the mocks without UI changes.',
  },
]

export function DecisionsSection() {
  return (
    <Section
      id="decisions"
      index="06 — Design decisions"
      title="Design decisions"
      lede={<p>The reasoning behind what you’ve seen above, in brief.</p>}
    >
      <ol className="grid gap-x-10 gap-y-8 md:grid-cols-2">
        {DECISIONS.map((d, i) => (
          <li key={d.title} className="flex gap-4">
            <span className="tabular mt-0.5 text-sm font-semibold text-fg-subtle">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3 className="text-md font-semibold text-fg">{d.title}</h3>
              <p className="mt-1.5 text-base leading-relaxed text-fg-muted">{d.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}
