import { ChevronsUpDown, FlaskConical, Star } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useWorkspace } from './WorkspaceContext'
import { NAV_ITEMS } from './nav'

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { view, setView, shortlist, counts, genes } = useWorkspace()
  const badge: Partial<Record<string, string>> = {
    genes: genes.status === 'success' ? String(counts.up + counts.down) : undefined,
    datasets: '4',
  }

  return (
    <div className="flex h-full flex-col">
      <button type="button" className="focus-ring m-2 flex items-center gap-2 rounded-md px-2 py-1.5 text-left is-hover:bg-surface-3">
        <span className="sr-only">Switch workspace: </span>
        <span aria-hidden className="flex size-6 items-center justify-center rounded bg-fg text-2xs font-bold text-bg">
          OL
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-fg">Okafor Lab</span>
          <span className="block truncate text-2xs text-fg-subtle">Helix Workspace</span>
        </span>
        <ChevronsUpDown aria-hidden className="size-3.5 text-fg-subtle" />
      </button>

      <nav aria-label="Workspace" className="flex-1 px-2 pt-1">
        <ul className="space-y-px">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const active = view === id
            return (
              <li key={id} className={id === 'settings' ? 'mt-4 border-t border-border pt-3' : undefined}>
                <button
                  type="button"
                  aria-current={active ? 'page' : undefined}
                  onClick={() => {
                    setView(id)
                    onNavigate?.()
                  }}
                  className={cn(
                    'focus-ring flex h-8 w-full items-center gap-2.5 rounded px-2 text-sm font-medium transition-colors duration-100',
                    active ? 'bg-surface-3 text-fg' : 'text-fg-muted is-hover:bg-surface-3/70 is-hover:text-fg',
                  )}
                >
                  <Icon aria-hidden className={cn('size-4', active ? 'text-accent-text' : 'text-fg-subtle')} />
                  <span className="flex-1 text-left">{label}</span>
                  {badge[id] && <span className="tabular text-xs text-fg-subtle">{badge[id]}</span>}
                </button>
              </li>
            )
          })}
        </ul>

        <div className="mt-5 px-2">
          <p className="text-2xs font-semibold uppercase tracking-[0.06em] text-fg-subtle">Projects</p>
          <ul className="mt-2 space-y-px">
            <li className="flex h-7 items-center gap-2 text-sm font-medium text-fg">
              <FlaskConical aria-hidden className="size-3.5 text-fg-subtle" />
              <span className="truncate">Breast Cancer Expression</span>
            </li>
            <li className="flex h-7 items-center gap-2 text-sm text-fg-subtle">
              <FlaskConical aria-hidden className="size-3.5" />
              <span className="truncate">Organoid Drug Response</span>
            </li>
          </ul>
        </div>
      </nav>

      <div className="m-2 rounded-md border border-border bg-surface p-2.5">
        <p className="flex items-center gap-1.5 text-xs font-medium text-fg">
          <Star aria-hidden className="size-3.5 text-warning" />
          Shortlist
          <span className="tabular ml-auto text-fg-subtle">{shortlist.size}</span>
        </p>
        <p className="mt-1 truncate font-mono text-xs text-fg-subtle">{shortlist.size ? [...shortlist].join(', ') : 'No genes yet'}</p>
      </div>
    </div>
  )
}
