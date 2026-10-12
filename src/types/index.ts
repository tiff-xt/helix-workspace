/**
 * Domain types. Mock data in src/data conforms to these, so a real API
 * client can replace src/data/api.ts without touching components.
 */

export type ID = string

export interface Person {
  id: ID
  name: string
  role: string
  initials: string
  /** Index into the avatar palette; keeps avatars stable across renders. */
  tone: number
}

export type DatasetStatus = 'ready' | 'processing' | 'failed'

export interface Dataset {
  id: ID
  name: string
  assay: string
  samples: number
  conditions: [string, string]
  sizeMb: number
  status: DatasetStatus
  updatedAt: string
  statusDetail?: string
}

export interface Project {
  id: ID
  name: string
  organism: string
  description: string
  primaryDatasetId: ID
  collaborators: Person[]
  updatedAt: string
}

export type Regulation = 'up' | 'down' | 'ns'

export interface Gene {
  id: ID
  symbol: string
  name: string
  chromosome: string
  log2FoldChange: number
  pValue: number
  /** Benjamini–Hochberg adjusted p-value, computed over the full dataset. */
  padj: number
  baseMean: number
  pathways: string[]
  /** Hand-annotated genes are labelled on the plot and used by the assistant. */
  annotated: boolean
}

export interface Thresholds {
  /** Minimum absolute log2 fold change. */
  log2Fc: number
  /** Maximum p-value. */
  pValue: number
}

export type StepStatus = 'completed' | 'running' | 'pending' | 'failed'

export interface WorkflowStep {
  id: ID
  name: string
  description: string
  status: StepStatus
  /** 0–100, only meaningful while running. */
  progress?: number
  duration?: string
  output?: string
  error?: string
}

export interface ActivityItem {
  id: ID
  actorId: ID
  action: string
  target: string
  at: string
}

export type Confidence = 'high' | 'moderate' | 'exploratory'

export interface AssistantCandidate {
  geneId: ID
  rationale: string
  confidence: Confidence
  confidenceNote: string
  nextAnalysis: string
}

export interface AssistantResponse {
  question: string
  summary: string
  candidates: AssistantCandidate[]
  scope: string[]
  caveat: string
}
