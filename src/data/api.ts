/**
 * Mock data service.
 *
 * Every accessor is async and has realistic latency so the UI exercises its
 * loading states. Swap these implementations for real fetch calls and the
 * components don't change.
 */
import type { ActivityItem, AssistantResponse, Dataset, Gene, Project, WorkflowStep } from '@/types'
import { generateGenes } from './genes'
import { activity, datasets, project } from './project'
import { getWorkflow, type WorkflowScenario } from './workflow'
import { answer } from './assistant'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

let geneCache: Gene[] | null = null
const allGenes = () => (geneCache ??= generateGenes())

export const api = {
  async getProject(): Promise<Project> {
    await wait(350)
    return project
  },
  async getDatasets(): Promise<Dataset[]> {
    await wait(500)
    return datasets
  },
  async getActivity(): Promise<ActivityItem[]> {
    await wait(450)
    return activity
  },
  async getGenes(): Promise<Gene[]> {
    await wait(600)
    return allGenes()
  },
  async getWorkflow(scenario: WorkflowScenario): Promise<WorkflowStep[]> {
    await wait(scenario === 'loading' ? 60_000 : 300)
    return getWorkflow(scenario)
  },
  async ask(question: string): Promise<AssistantResponse & { intent: string }> {
    await wait(1400)
    return answer(question, new Map(allGenes().map((g) => [g.id, g])))
  },
}
