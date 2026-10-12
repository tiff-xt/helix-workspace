import type { Thresholds } from '@/types'

export const DEFAULT_THRESHOLDS: Thresholds = { log2Fc: 1, pValue: 0.01 }

export type WorkspaceView = 'overview' | 'datasets' | 'analyses' | 'genes' | 'reports' | 'settings'
