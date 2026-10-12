import { memo, useCallback, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { scaleLinear, type ScaleLinear } from 'd3-scale'
import { quadtree } from 'd3-quadtree'
import type { Gene, Regulation, Thresholds } from '@/types'
import { useElementSize } from '@/hooks/useElementSize'
import { formatFc, formatP, negLog10 } from '@/lib/format'
import { regulationLabel } from '@/lib/genes'
import { cn } from '@/lib/cn'
import { FEATURED_SYMBOLS } from '@/data/genes'
import { VolcanoTooltip } from './VolcanoTooltip'

interface VolcanoPlotProps {
  genes: Gene[]
  regulation: Map<string, Regulation>
  thresholds: Thresholds
  selectedId: string | null
  onSelect: (id: string | null) => void
  /** When set, matching genes stay in full color and everything else recedes. */
  matches: Set<string> | null
  showLabels: boolean
}

const MARGIN = { top: 14, right: 14, bottom: 52, left: 46 }
const HIT_RADIUS = 14

type Scale = ScaleLinear<number, number>

const fillClass: Record<Regulation, string> = {
  up: 'fill-viz-up',
  down: 'fill-viz-down',
  ns: 'fill-viz-ns',
}

/**
 * Points are the expensive part (≈2,400 nodes), so they live in a memoized
 * layer that only re-renders when data, thresholds, size or the search change —
 * never on hover or keyboard focus.
 */
const PointsLayer = memo(function PointsLayer({
  genes,
  regulation,
  x,
  y,
  matches,
}: {
  genes: Gene[]
  regulation: Map<string, Regulation>
  x: Scale
  y: Scale
  matches: Set<string> | null
}) {
  // Draw non-significant first so significant points sit on top.
  const ordered = useMemo(() => {
    const ns: Gene[] = []
    const sig: Gene[] = []
    for (const g of genes) (regulation.get(g.id) === 'ns' ? ns : sig).push(g)
    return [ns, sig] as const
  }, [genes, regulation])

  return (
    <g>
      {ordered.map((group, gi) => (
        <g key={gi}>
          {group.map((g) => {
            const r = regulation.get(g.id) ?? 'ns'
            const dim = matches !== null && !matches.has(g.id)
            return (
              <circle
                key={g.id}
                cx={x(g.log2FoldChange)}
                cy={y(negLog10(g.pValue))}
                r={r === 'ns' ? 2.25 : g.annotated ? 4 : 3.25}
                className={cn(fillClass[r], r !== 'ns' && 'stroke-surface', 'transition-opacity duration-200')}
                strokeWidth={r === 'ns' ? 0 : 1}
                opacity={dim ? 0.12 : r === 'ns' ? 0.7 : 0.95}
              />
            )
          })}
        </g>
      ))}
    </g>
  )
})

export function VolcanoPlot({ genes, regulation, thresholds, selectedId, onSelect, matches, showLabels }: VolcanoPlotProps) {
  const [containerRef, { width }] = useElementSize<HTMLDivElement>()
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [keyboardActive, setKeyboardActive] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)
  const instructionsId = useId()

  const height = Math.round(Math.min(460, Math.max(300, width * 0.6)))
  const innerW = Math.max(0, width - MARGIN.left - MARGIN.right)
  const innerH = height - MARGIN.top - MARGIN.bottom

  const { x, y } = useMemo(() => {
    let maxFc = 0
    let maxY = 0
    for (const g of genes) {
      maxFc = Math.max(maxFc, Math.abs(g.log2FoldChange))
      maxY = Math.max(maxY, negLog10(g.pValue))
    }
    const xMax = Math.ceil(maxFc + 0.25)
    return {
      x: scaleLinear()
        .domain([-xMax, xMax])
        .range([MARGIN.left, MARGIN.left + innerW]),
      y: scaleLinear()
        .domain([0, Math.ceil((maxY * 1.06) / 5) * 5])
        .range([MARGIN.top + innerH, MARGIN.top]),
    }
  }, [genes, innerW, innerH])

  const tree = useMemo(
    () =>
      quadtree<Gene>()
        .x((g) => x(g.log2FoldChange))
        .y((g) => y(negLog10(g.pValue)))
        .addAll(matches ? genes.filter((g) => matches.has(g.id)) : genes),
    [genes, x, y, matches],
  )

  // Keyboard navigation walks the significant (or matching) genes in fold-change order.
  const navigable = useMemo(() => {
    const list = genes.filter((g) => (matches ? matches.has(g.id) : regulation.get(g.id) !== 'ns'))
    return list.sort((a, b) => a.log2FoldChange - b.log2FoldChange)
  }, [genes, regulation, matches])

  const byId = useMemo(() => new Map(genes.map((g) => [g.id, g])), [genes])
  // Narrow plots keep only the most extreme labels so they don't collide.
  const featured = useMemo(() => {
    const list = FEATURED_SYMBOLS.map((s) => byId.get(s)).filter((g): g is Gene => !!g)
    return width < 560 ? list.filter((g) => ['MKI67', 'ERBB2', 'ESR1', 'TP53', 'MYC'].includes(g.symbol)) : list
  }, [byId, width])

  const matchedGenes = useMemo(() => (matches && matches.size <= 12 ? genes.filter((g) => matches.has(g.id)) : []), [genes, matches])

  const pointerToGene = useCallback(
    (e: { clientX: number; clientY: number }) => {
      const rect = svgRef.current?.getBoundingClientRect()
      if (!rect) return undefined
      return tree.find(e.clientX - rect.left, e.clientY - rect.top, HIT_RADIUS)
    },
    [tree],
  )

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!navigable.length) return
    const currentId = hoverId ?? selectedId
    let index = navigable.findIndex((g) => g.id === currentId)
    const step = (delta: number) => {
      e.preventDefault()
      setKeyboardActive(true)
      index = index === -1 ? (delta > 0 ? 0 : navigable.length - 1) : (index + delta + navigable.length) % navigable.length
      setHoverId(navigable[index].id)
    }
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        return step(1)
      case 'ArrowLeft':
      case 'ArrowDown':
        return step(-1)
      case 'PageUp':
        return step(10)
      case 'PageDown':
        return step(-10)
      case 'Home':
        e.preventDefault()
        setKeyboardActive(true)
        return setHoverId(navigable[0].id)
      case 'End':
        e.preventDefault()
        setKeyboardActive(true)
        return setHoverId(navigable[navigable.length - 1].id)
      case 'Enter':
      case ' ':
        if (hoverId) {
          e.preventDefault()
          onSelect(hoverId)
        }
        return
      case 'Escape':
        setHoverId(null)
        if (selectedId) onSelect(null)
        return
    }
  }

  const hovered = hoverId ? byId.get(hoverId) : undefined
  const selected = selectedId ? byId.get(selectedId) : undefined
  const fcLines = [-thresholds.log2Fc, thresholds.log2Fc]
  const pLine = y(negLog10(thresholds.pValue))

  const announce = hovered
    ? `${hovered.symbol}. log2 fold change ${formatFc(hovered.log2FoldChange)}, p-value ${formatP(hovered.pValue)}. ${regulationLabel[regulation.get(hovered.id) ?? 'ns']}.${hovered.id === selectedId ? ' Selected.' : ' Press Enter to select.'}`
    : ''

  return (
    <div className="relative">
      <div
        ref={containerRef}
        tabIndex={0}
        role="group"
        aria-roledescription="volcano plot"
        aria-label={`Volcano plot of ${genes.length.toLocaleString()} genes. ${navigable.length} navigable genes.`}
        aria-describedby={instructionsId}
        onKeyDown={onKeyDown}
        onBlur={() => {
          if (keyboardActive) setHoverId(null)
          setKeyboardActive(false)
        }}
        className="focus-ring relative rounded-md"
        style={{ height }}
      >
        <p id={instructionsId} className="sr-only">
          Use arrow keys to move between significant genes in fold-change order, Enter to select, Escape to clear. The gene table below
          contains the same data.
        </p>
        {width > 0 && (
          <svg ref={svgRef} width={width} height={height} className="block select-none overflow-visible" aria-hidden>
            {/* Grid + axes: recessive so data leads. */}
            <g className="text-2xs">
              {y.ticks(6).map((t) => (
                <g key={`y${t}`}>
                  <line x1={MARGIN.left} x2={MARGIN.left + innerW} y1={y(t)} y2={y(t)} className="stroke-viz-grid" />
                  <text x={MARGIN.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="tabular fill-fg-subtle">
                    {t}
                  </text>
                </g>
              ))}
              {x.ticks(width < 480 ? 5 : 9).map((t) => (
                <g key={`x${t}`}>
                  <line
                    x1={x(t)}
                    x2={x(t)}
                    y1={MARGIN.top}
                    y2={MARGIN.top + innerH}
                    className={t === 0 ? 'stroke-border-strong' : 'stroke-viz-grid'}
                  />
                  <text x={x(t)} y={MARGIN.top + innerH + 14} textAnchor="middle" className="tabular fill-fg-subtle">
                    {t > 0 ? `+${t}` : t < 0 ? `−${-t}` : t}
                  </text>
                </g>
              ))}
              <text x={MARGIN.left + innerW / 2} y={height - 18} textAnchor="middle" className="fill-fg-muted text-xs font-medium">
                log₂ fold change
              </text>
              <text x={MARGIN.left} y={height - 4} className="fill-fg-subtle">
                ← lower in tumor
              </text>
              <text x={MARGIN.left + innerW} y={height - 4} textAnchor="end" className="fill-fg-subtle">
                higher in tumor →
              </text>
              <text
                transform={`translate(12 ${MARGIN.top + innerH / 2}) rotate(-90)`}
                textAnchor="middle"
                className="fill-fg-muted text-xs font-medium"
              >
                −log₁₀ p-value
              </text>
            </g>

            {/* Significance thresholds */}
            <g className="stroke-fg-subtle" strokeDasharray="4 4" strokeWidth={1}>
              {fcLines.map((v) => (
                <line key={v} x1={x(v)} x2={x(v)} y1={MARGIN.top} y2={MARGIN.top + innerH} />
              ))}
              {pLine >= MARGIN.top && <line x1={MARGIN.left} x2={MARGIN.left + innerW} y1={pLine} y2={pLine} />}
            </g>
            {pLine >= MARGIN.top && (
              <text x={MARGIN.left + innerW - 4} y={pLine - 5} textAnchor="end" className="fill-fg-subtle text-2xs">
                p = {thresholds.pValue}
              </text>
            )}

            <PointsLayer genes={genes} regulation={regulation} x={x} y={y} matches={matches} />

            {/* Selective direct labels, with a surface-colored halo for legibility. */}
            {showLabels && (
              <g className="text-2xs font-semibold" style={{ paintOrder: 'stroke' }}>
                {featured.map((g) => {
                  const right = g.log2FoldChange >= 0
                  const offset = g.id === selectedId ? 13 : 7
                  const dim = matches !== null && !matches.has(g.id)
                  return (
                    <text
                      key={g.id}
                      x={x(g.log2FoldChange) + (right ? offset : -offset)}
                      y={y(negLog10(g.pValue))}
                      dy="0.32em"
                      textAnchor={right ? 'start' : 'end'}
                      className="fill-fg stroke-surface"
                      strokeWidth={3}
                      strokeLinejoin="round"
                      opacity={dim ? 0.25 : 1}
                    >
                      {g.symbol}
                    </text>
                  )
                })}
              </g>
            )}

            {/* Search results get a ring and a label, so even non-significant matches are findable. */}
            {matchedGenes.length > 0 && (
              <g pointerEvents="none" className="text-2xs font-semibold" style={{ paintOrder: 'stroke' }}>
                {matchedGenes.map((g) => {
                  const cx = x(g.log2FoldChange)
                  const cy = y(negLog10(g.pValue))
                  const right = g.log2FoldChange >= 0
                  return (
                    <g key={g.id}>
                      <circle cx={cx} cy={cy} r={6} className="fill-none stroke-fg" strokeWidth={1.5} />
                      {!(showLabels && FEATURED_SYMBOLS.includes(g.symbol)) && (
                        <text
                          x={cx + (right ? 9 : -9)}
                          y={cy}
                          dy="0.32em"
                          textAnchor={right ? 'start' : 'end'}
                          className="fill-fg stroke-surface"
                          strokeWidth={3}
                          strokeLinejoin="round"
                        >
                          {g.symbol}
                        </text>
                      )}
                    </g>
                  )
                })}
              </g>
            )}

            {selected && (
              <g pointerEvents="none">
                <circle
                  cx={x(selected.log2FoldChange)}
                  cy={y(negLog10(selected.pValue))}
                  r={9}
                  className="fill-none stroke-fg"
                  strokeWidth={2}
                />
                <circle
                  cx={x(selected.log2FoldChange)}
                  cy={y(negLog10(selected.pValue))}
                  r={4.5}
                  className={cn(fillClass[regulation.get(selected.id) ?? 'ns'], 'stroke-surface')}
                  strokeWidth={1.5}
                />
              </g>
            )}
            {hovered && hovered.id !== selectedId && (
              <circle
                pointerEvents="none"
                cx={x(hovered.log2FoldChange)}
                cy={y(negLog10(hovered.pValue))}
                r={7}
                className="fill-none stroke-fg-muted"
                strokeWidth={1.5}
              />
            )}

            <rect
              x={MARGIN.left}
              y={MARGIN.top}
              width={innerW}
              height={innerH}
              fill="transparent"
              className={hovered ? 'cursor-pointer' : 'cursor-crosshair'}
              onPointerMove={(e) => {
                setKeyboardActive(false)
                setHoverId(pointerToGene(e)?.id ?? null)
              }}
              onPointerLeave={() => setHoverId(null)}
              onClick={(e) => {
                const g = pointerToGene(e)
                onSelect(g ? g.id : null)
              }}
            />
          </svg>
        )}
        {hovered && (
          <VolcanoTooltip
            gene={hovered}
            regulation={regulation.get(hovered.id) ?? 'ns'}
            x={x(hovered.log2FoldChange)}
            y={y(negLog10(hovered.pValue))}
            containerWidth={width}
            selected={hovered.id === selectedId}
          />
        )}
      </div>
      <p aria-live="polite" className="sr-only">
        {keyboardActive ? announce : ''}
      </p>
    </div>
  )
}
