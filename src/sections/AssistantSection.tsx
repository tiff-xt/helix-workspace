import { Note, Section } from '@/components/Section'
import { ResearchAssistant } from '@/features/assistant/ResearchAssistant'
import { useWorkspace } from '@/features/workspace/WorkspaceContext'

export function AssistantSection() {
  const { select, setView } = useWorkspace()

  const inspect = (geneId: string) => {
    setView('overview')
    select(geneId)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById('product')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <Section
      id="assistant"
      index="03 · AI assistance"
      title="An assistant that shows its work"
      lede={
        <p>
          AI is useful here for one narrow job: pointing out which results deserve a closer look. The design keeps the researcher in charge.
          Every suggestion is grounded in the project’s own numbers and ends with a next step, not a conclusion.
        </p>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start">
        <ResearchAssistant onInspect={inspect} />
        <div className="space-y-6 lg:pt-2">
          <Note title="Structured, not conversational">
            Answers come back as ranked candidates with a rationale, a confidence level and a suggested analysis. That’s easier to scan and
            compare than paragraphs of chat.
          </Note>
          <Note title="Honest confidence">
            Confidence is a three-step scale with a reason (“low expression”, “threshold-sensitive”) instead of a precise percentage the
            model can’t back up.
          </Note>
          <Note title="Connected to the work">
            “Inspect in plot” takes you to the gene in the workspace. Nothing is added to the analysis automatically. Shortlisting is always
            a deliberate action.
          </Note>
          <Note title="Scope is visible">
            Each answer states what it was based on and how the question was interpreted, so a misunderstanding is caught before it matters.
          </Note>
        </div>
      </div>
    </Section>
  )
}
