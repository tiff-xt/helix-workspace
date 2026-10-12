import { ChevronRight, Menu, Share2 } from 'lucide-react'
import { people } from '@/data/project'
import { AvatarStack, Button, IconButton } from '@/design-system'
import { useWorkspace } from './WorkspaceContext'
import { NAV_ITEMS } from './nav'

export function TopBar({ onOpenNav }: { onOpenNav: () => void }) {
  const { view } = useWorkspace()
  const current = NAV_ITEMS.find((n) => n.id === view)
  return (
    <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border bg-surface px-2 sm:px-3">
      <IconButton
        label="Open navigation"
        icon={<Menu className="size-4" />}
        onClick={onOpenNav}
        className="lg:hidden"
        tooltipSide="bottom"
      />
      <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
        <ol className="flex min-w-0 items-center gap-1 text-sm">
          <li className="hidden truncate text-fg-subtle sm:block">Breast Cancer Expression Study</li>
          <li aria-hidden className="hidden text-fg-subtle sm:block">
            <ChevronRight className="size-3.5" />
          </li>
          <li aria-current="page" className="truncate font-medium text-fg">
            {current?.label}
          </li>
        </ol>
      </nav>
      <div className="hidden items-center gap-2 sm:flex">
        <AvatarStack people={people} max={3} size="sm" />
      </div>
      <Button size="sm" leadingIcon={<Share2 className="size-3.5" />}>
        Share
      </Button>
    </div>
  )
}
