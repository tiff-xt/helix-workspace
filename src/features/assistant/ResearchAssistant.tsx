import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowUp, Check, Copy, Crosshair, Info, Plus, Sparkles } from 'lucide-react'
import type { AssistantResponse } from '@/types'
import { api } from '@/data/api'
import { SUGGESTED_PROMPTS } from '@/data/assistant'
import { Alert, Button, Skeleton } from '@/design-system'
import { useWorkspace } from '@/features/workspace/WorkspaceContext'
import { CandidateCard } from './CandidateCard'

type State =
  | { status: 'idle' }
  | { status: 'loading'; question: string }
  | { status: 'done'; response: AssistantResponse & { intent: string } }
  | { status: 'error'; question: string }

interface ResearchAssistantProps {
  /** Called when the user wants to see a gene in the workspace. */
  onInspect?: (geneId: string) => void
}

export function ResearchAssistant({ onInspect }: ResearchAssistantProps) {
  const [question, setQuestion] = useState<string>(SUGGESTED_PROMPTS[0])
  const [state, setState] = useState<State>({ status: 'idle' })
  const [copied, setCopied] = useState(false)
  const requestId = useRef(0)
  const { byId, shortlist, toggleShortlist } = useWorkspace()
  const rootRef = useRef<HTMLElement>(null)

  const ask = async (q: string) => {
    const trimmed = q.trim()
    if (!trimmed) return
    const id = ++requestId.current
    setState({ status: 'loading', question: trimmed })
    try {
      const response = await api.ask(trimmed)
      if (id === requestId.current) setState({ status: 'done', response })
    } catch {
      if (id === requestId.current) setState({ status: 'error', question: trimmed })
    }
  }

  // Run the example question once the panel scrolls into view, so visitors see a real answer (and its loading state).
  const askRef = useRef(ask)
  askRef.current = ask
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        void askRef.current(SUGGESTED_PROMPTS[0])
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    void ask(question)
  }

  const copy = async (r: AssistantResponse) => {
    const text = [r.summary, ...r.candidates.map((c) => `${c.geneId}: ${c.rationale} Next: ${c.nextAnalysis}`)].join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard blocked; leave state unchanged */
    }
  }

  return (
    <section
      ref={rootRef}
      aria-labelledby="assistant-title"
      className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-xs"
    >
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span aria-hidden className="flex size-6 items-center justify-center rounded bg-accent-subtle text-accent-text">
            <Sparkles className="size-3.5" />
          </span>
          <h3 id="assistant-title" className="text-base font-semibold text-fg">
            Research Assistant
          </h3>
        </div>
        <span className="text-xs text-fg-subtle">Reads this project only</span>
      </header>

      <form onSubmit={onSubmit} className="border-b border-border p-4">
        <label htmlFor="assistant-q" className="text-sm font-medium text-fg">
          Ask about these results
        </label>
        <div className="mt-1.5 flex items-end gap-2 rounded-md border border-border bg-surface p-1.5 shadow-xs transition-[border-color,box-shadow] focus-within:border-accent focus-within:ring-[3px] focus-within:ring-accent/25">
          <textarea
            id="assistant-q"
            rows={1}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                void ask(question)
              }
            }}
            className="min-h-8 flex-1 resize-none bg-transparent px-1.5 py-1 text-base text-fg outline-none placeholder:text-fg-subtle"
            placeholder="e.g. Which genes should I investigate next?"
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            aria-label="Ask assistant"
            disabled={!question.trim()}
            loading={state.status === 'loading'}
            leadingIcon={<ArrowUp className="size-3.5" />}
            className="w-8 px-0"
          />
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5" aria-label="Suggested questions" role="group">
          {SUGGESTED_PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setQuestion(p)
                void ask(p)
              }}
              className="focus-ring rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs text-fg-muted transition-colors is-hover:border-border-strong is-hover:text-fg"
            >
              {p}
            </button>
          ))}
        </div>
      </form>

      <div aria-live="polite" aria-busy={state.status === 'loading'} className="min-h-[18rem] flex-1 bg-surface-2/60 p-4">
        {state.status === 'idle' && (
          <div className="flex h-full flex-col items-center justify-center gap-2 py-10 text-center">
            <p className="text-sm font-medium text-fg">Ask a question to get a structured suggestion</p>
            <p className="max-w-xs text-sm text-fg-subtle">
              Answers cite values from the current analysis, state their confidence, and propose a next step — you decide what to act on.
            </p>
          </div>
        )}

        {state.status === 'loading' && (
          <div>
            <p className="flex items-center gap-2 text-sm text-fg-muted">
              <span className="relative block h-1 w-16 overflow-hidden rounded-full bg-surface-3">
                <span className="absolute inset-y-0 w-1/3 animate-progress rounded-full bg-accent" />
              </span>
              Reviewing 2,412 genes and pathway annotations…
            </p>
            <div className="mt-4 space-y-2.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-md border border-border bg-surface p-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="mt-2.5 h-3 w-full" />
                  <Skeleton className="mt-1.5 h-3 w-4/5" />
                </div>
              ))}
            </div>
          </div>
        )}

        {state.status === 'error' && (
          <Alert
            tone="danger"
            title="The assistant couldn’t answer"
            action={
              <Button size="sm" onClick={() => ask(state.question)}>
                Try again
              </Button>
            }
          >
            Nothing was changed in your analysis.
          </Alert>
        )}

        {state.status === 'done' && (
          <div className="animate-fade-in">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-fg-subtle">
              <span>Interpreted as</span>
              <span className="rounded-sm border border-border bg-surface px-1.5 py-0.5 font-medium text-fg-muted">
                {state.response.intent}
              </span>
            </div>
            <p className="mt-2 text-base text-fg">{state.response.summary}</p>

            <ol className="mt-3 space-y-2.5" aria-label="Candidate genes">
              {state.response.candidates.map((c, i) => {
                const gene = byId.get(c.geneId)
                const listed = shortlist.has(c.geneId)
                return (
                  <li key={c.geneId}>
                    <CandidateCard
                      rank={i + 1}
                      candidate={c}
                      gene={gene}
                      actions={
                        <>
                          {onInspect && (
                            <Button
                              size="sm"
                              variant="ghost"
                              leadingIcon={<Crosshair className="size-3.5" />}
                              onClick={() => onInspect(c.geneId)}
                            >
                              Inspect in plot
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            aria-pressed={listed}
                            leadingIcon={listed ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
                            onClick={() => toggleShortlist(c.geneId)}
                          >
                            {listed ? 'On shortlist' : 'Add to shortlist'}
                          </Button>
                        </>
                      }
                    />
                  </li>
                )
              })}
            </ol>

            <details className="group mt-3 text-sm">
              <summary className="focus-ring inline-flex cursor-pointer list-none items-center gap-1 rounded text-fg-muted is-hover:text-fg [&::-webkit-details-marker]:hidden">
                <Info aria-hidden className="size-3.5" />
                What this answer is based on
              </summary>
              <ul className="mt-2 list-disc space-y-0.5 pl-5 text-fg-subtle">
                {state.response.scope.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <p className="mt-2 text-fg-subtle">{state.response.caveat}</p>
            </details>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
              <p className="flex items-center gap-1.5 text-xs font-medium text-fg-muted">
                <Sparkles aria-hidden className="size-3.5 text-accent-text" />
                AI-generated suggestion. Review before using in analysis.
              </p>
              <Button
                size="sm"
                variant="ghost"
                leadingIcon={copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                onClick={() => copy(state.response)}
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
