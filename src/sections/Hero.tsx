import { ArrowDown } from 'lucide-react'
import { buttonClasses } from '@/design-system'

const focusAreas = ['Design Systems', 'Data Visualization', 'Interaction Design', 'Accessibility', 'Frontend Architecture']

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="mx-auto max-w-[88rem] px-4 pb-14 pt-12 sm:px-6 sm:pt-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-fg-subtle">Case study · Original concept</p>
          <h1 id="hero-title" className="mt-3 text-3xl font-semibold text-fg">
            Helix Workspace
          </h1>
          <p className="mt-2 text-xl font-normal text-fg-muted">Designing clarity into complex scientific workflows</p>
          <p className="mt-5 text-md text-fg-muted">
            A research tool for inspecting gene-expression results and deciding what to investigate next. I designed and built it end to end
            (the product, the component system and the interactions) to show how I approach dense, technical interfaces.
          </p>
          <p className="mt-3 text-sm text-fg-subtle">
            This is an original, non-proprietary case study. The product, brand, code and data are fictional and were made from scratch for
            this portfolio.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href="#product" className={buttonClasses('primary', 'lg')}>
              Explore the product
              <ArrowDown aria-hidden className="size-4" />
            </a>
            <a href="#decisions" className={buttonClasses('ghost', 'lg')}>
              Read the design decisions
            </a>
          </div>
        </div>

        <dl className="grid gap-4 rounded-lg border border-border bg-surface p-5 text-sm shadow-xs">
          <div>
            <dt className="text-xs font-medium text-fg-subtle">Role</dt>
            <dd className="mt-0.5 font-medium text-fg">Product Design + Frontend Engineering</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-fg-subtle">Focus</dt>
            <dd className="mt-1.5 flex flex-wrap gap-1.5">
              {focusAreas.map((f) => (
                <span key={f} className="rounded-sm border border-border bg-surface-2 px-1.5 py-0.5 text-xs font-medium text-fg-muted">
                  {f}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-fg-subtle">Built with</dt>
            <dd className="mt-0.5 text-fg-muted">React, TypeScript, Tailwind CSS, D3 scales, Vite</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-fg-subtle">Data</dt>
            <dd className="mt-0.5 text-fg-muted">2,412 synthetic genes, generated locally from a fixed seed</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
