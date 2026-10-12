import type { Gene } from '@/types'
import { createRandom } from '@/lib/random'

/**
 * Synthetic differential-expression results.
 *
 * Gene symbols below are public HGNC names used purely as recognizable labels.
 * Every number — fold change, p-value, expression — is invented. The background
 * genes use a fictional `HXT` prefix so they can't be mistaken for real loci.
 */

type Seed = [symbol: string, name: string, chromosome: string, log2Fc: number, p: number, baseMean: number, pathways: string[]]

const ANNOTATED: Seed[] = [
  // Up-regulated
  ['MKI67', 'Marker of proliferation Ki-67', '10', 3.42, 1e-24, 2140, ['Cell cycle']],
  ['UBE2C', 'Ubiquitin conjugating enzyme E2 C', '20', 3.08, 2e-19, 880, ['Cell cycle']],
  ['TOP2A', 'DNA topoisomerase II alpha', '17', 2.94, 1e-21, 3120, ['Cell cycle', 'DNA repair']],
  ['CCNB1', 'Cyclin B1', '5', 2.81, 1e-17, 1460, ['Cell cycle']],
  ['BIRC5', 'Baculoviral IAP repeat containing 5', '17', 2.68, 5e-16, 720, ['Apoptosis']],
  ['ERBB2', 'Erb-b2 receptor tyrosine kinase 2', '17', 2.6, 1e-18, 5400, ['RTK signaling', 'PI3K–AKT']],
  ['CDK1', 'Cyclin dependent kinase 1', '10', 2.47, 2e-13, 960, ['Cell cycle']],
  ['AURKA', 'Aurora kinase A', '20', 2.36, 3e-15, 640, ['Cell cycle']],
  ['MYC', 'MYC proto-oncogene', '8', 2.18, 1e-14, 2310, ['Transcription', 'Cell cycle']],
  ['PLK1', 'Polo like kinase 1', '16', 2.06, 8e-13, 510, ['Cell cycle']],
  ['CENPF', 'Centromere protein F', '1', 1.92, 6e-10, 430, ['Cell cycle']],
  ['EGFR', 'Epidermal growth factor receptor', '7', 1.82, 4e-11, 1680, ['RTK signaling', 'PI3K–AKT']],
  ['CDKN2A', 'Cyclin dependent kinase inhibitor 2A', '9', 1.58, 2e-4, 210, ['Cell cycle']],
  ['VEGFA', 'Vascular endothelial growth factor A', '6', 1.41, 1e-7, 2900, ['Angiogenesis']],
  ['PIK3CA', 'Phosphatidylinositol-4,5-bisphosphate 3-kinase catalytic subunit alpha', '3', 1.34, 2e-8, 1220, ['PI3K–AKT']],
  ['CCND1', 'Cyclin D1', '11', 1.21, 4e-5, 6100, ['Cell cycle']],
  ['KRAS', 'KRAS proto-oncogene, GTPase', '12', 1.12, 3e-6, 1890, ['RTK signaling']],
  ['MMP11', 'Matrix metallopeptidase 11', '22', 3.62, 4e-14, 1340, ['ECM remodeling']],
  ['COL11A1', 'Collagen type XI alpha 1 chain', '1', 4.12, 1e-12, 64, ['ECM remodeling']],
  ['NOTCH1', 'Notch receptor 1', '9', 0.88, 3e-3, 990, ['Notch signaling']],
  ['CHEK2', 'Checkpoint kinase 2', '22', 0.41, 0.12, 380, ['DNA repair']],
  ['GAPDH', 'Glyceraldehyde-3-phosphate dehydrogenase', '12', 0.05, 0.81, 48200, ['Glycolysis']],
  // Down-regulated
  ['ADIPOQ', 'Adiponectin, C1Q and collagen domain containing', '3', -4.38, 3e-11, 52, ['Adipogenesis']],
  ['FABP4', 'Fatty acid binding protein 4', '8', -4.02, 2e-12, 410, ['Adipogenesis']],
  ['TFF1', 'Trefoil factor 1', '21', -3.88, 7e-14, 2650, ['ER signaling']],
  ['LEP', 'Leptin', '7', -3.76, 5e-9, 96, ['Adipogenesis']],
  ['PGR', 'Progesterone receptor', '11', -3.58, 2e-15, 760, ['ER signaling']],
  ['ESR1', 'Estrogen receptor 1', '6', -3.21, 1e-20, 4120, ['ER signaling']],
  ['CD36', 'CD36 molecule', '7', -2.91, 6e-10, 820, ['Adipogenesis']],
  ['GATA3', 'GATA binding protein 3', '10', -2.79, 4e-18, 3380, ['ER signaling', 'Transcription']],
  ['FOXA1', 'Forkhead box A1', '14', -2.58, 1e-16, 2210, ['ER signaling', 'Transcription']],
  ['SFRP1', 'Secreted frizzled related protein 1', '8', -2.42, 8e-9, 690, ['Wnt signaling']],
  ['AR', 'Androgen receptor', 'X', -2.29, 1e-13, 1120, ['Hormone signaling']],
  ['TP53', 'Tumor protein p53', '17', -2.08, 1e-12, 2480, ['DNA repair', 'Apoptosis']],
  ['KIT', 'KIT proto-oncogene, receptor tyrosine kinase', '4', -1.98, 3e-7, 340, ['RTK signaling']],
  ['PTEN', 'Phosphatase and tensin homolog', '10', -1.88, 5e-11, 1560, ['PI3K–AKT']],
  ['BRCA1', 'BRCA1 DNA repair associated', '17', -1.61, 3e-9, 920, ['DNA repair']],
  ['CDH1', 'Cadherin 1', '16', -1.31, 2e-5, 5020, ['Cell adhesion']],
  ['RB1', 'RB transcriptional corepressor 1', '13', -1.08, 4e-4, 1310, ['Cell cycle']],
  ['BRCA2', 'BRCA2 DNA repair associated', '13', -0.71, 0.02, 480, ['DNA repair']],
  ['ATM', 'ATM serine/threonine kinase', '11', -0.32, 0.21, 1740, ['DNA repair']],
  ['PALB2', 'Partner and localizer of BRCA2', '16', -0.18, 0.52, 360, ['DNA repair']],
  ['ACTB', 'Actin beta', '7', -0.09, 0.69, 61200, ['Cytoskeleton']],
]

