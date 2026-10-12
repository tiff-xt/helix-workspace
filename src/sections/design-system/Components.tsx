import { useState } from 'react'
import { Bell, Download, Filter, Inbox, MoreHorizontal, Plus, Search, Trash2 } from 'lucide-react'
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  Field,
  IconButton,
  Input,
  Kbd,
  SegmentedControl,
  Select,
  Skeleton,
  StatusIndicator,
  Table,
  Td,
  Th,
  Tr,
  Tabs,
  panelId,
  tabId,
  type ButtonVariant,
} from '@/design-system'
import { Specimen, StateLabel } from './Specimen'

const STATES = [
  { label: 'Default', props: {} },
  { label: 'Hover', props: { 'data-demo': 'hover' } },
  { label: 'Focus', props: { 'data-demo': 'focus' } },
  { label: 'Disabled', props: { disabled: true } },
  { label: 'Loading', props: { loading: true } },
] as const

const VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'ghost', 'danger']

export function ButtonMatrix() {
  return (
    <Specimen
      title="Buttons"
      description="Every state below is rendered by the production component — forced with a data attribute, not restyled."
      className="lg:col-span-2"
    >
      <div className="scrollbar-thin -mx-4 overflow-x-auto px-4">
        <table className="w-full min-w-[34rem] border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="w-24 text-left">
                <span className="sr-only">Variant</span>
              </th>
              {STATES.map((s) => (
                <th key={s.label} scope="col" className="text-left font-normal">
                  <StateLabel>{s.label}</StateLabel>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {VARIANTS.map((v) => (
              <tr key={v}>
                <th scope="row" className="text-left font-mono text-2xs font-normal text-fg-muted">
                  {v}
                </th>
                {STATES.map((s) => (
                  <td key={s.label}>
                    <Button variant={v} {...s.props} tabIndex={-1}>
                      {v === 'danger' ? 'Delete' : 'Run analysis'}
                    </Button>
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row" className="text-left font-mono text-2xs font-normal text-fg-muted">
                icon
              </th>
              {STATES.slice(0, 4).map((s) => (
                <td key={s.label}>
                  <IconButton label="Filter" icon={<Filter className="size-4" />} {...s.props} tabIndex={-1} showTooltip={false} />
                </td>
              ))}
              <td>
                <IconButton label="Filter (selected)" icon={<Filter className="size-4" />} aria-pressed tabIndex={-1} showTooltip={false} />
                <span className="ml-1 text-2xs text-fg-subtle">selected</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
        <span className="mr-1 text-xs text-fg-subtle">Live:</span>
        <Button variant="primary" leadingIcon={<Plus className="size-3.5" />}>
          New analysis
        </Button>
        <Button leadingIcon={<Download className="size-3.5" />}>Export</Button>
        <Button variant="ghost">Cancel</Button>
        <IconButton label="More actions" icon={<MoreHorizontal className="size-4" />} />
        <IconButton label="Delete" icon={<Trash2 className="size-4" />} variant="secondary" />
      </div>
    </Specimen>
  )
}

export function InputStates() {
  return (
    <Specimen title="Inputs & selects" description="Labels are always visible. Errors say how to fix the problem.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Default" hint="Gene symbol">
          <Input placeholder="e.g. TP53" leadingIcon={<Search />} />
        </Field>
        <Field label="Hover">
          <Input placeholder="e.g. TP53" data-demo="hover" tabIndex={-1} />
        </Field>
        <Field label="Focus">
          <Input defaultValue="BRCA" data-demo="focus" tabIndex={-1} />
        </Field>
        <Field label="Error" error="Use a value between 0 and 1">
          <Input defaultValue="1.4" />
        </Field>
        <Field label="Disabled" hint="Locked after alignment">
          <Input defaultValue="GRCh38" disabled />
        </Field>
        <Field label="Select">
          <Select defaultValue="0.01">
            <option value="0.05">p &lt; 0.05</option>
            <option value="0.01">p &lt; 0.01</option>
            <option value="0.001">p &lt; 0.001</option>
          </Select>
        </Field>
      </div>
    </Specimen>
  )
}

export function NavigationSpecimen() {
  const [tab, setTab] = useState<'results' | 'qc' | 'notes'>('results')
  const [range, setRange] = useState<'7d' | '30d' | 'all'>('30d')
  return (
    <Specimen title="Tabs & segmented controls" description="Arrow keys move between options; Tab moves past the group.">
      <Tabs
        idBase="ds-tabs"
        label="Analysis sections"
        value={tab}
        onChange={setTab}
        items={[
          { id: 'results', label: 'Results', count: 142 },
          { id: 'qc', label: 'Quality control' },
          { id: 'notes', label: 'Notes', disabled: true },
        ]}
      />
      <div role="tabpanel" id={panelId('ds-tabs', tab)} aria-labelledby={tabId('ds-tabs', tab)} className="py-3 text-sm text-fg-muted">
        {tab === 'results' ? '142 genes pass the current thresholds.' : '96 of 96 samples passed quality control.'}
      </div>
      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
        <SegmentedControl
          label="Time range"
          value={range}
          onChange={setRange}
          options={[
            { value: '7d', label: '7 days' },
            { value: '30d', label: '30 days' },
            { value: 'all', label: 'All time' },
          ]}
        />
        <span className="flex items-center gap-1 text-xs text-fg-subtle">
          <Kbd>←</Kbd>
          <Kbd>→</Kbd> to change
        </span>
      </div>
    </Specimen>
  )
}

export function BadgeSpecimen() {
  return (
    <Specimen title="Badges & status" description="Status pairs an icon and a word with color.">
      <div className="flex flex-wrap gap-2">
        <Badge>Neutral</Badge>
        <Badge tone="accent">Accent</Badge>
        <Badge tone="success">Success</Badge>
        <Badge tone="warning">Warning</Badge>
        <Badge tone="danger">Danger</Badge>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <StatusIndicator status="completed" />
        <StatusIndicator status="running" />
        <StatusIndicator status="pending" />
        <StatusIndicator status="failed" />
        <StatusIndicator status="warning" />
      </div>
    </Specimen>
  )
}

export function AlertSpecimen() {
  return (
    <Specimen title="Alerts" description="Title states the outcome; body says what to do next.">
      <div className="space-y-2">
        <Alert tone="info" title="Thresholds changed">
          142 genes are now significant (was 118).
        </Alert>
        <Alert tone="success" title="Report shared with 4 collaborators" />
        <Alert tone="warning" title="12 samples have low library size">
          Results for low-count genes may be unstable.
        </Alert>
        <Alert tone="danger" title="Run 13 failed" action={<Button size="sm">View details</Button>}>
          Batch is confounded with condition.
        </Alert>
      </div>
    </Specimen>
  )
}

export function CardTooltipSpecimen() {
  return (
    <Specimen title="Cards & tooltips" description="Tooltips open on hover and keyboard focus, and close with Escape.">
      <Card>
        <CardHeader
          title="Quality control"
          description="Run 12 · 4m 32s"
          actions={<IconButton label="Notifications for this step are on" icon={<Bell className="size-4" />} />}
        />
        <CardBody className="pt-3">
          <dl className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <dt className="text-xs text-fg-subtle">Samples</dt>
              <dd className="tabular font-semibold text-fg">96</dd>
            </div>
            <div>
              <dt className="text-xs text-fg-subtle">Outliers</dt>
              <dd className="tabular font-semibold text-fg">0</dd>
            </div>
            <div>
              <dt className="text-xs text-fg-subtle">Status</dt>
              <dd>
                <StatusIndicator status="completed" />
              </dd>
            </div>
          </dl>
        </CardBody>
      </Card>
    </Specimen>
  )
}

export function TableSpecimen() {
  return (
    <Specimen title="Table rows" description="Selection uses a tint and a pressed button, not color alone.">
      <div className="overflow-hidden rounded-md border border-border">
        <Table label="Row states">
          <thead>
            <tr>
              <Th>Gene</Th>
              <Th align="right">log₂FC</Th>
              <Th>State</Th>
            </tr>
          </thead>
          <tbody>
            <Tr interactive>
              <Td className="font-mono font-semibold text-fg">MYC</Td>
              <Td align="right">+2.18</Td>
              <Td>Default</Td>
            </Tr>
            <Tr interactive data-demo="hover">
              <Td className="font-mono font-semibold text-fg">EGFR</Td>
              <Td align="right">+1.82</Td>
              <Td>Hover</Td>
            </Tr>
            <Tr interactive selected>
              <Td className="font-mono font-semibold text-fg">ERBB2</Td>
              <Td align="right">+2.60</Td>
              <Td className="font-medium text-accent-text">Selected</Td>
            </Tr>
          </tbody>
        </Table>
      </div>
    </Specimen>
  )
}

export function LoadingEmptySpecimen() {
  return (
    <Specimen title="Loading & empty" description="Skeletons match the final layout; empty states explain why." className="lg:col-span-2">
      <div className="grid gap-3 sm:grid-cols-2">
        <div aria-busy="true" aria-label="Loading example" className="rounded-md border border-border p-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-3 h-3 w-full" />
          <Skeleton className="mt-1.5 h-3 w-4/5" />
          <Skeleton className="mt-4 h-16 w-full" />
        </div>
        <div className="rounded-md border border-dashed border-border-strong">
          <EmptyState className="py-6" icon={<Inbox />} title="No reports yet" description="Reports appear when an analysis finishes." />
        </div>
      </div>
    </Specimen>
  )
}
