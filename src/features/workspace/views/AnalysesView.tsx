import { WorkflowDemo } from '@/features/workflow/WorkflowDemo'
import { StatusIndicator, Table, Td, Th, Tr } from '@/design-system'
import { ViewHeader } from './GenesView'

const runs = [
  { id: 'Run 14', type: 'Differential expression', by: 'Samuel Reyes', status: 'completed' as const, when: 'Today, 14:58' },
  { id: 'Run 13', type: 'Differential expression', by: 'Samuel Reyes', status: 'failed' as const, when: 'Yesterday, 17:12' },
  { id: 'Run 12', type: 'Quality control', by: 'Lin Zhou', status: 'completed' as const, when: 'Oct 11, 10:02' },
]

export function AnalysesView() {
  return (
    <div className="space-y-6">
      <ViewHeader
        title="Analyses"
        description="Each step runs when the one before it succeeds. Failures stop the pipeline instead of producing silent bad results."
      />
      <WorkflowDemo />
      <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-xs">
        <h3 className="px-4 py-3 text-base font-semibold text-fg">Run history</h3>
        <Table label="Run history" className="border-t border-border">
          <thead>
            <tr>
              <Th>Run</Th>
              <Th>Type</Th>
              <Th>Status</Th>
              <Th className="hidden md:table-cell">Started by</Th>
              <Th className="hidden sm:table-cell">When</Th>
            </tr>
          </thead>
          <tbody>
            {runs.map((r) => (
              <Tr key={r.id}>
                <Td className="font-medium text-fg">{r.id}</Td>
                <Td>{r.type}</Td>
                <Td>
                  <StatusIndicator status={r.status} />
                </Td>
                <Td className="hidden md:table-cell">{r.by}</Td>
                <Td className="hidden sm:table-cell">{r.when}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  )
}
