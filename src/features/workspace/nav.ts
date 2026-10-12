import { BarChart3, Database, Dna, FileText, LayoutGrid, Settings, type LucideIcon } from 'lucide-react'
import type { WorkspaceView } from './WorkspaceContext'

export const NAV_ITEMS: Array<{ id: WorkspaceView; label: string; Icon: LucideIcon }> = [
  { id: 'overview', label: 'Overview', Icon: LayoutGrid },
  { id: 'datasets', label: 'Datasets', Icon: Database },
  { id: 'analyses', label: 'Analyses', Icon: BarChart3 },
  { id: 'genes', label: 'Genes', Icon: Dna },
  { id: 'reports', label: 'Reports', Icon: FileText },
  { id: 'settings', label: 'Workspace settings', Icon: Settings },
]
