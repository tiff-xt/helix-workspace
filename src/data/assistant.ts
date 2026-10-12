import type { AssistantResponse, Gene } from '@/types'
import { formatFc, formatP } from '@/lib/format'

export const SUGGESTED_PROMPTS = [
  'Which genes should I investigate next?',
  'Which results look least reliable?',
  'Summarize the down-regulated signature',
] as const

type Intent = 'prioritize' | 'reliability' | 'signature'

function detectIntent(question: string): Intent {
  const q = question.toLowerCase()
  if (/(reliab|trust|noise|noisy|artifact|wrong|confiden)/.test(q)) return 'reliability'
  if (/(down|signature|summar|lost|decrease)/.test(q)) return 'signature'
  return 'prioritize'
}

const intentLabel: Record<Intent, string> = {
  prioritize: 'Prioritization request',
  reliability: 'Result quality review',
  signature: 'Signature summary',
}

/**
 * A stand-in for a model call. The answer is grounded in the current gene table,
 * so numbers quoted in rationales always match what the plot shows.
 */
export function answer(question: string, genes: Map<string, Gene>): AssistantResponse & { intent: string } {
  const intent = detectIntent(question)
  const stat = (id: string) => {
    const g = genes.get(id)
    return g ? `log2FC ${formatFc(g.log2FoldChange)}, p = ${formatP(g.pValue)}` : ''
  }

  const scope = ['Differential expression · run 14', 'Thresholds currently applied in the plot', 'Gene annotations (pathways)']
  const caveat = 'Suggestions are based only on this project’s results and gene annotations. They are not validated findings.'

  if (intent === 'reliability') {
    return {
      intent: intentLabel[intent],
      question,
      summary: 'Three significant results rely on low expression or sit near a threshold, so small changes in the data could move them.',
      scope,
      caveat,
      candidates: [
        {
          geneId: 'COL11A1',
          rationale: `Largest up-regulation in the study (${stat('COL11A1')}) but a mean of only 64 normalized counts. Fold changes at low counts are inflated by noise.`,
          confidence: 'exploratory',
          confidenceNote: 'Low expression',
          nextAnalysis: 'Re-estimate with fold-change shrinkage and inspect per-sample counts.',
        },
        {
          geneId: 'ADIPOQ',
          rationale: `Strong down-regulation (${stat('ADIPOQ')}) that may reflect more fat tissue in normal samples rather than tumor biology.`,
          confidence: 'exploratory',
          confidenceNote: 'Possible composition effect',
          nextAnalysis: 'Add an adipocyte content estimate as a covariate and re-run.',
        },
        {
          geneId: 'NOTCH1',
          rationale: `Just below the fold-change threshold (${stat('NOTCH1')}). Its status flips if the threshold moves from 1.0 to 0.75.`,
          confidence: 'moderate',
          confidenceNote: 'Threshold-sensitive',
          nextAnalysis: 'Report it as borderline rather than including or excluding it silently.',
        },
      ],
    }
  }

  if (intent === 'signature') {
    return {
      intent: intentLabel[intent],
      question,
      summary:
        'The strongest down-regulated genes cluster in estrogen-receptor signaling, consistent with loss of a luminal expression program in a subset of tumors.',
      scope,
      caveat,
      candidates: [
        {
          geneId: 'ESR1',
          rationale: `Anchor of the signature (${stat('ESR1')}). Well-supported and highly expressed.`,
          confidence: 'high',
          confidenceNote: 'Strong evidence, high expression',
          nextAnalysis: 'Split samples by ESR1 level and check whether the signature is subgroup-driven.',
        },
        {
          geneId: 'GATA3',
          rationale: `Moves with ESR1 (${stat('GATA3')}); co-regulation supports a shared program rather than isolated hits.`,
          confidence: 'high',
          confidenceNote: 'Consistent with ESR1',
          nextAnalysis: 'Correlate GATA3, FOXA1 and ESR1 across samples.',
        },
        {
          geneId: 'FOXA1',
          rationale: `Third member of the same program (${stat('FOXA1')}).`,
          confidence: 'moderate',
          confidenceNote: 'Smaller effect',
          nextAnalysis: 'Run pathway enrichment on all down-regulated genes to confirm the theme.',
        },
      ],
    }
  }

  return {
    intent: intentLabel[intent],
    question,
    summary:
      'Based on effect size, evidence and pathway context, these three are the most informative to follow up. Each answers a different question.',
    scope,
    caveat,
    candidates: [
      {
        geneId: 'ERBB2',
        rationale: `Strong, well-supported up-regulation (${stat('ERBB2')}) at high expression. Worth checking whether the signal comes from a subset of samples.`,
        confidence: 'high',
        confidenceNote: 'Strong evidence, high expression',
        nextAnalysis: 'Stratify samples by ERBB2 level and re-run differential expression within each group.',
      },
      {
        geneId: 'PTEN',
        rationale: `Down-regulated (${stat('PTEN')}) while PIK3CA is up in the same pathway. Together they point to PI3K–AKT activation.`,
        confidence: 'moderate',
        confidenceNote: 'Pathway context, not direct evidence',
        nextAnalysis: 'Run pathway enrichment for PI3K–AKT on the significant gene set.',
      },
      {
        geneId: 'COL11A1',
        rationale: `Largest up-regulation in the study (${stat('COL11A1')}) but low expression, so the effect size may be overstated.`,
        confidence: 'exploratory',
        confidenceNote: 'Large effect, low counts',
        nextAnalysis: 'Check per-sample counts and apply fold-change shrinkage before prioritizing.',
      },
    ],
  }
}
