import type { WorkflowStep } from '@/types'

export type WorkflowScenario = 'in-progress' | 'failed' | 'loading'

const base: WorkflowStep[] = [
  {
    id: 'dataset',
    name: 'Dataset',
    description: 'Count matrix and sample sheet',
    status: 'completed',
    duration: '2m 10s',
    output: '96 samples · 2,412 genes',
  },
  {
    id: 'qc',
    name: 'Quality control',
    description: 'Library size, outliers, batch checks',
    status: 'completed',
    duration: '4m 32s',
    output: '96 of 96 samples passed',
  },
  {
    id: 'de',
    name: 'Differential expression',
    description: 'Tumor vs. adjacent normal',
    status: 'completed',
    duration: '11m 05s',
    output: 'Run 14 · negative binomial model',
  },
  {
    id: 'prioritize',
    name: 'Gene prioritization',
    description: 'Rank by effect size and evidence',
    status: 'running',
    progress: 64,
    output: 'Scoring 1,544 of 2,412 genes',
  },
  {
    id: 'report',
    name: 'Report',
    description: 'Shareable summary for the team',
    status: 'pending',
    output: 'Waits for prioritization',
  },
]

export function getWorkflow(scenario: WorkflowScenario): WorkflowStep[] {
  if (scenario !== 'failed') return base
  return base.map((step) => {
    if (step.id === 'de')
      return {
        ...step,
        status: 'failed',
        duration: '0m 48s',
        output: undefined,
        error: 'Design matrix is not full rank: “batch” is confounded with “condition” for 12 samples. Fix: add batch as a covariate.',
      }
    if (step.id === 'prioritize' || step.id === 'report')
      return { ...step, status: 'pending', progress: undefined, output: 'Blocked by differential expression' }
    return step
  })
}
