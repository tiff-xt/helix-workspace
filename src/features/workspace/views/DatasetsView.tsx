import { Upload } from 'lucide-react'
import { api } from '@/data/api'
import { Alert, Button, Skeleton, StatusIndicator, Table, Td, Th, Tr } from '@/design-system'
import { useAsync } from '@/hooks/useAsync'
import { formatDate, formatInt } from '@/lib/format'
import { ViewHeader } from './GenesView'

export function DatasetsView() {
  const state = useAsync(() => api.getDatasets(), [])
  const failed = state.data?.find((d) => d.status === 'failed')

  return (
    <div className="space-y-5">
      <ViewHeader
        title="Datasets"
        description="Raw inputs for this project. Analyses only run on datasets that are ready."
        actions={
          <Button variant="primary" size="sm" leadingIcon={<Upload className="size-3.5" />}>
            Upload dataset
          </Button>
        }
      />
      {failed && (
        <Alert tone="danger" title={`${failed.name} failed validation`} action={<Button size="sm">Review sample sheet</Button>}>
          {failed.statusDetail}
        </Alert>
      )}
      <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-xs">
        {state.status === 'loading' ? (
          <div role="status" aria-busy="true" aria-label="Loading datasets" className="space-y-2 p-4">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : (
          <Table label="Datasets">
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Status</Th>
                <Th align="right">Samples</Th>
                <Th className="hidden md:table-cell">Conditions</Th>
                <Th align="right" className="hidden sm:table-cell">
                  Size
                </Th>
                <Th className="hidden lg:table-cell">Updated</Th>
              </tr>
            </thead>
            <tbody>
              {state.data?.map((d) => (
                <Tr key={d.id}>
                  <Td className="py-2 text-fg">
                    <span className="block font-medium">{d.name}</span>
                    <span className="block text-xs text-fg-subtle">{d.assay}</span>
                  </Td>
                  <Td className="py-2">
                    <StatusIndicator status={d.status} />
                    {d.status === 'processing' && <span className="mt-1 block text-xs text-fg-subtle">{d.statusDetail}</span>}
                  </Td>
                  <Td align="right">{formatInt(d.samples)}</Td>
                  <Td className="hidden md:table-cell">{d.conditions.join(' vs. ')}</Td>
                  <Td align="right" className="hidden sm:table-cell">
                    {d.sizeMb >= 1000 ? `${(d.sizeMb / 1000).toFixed(1)} GB` : `${d.sizeMb} MB`}
                  </Td>
                  <Td className="hidden lg:table-cell">{formatDate(d.updatedAt)}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  )
}
