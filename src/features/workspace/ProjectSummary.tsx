import { Activity, CheckCircle2, Dna, Users } from 'lucide-react'
import { project } from '@/data/project'
import { AvatarStack, Badge, Skeleton, StatusIndicator } from '@/design-system'
import { formatInt, formatRelative } from '@/lib/format'
import { useWorkspace } from './WorkspaceContext'

function Stat({ label, value, detail, loading }: { label: string; value: string; detail: string; loading?: boolean }) {
  return (
    <div className="min-w-0 bg-surface px-4 py-3">
      <dt className="text-xs font-medium text-fg-subtle">{label}</dt>
      <dd className="tabular mt-1 text-xl font-semibold text-fg">{loading ? <Skeleton className="my-1 h-5 w-16" /> : value}</dd>
      <dd className="mt-0.5 truncate text-xs text-fg-subtle">{detail}</dd>
    </div>
  )
}

export function ProjectSummary() {
  const { counts, genes } = useWorkspace()
  const loading = genes.status !== 'success'
  return (
    <section aria-labelledby="project-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="project-title" className="text-xl font-semibold text-fg">
              {project.name}
            </h2>
            <StatusIndicator status="running" label="Analysis in progress" />
          </div>
          <p className="mt-1 max-w-2xl text-sm text-fg-muted">{project.description}</p>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg-subtle">
            <span className="inline-flex items-center gap-1">
              <Dna aria-hidden className="size-3.5" />
              BRCA-RNAseq-cohort-A
            </span>
            <span className="inline-flex items-center gap-1">
              <Activity aria-hidden className="size-3.5" />
              Updated {formatRelative(project.updatedAt)}
            </span>
            <Badge>{project.organism}</Badge>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Users aria-hidden className="size-3.5 text-fg-subtle" />
          <span className="text-xs text-fg-subtle">{project.collaborators.length} collaborators</span>
          <AvatarStack people={project.collaborators} max={4} />
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border shadow-xs md:grid-cols-4">
        <Stat label="Samples" value="96" detail="48 tumor · 48 normal" />
        <Stat label="Genes tested" value={formatInt(2412)} detail="After count filtering" />
        <Stat
          label="Significant genes"
          value={formatInt(counts.up + counts.down)}
          detail={`${formatInt(counts.up)} up · ${formatInt(counts.down)} down`}
          loading={loading}
        />
        <div className="min-w-0 bg-surface px-4 py-3">
          <dt className="text-xs font-medium text-fg-subtle">Quality control</dt>
          <dd className="mt-1 flex items-center gap-1.5 text-xl font-semibold text-fg">
            <CheckCircle2 aria-hidden className="size-4 text-success" />
            Passed
          </dd>
          <dd className="mt-0.5 truncate text-xs text-fg-subtle">96 of 96 samples</dd>
        </div>
      </dl>
    </section>
  )
}
