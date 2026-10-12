import type { Gene, Regulation, Thresholds } from '@/types'

export function classify(gene: Gene, t: Thresholds): Regulation {
  if (gene.pValue > t.pValue || Math.abs(gene.log2FoldChange) < t.log2Fc) return 'ns'
  return gene.log2FoldChange > 0 ? 'up' : 'down'
}

export const regulationLabel: Record<Regulation, string> = {
  up: 'Up-regulated',
  down: 'Down-regulated',
  ns: 'Not significant',
}

/** A single sortable "how interesting is this" score: effect size weighted by evidence. */
export const priorityScore = (g: Gene) => Math.abs(g.log2FoldChange) * -Math.log10(g.pValue)