/** Genes that get a direct label on the volcano plot (selective labelling, not every point). */
export const FEATURED_SYMBOLS = ['TP53', 'BRCA1', 'EGFR', 'MYC', 'KRAS', 'PIK3CA', 'PTEN', 'ERBB2', 'ESR1', 'MKI67']

export const TOTAL_GENES = 2412

const CHROMOSOMES = [...Array.from({ length: 22 }, (_, i) => String(i + 1)), 'X']

/** Two-sided p-value for a z-score (Abramowitz & Stegun 7.1.26, stays finite for large z). */
function pFromZ(z: number): number {
  const x = Math.abs(z) / Math.SQRT2
  const t = 1 / (1 + 0.3275911 * x)
  const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))))
  return Math.min(1, Math.max(poly * Math.exp(-x * x), 1e-30))
}

/** Benjamini–Hochberg adjustment, returned in the input order. */
function adjust(pValues: number[]): number[] {
  const n = pValues.length
  const order = pValues.map((p, i) => [p, i] as const).sort((a, b) => a[0] - b[0])
  const out = new Array<number>(n)
  let running = 1
  for (let rank = n; rank >= 1; rank--) {
    const [p, i] = order[rank - 1]
    running = Math.min(running, (p * n) / rank)
    out[i] = running
  }
  return out
}

export function generateGenes(seed = 20261012): Gene[] {
  const rand = createRandom(seed)
  const raw: Omit<Gene, 'padj'>[] = ANNOTATED.map(([symbol, name, chromosome, log2FoldChange, pValue, baseMean, pathways]) => ({
    id: symbol,
    symbol,
    name,
    chromosome,
    log2FoldChange,
    pValue,
    baseMean,
    pathways,
    annotated: true,
  }))

  for (let i = raw.length; i < TOTAL_GENES; i++) {
    // Most genes barely move; a heavier-tailed minority carries real signal.
    const isSignal = rand.next() < 0.13
    // Clamped so the annotated genes stay the most extreme, and the story told about them holds.
    const fc = Math.max(-3, Math.min(3, isSignal ? rand.normal(0, 1.3) : rand.normal(0, 0.38)))
    const se = 0.16 + rand.next() * 0.22 + 0.06 * Math.abs(fc)
    const z = fc / se + rand.normal(0, 0.6)
    const p = pFromZ(Math.sign(z) * Math.min(Math.abs(z), 7.6 + rand.next() * 0.8))
    const id = `HXT${String(10000 + i * 7).padStart(5, '0')}`
    raw.push({
      id,
      symbol: id,
      name: 'Unannotated synthetic transcript',
      chromosome: rand.pick(CHROMOSOMES),
      log2FoldChange: Math.round(fc * 100) / 100,
      pValue: p,
      baseMean: Math.round(Math.exp(rand.normal(5.6, 1.4))),
      pathways: [],
      annotated: false,
    })
  }

  const padj = adjust(raw.map((g) => g.pValue))
  return raw.map((g, i) => ({ ...g, padj: padj[i] }))
}
