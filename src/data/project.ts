import type { ActivityItem, Dataset, Person, Project } from '@/types'

export const people: Person[] = [
  { id: 'p1', name: 'Dr. Maya Okafor', role: 'Principal investigator', initials: 'MO', tone: 0 },
  { id: 'p2', name: 'Lin Zhou', role: 'Computational biologist', initials: 'LZ', tone: 1 },
  { id: 'p3', name: 'Samuel Reyes', role: 'Bioinformatics engineer', initials: 'SR', tone: 2 },
  { id: 'p4', name: 'Priya Natarajan', role: 'Postdoctoral researcher', initials: 'PN', tone: 3 },
  { id: 'p5', name: 'Jonas Weber', role: 'Lab manager', initials: 'JW', tone: 4 },
]

export const project: Project = {
  id: 'prj-brca-expr',
  name: 'Breast Cancer Expression Study',
  organism: 'Homo sapiens',
  description: 'Tumor vs. adjacent normal tissue, bulk RNA-seq. Goal: shortlist genes for follow-up validation.',
  primaryDatasetId: 'ds-01',
  collaborators: people,
  updatedAt: '2026-10-12T15:42:00Z',
}

export const datasets: Dataset[] = [
  {
    id: 'ds-01',
    name: 'BRCA-RNAseq-cohort-A',
    assay: 'Bulk RNA-seq',
    samples: 96,
    conditions: ['Tumor', 'Adjacent normal'],
    sizeMb: 4820,
    status: 'ready',
    updatedAt: '2026-10-11T09:14:00Z',
  },
  {
    id: 'ds-02',
    name: 'BRCA-RNAseq-cohort-B',
    assay: 'Bulk RNA-seq',
    samples: 64,
    conditions: ['Tumor', 'Adjacent normal'],
    sizeMb: 3110,
    status: 'processing',
    updatedAt: '2026-10-12T15:20:00Z',
    statusDetail: 'Aligning reads · 41 of 64 samples',
  },
  {
    id: 'ds-03',
    name: 'Organoid-drug-response',
    assay: 'Bulk RNA-seq',
    samples: 24,
    conditions: ['Treated', 'Vehicle'],
    sizeMb: 960,
    status: 'failed',
    updatedAt: '2026-10-10T18:03:00Z',
    statusDetail: 'Sample sheet references 3 FASTQ files that were not uploaded.',
  },
  {
    id: 'ds-04',
    name: 'Clinical-metadata-v2',
    assay: 'Sample metadata',
    samples: 160,
    conditions: ['Cohort A', 'Cohort B'],
    sizeMb: 2,
    status: 'ready',
    updatedAt: '2026-10-04T11:30:00Z',
  },
]

export const activity: ActivityItem[] = [
  { id: 'a1', actorId: 'p2', action: 'started', target: 'Gene prioritization', at: '2026-10-12T15:42:00Z' },
  { id: 'a2', actorId: 'p3', action: 'completed', target: 'Differential expression · run 14', at: '2026-10-12T14:58:00Z' },
  { id: 'a3', actorId: 'p1', action: 'commented on', target: 'ERBB2 in volcano plot', at: '2026-10-12T11:05:00Z' },
  { id: 'a4', actorId: 'p4', action: 'uploaded', target: 'BRCA-RNAseq-cohort-B', at: '2026-10-11T17:31:00Z' },
  { id: 'a5', actorId: 'p3', action: 'passed', target: 'Quality control · 96 of 96 samples', at: '2026-10-11T10:02:00Z' },
]
