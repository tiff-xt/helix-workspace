import type { ReactNode } from 'react'
import { Card, CardHeader } from '@/design-system'
import { GeneInspector } from '../GeneInspector'
import { GeneTable } from '../GeneTable'

export function GenesView({ inlineInspector }: { inlineInspector: boolean }) {
  return (
    <div className="space-y-5">
      <ViewHeader title="Genes" description="Every gene tested in run 14, filtered by the thresholds set on the overview." />
      <GeneTable pageSize={15} title="Gene results" />
      {inlineInspector && (
        <Card>
          <CardHeader title="Selected gene" />
          <GeneInspector />
        </Card>
      )}
    </div>
  )
}

export function ViewHeader({ title, description, actions }: { title: string; description: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold text-fg">{title}</h2>
        <p className="mt-1 text-sm text-fg-muted">{description}</p>
      </div>
      {actions}
    </div>
  )
}
