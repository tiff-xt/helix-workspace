import { useEffect, useRef, useState } from 'react'
import type { WorkflowStep } from '@/types'
import { getWorkflow, type WorkflowScenario } from '@/data/workflow'
import { SegmentedControl } from '@/design-system'
import { WorkflowPipeline } from './WorkflowPipeline'

const scenarios: Array<{ value: WorkflowScenario; label: string }> = [
  { value: 'in-progress', label: 'In progress' },
  { value: 'failed', label: 'Failed step' },
  { value: 'loading', label: 'Loading' },
]

/**
 * Workflow with a scenario switch so every state can be inspected.
 * Retrying the failed step simulates a real re-run so the transition is visible.
 */
export function WorkflowDemo({ showScenarios = true }: { showScenarios?: boolean }) {
  const [scenario, setScenario] = useState<WorkflowScenario>('in-progress')
  const [steps, setSteps] = useState<WorkflowStep[] | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    window.clearInterval(timer.current)
    setSteps(null)
    if (scenario === 'loading') return
    const t = window.setTimeout(() => setSteps(getWorkflow(scenario)), 350)
    return () => window.clearTimeout(t)
  }, [scenario])

  useEffect(() => () => window.clearInterval(timer.current), [])

  const retry = (stepId: string) => {
    setAnnouncement('Differential expression restarted.')
    setSteps(
      (prev) =>
        prev?.map((s) => (s.id === stepId ? { ...s, status: 'running', progress: 0, error: undefined, output: 'Re-fitting model' } : s)) ??
        null,
    )
    timer.current = window.setInterval(() => {
      setSteps((prev) => {
        if (!prev) return prev
        const step = prev.find((s) => s.id === stepId)
        if (!step || step.status !== 'running') return prev
        const progress = Math.min(100, (step.progress ?? 0) + 20)
        if (progress < 100) return prev.map((s) => (s.id === stepId ? { ...s, progress } : s))
        window.clearInterval(timer.current)
        setAnnouncement('Differential expression completed. Gene prioritization started.')
        return getWorkflow('in-progress').map((s) =>
          s.id === 'prioritize'
            ? { ...s, progress: 8, output: 'Scoring 190 of 2,412 genes' }
            : s.id === 'de'
              ? { ...s, duration: '11m 42s', output: 'Run 15 · batch as covariate' }
              : s,
        )
      })
    }, 450)
  }

  return (
    <div className="space-y-4">
      {showScenarios && (
        <div className="flex flex-wrap items-center gap-3">
          <SegmentedControl label="Workflow scenario" options={scenarios} value={scenario} onChange={setScenario} size="sm" />
          <span className="text-xs text-fg-subtle">Switch scenarios to inspect each state.</span>
        </div>
      )}
      <WorkflowPipeline steps={steps} onRetry={retry} />
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  )
}
