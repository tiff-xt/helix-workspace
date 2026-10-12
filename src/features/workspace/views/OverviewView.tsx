import { VolcanoPanel } from '@/features/visualization/VolcanoPanel'
import { Card, CardHeader } from '@/design-system'
import { ActivityFeed } from '../ActivityFeed'
import { GeneInspector } from '../GeneInspector'
import { GeneTable } from '../GeneTable'
import { ProjectSummary } from '../ProjectSummary'

/** On wide screens the inspector lives in the shell's right rail; below that it follows the plot. */
export function OverviewView({ inlineInspector }: { inlineInspector: boolean }) {
  return (
    <div className="space-y-5">
      <ProjectSummary />
      <VolcanoPanel />
      {inlineInspector && (
        <Card>
          <CardHeader title="Selected gene" />
          <GeneInspector />
        </Card>
      )}
      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <GeneTable compact pageSize={8} title="Top genes by priority" />
        <ActivityFeed />
      </div>
    </div>
  )
}
