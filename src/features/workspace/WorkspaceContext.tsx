import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Gene, Regulation, Thresholds } from '@/types'
import { api } from '@/data/api'
import { useAsync, type AsyncState } from '@/hooks/useAsync'
import { classify } from '@/lib/genes'
import { DEFAULT_THRESHOLDS, type WorkspaceView } from './constants'

export type { WorkspaceView }

interface WorkspaceContextValue {
  genes: AsyncState<Gene[]> & { reload: () => void }
  byId: Map<string, Gene>
  /** Regulation for every gene under the current thresholds. Computed once per threshold change. */
  regulation: Map<string, Regulation>
  counts: Record<Regulation, number>
  thresholds: Thresholds
  setThresholds: (t: Thresholds) => void
  selectedId: string | null
  select: (id: string | null) => void
  shortlist: Set<string>
  toggleShortlist: (id: string) => void
  view: WorkspaceView
  setView: (v: WorkspaceView) => void
}

const Ctx = createContext<WorkspaceContextValue | null>(null)

/**
 * Shared state for the product demo. Plot, table, inspector and assistant all
 * read the same selection and thresholds, so they can never disagree.
 */
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const genes = useAsync(() => api.getGenes(), [])
  const [thresholds, setThresholds] = useState(DEFAULT_THRESHOLDS)
  const [selectedId, setSelectedId] = useState<string | null>('ERBB2')
  const [shortlist, setShortlist] = useState<Set<string>>(() => new Set(['MKI67']))
  const [view, setView] = useState<WorkspaceView>('overview')

  const list = genes.data
  const byId = useMemo(() => new Map((list ?? []).map((g) => [g.id, g])), [list])

  const { regulation, counts } = useMemo(() => {
    const regulation = new Map<string, Regulation>()
    const counts: Record<Regulation, number> = { up: 0, down: 0, ns: 0 }
    for (const g of list ?? []) {
      const r = classify(g, thresholds)
      regulation.set(g.id, r)
      counts[r]++
    }
    return { regulation, counts }
  }, [list, thresholds])

  const toggleShortlist = useCallback((id: string) => {
    setShortlist((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      genes,
      byId,
      regulation,
      counts,
      thresholds,
      setThresholds,
      selectedId,
      select: setSelectedId,
      shortlist,
      toggleShortlist,
      view,
      setView,
    }),
    [genes, byId, regulation, counts, thresholds, selectedId, shortlist, toggleShortlist, view],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWorkspace() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useWorkspace must be used inside <WorkspaceProvider>')
  return ctx
}
