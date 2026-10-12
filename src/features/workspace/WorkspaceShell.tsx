import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { IconButton } from '@/design-system'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { GeneInspector } from './GeneInspector'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { useWorkspace, type WorkspaceView } from './WorkspaceContext'
import { AnalysesView } from './views/AnalysesView'
import { DatasetsView } from './views/DatasetsView'
import { GenesView } from './views/GenesView'
import { OverviewView } from './views/OverviewView'
import { ReportsView } from './views/ReportsView'
import { SettingsView } from './views/SettingsView'

const VIEWS_WITH_INSPECTOR: WorkspaceView[] = ['overview', 'genes']

/** Mobile navigation drawer built on <dialog>: focus containment, Escape and inert background come from the platform. */
function NavDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return (
    <dialog
      ref={ref}
      aria-label="Workspace navigation"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-0 h-full max-h-none w-72 max-w-[85vw] border-r border-border bg-surface-2 p-0 text-fg shadow-lg backdrop:bg-black/40"
    >
      <div className="flex h-full flex-col">
        <div className="flex justify-end p-2 pb-0">
          <IconButton label="Close navigation" icon={<X className="size-4" />} onClick={onClose} showTooltip={false} />
        </div>
        <div className="min-h-0 flex-1">
          <Sidebar onNavigate={onClose} />
        </div>
      </div>
    </dialog>
  )
}

export function WorkspaceShell() {
  const { view } = useWorkspace()
  const [navOpen, setNavOpen] = useState(false)
  const isXl = useMediaQuery('(min-width: 1280px)')
  const mainRef = useRef<HTMLDivElement>(null)
  const hasInspector = VIEWS_WITH_INSPECTOR.includes(view)
  const railInspector = isXl && hasInspector

  // Changing views resets scroll, like a page navigation would.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 })
  }, [view])

  return (
    <div className="flex overflow-hidden rounded-xl border border-border bg-bg shadow-lg lg:h-[min(860px,calc(100vh-7rem))] lg:min-h-[640px]">
      <aside aria-label="Sidebar" className="hidden w-56 shrink-0 border-r border-border bg-surface-2 lg:block">
        <Sidebar />
      </aside>
      <NavDrawer open={navOpen} onClose={() => setNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onOpenNav={() => setNavOpen(true)} />
        <div className="flex min-h-0 flex-1">
          <div
            ref={mainRef}
            role="region"
            aria-label="Workspace content"
            className="scrollbar-thin min-w-0 flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6"
          >
            {view === 'overview' && <OverviewView inlineInspector={!isXl} />}
            {view === 'datasets' && <DatasetsView />}
            {view === 'analyses' && <AnalysesView />}
            {view === 'genes' && <GenesView inlineInspector={!isXl} />}
            {view === 'reports' && <ReportsView />}
            {view === 'settings' && <SettingsView />}
          </div>
          {railInspector && (
            <aside aria-label="Gene inspector" className="scrollbar-thin w-80 shrink-0 overflow-y-auto border-l border-border bg-surface">
              <div className="flex h-11 items-center border-b border-border px-4">
                <h2 className="text-sm font-semibold text-fg">Inspector</h2>
              </div>
              <GeneInspector />
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
