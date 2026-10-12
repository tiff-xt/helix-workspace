import { FileText, Lock } from 'lucide-react'
import { Button, EmptyState } from '@/design-system'
import { ViewHeader } from './GenesView'
import { useWorkspace } from '../WorkspaceContext'

export function ReportsView() {
  const { setView } = useWorkspace()
  return (
    <div className="space-y-5">
      <ViewHeader title="Reports" description="Shareable summaries generated from completed analyses." />
      <div className="rounded-lg border border-dashed border-border-strong bg-surface">
        <EmptyState
          icon={<FileText />}
          title="No reports yet"
          description="Reports are generated from a finished gene prioritization. It’s 64% complete — you can draft one as soon as it finishes."
          action={
            <>
              <Button variant="primary" size="sm" disabled leadingIcon={<Lock className="size-3.5" />}>
                Create report
              </Button>
              <Button size="sm" onClick={() => setView('analyses')}>
                View workflow
              </Button>
            </>
          }
        />
      </div>
    </div>
  )
}
