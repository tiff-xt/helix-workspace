import { Note, Section } from '@/components/Section'
import { WorkflowDemo } from '@/features/workflow/WorkflowDemo'

export function WorkflowSection() {
  return (
    <Section
      id="workflow"
      index="02 · Workflow"
      title="Making pipeline state obvious at a glance"
      lede={
        <p>
          Analyses run as a chain. When something goes wrong, researchers need to know which step failed, why, and what happens to
          everything downstream, without reading logs.
        </p>
      }
    >
      <div className="rounded-xl border border-border bg-bg p-4 shadow-sm sm:p-6">
        <WorkflowDemo />
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <Note title="Four signals per state">
          Each state has its own icon, a text label, a border style and a color. Pending steps use a dashed border, so they read as “not
          yet” even in grayscale.
        </Note>
        <Note title="Failures explain themselves">
          The failed step says what went wrong in plain terms and offers the specific fix. Downstream steps say they’re blocked rather than
          just looking idle.
        </Note>
        <Note title="Layout follows the container">
          Steps sit in a row when there’s room and stack vertically when there isn’t. This uses container queries, so the same component
          works in the app view and on this page.
        </Note>
      </div>
    </Section>
  )
}
