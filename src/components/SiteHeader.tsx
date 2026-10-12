import { Github } from 'lucide-react'
import { LogoMark } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { REPO_URL, SECTIONS } from './site'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md supports-[backdrop-filter]:bg-bg/75">
      <a
        href="#main"
        className="sr-only z-50 rounded bg-accent px-3 py-2 text-sm font-medium text-accent-fg focus:not-sr-only focus:absolute focus:left-3 focus:top-2"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-14 max-w-[88rem] items-center gap-6 px-4 sm:px-6">
        <a href="#top" className="focus-ring flex items-center gap-2 rounded">
          <LogoMark />
          <span className="text-sm font-semibold text-fg">Helix Workspace</span>
          <span className="hidden text-sm text-fg-subtle sm:inline">Case study</span>
        </a>
        <nav aria-label="Sections" className="hidden flex-1 lg:block">
          <ul className="flex items-center gap-1">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="focus-ring rounded px-2 py-1 text-sm text-fg-muted transition-colors is-hover:text-fg">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <a
            href={REPO_URL}
            className="focus-ring inline-flex size-8 items-center justify-center rounded text-fg-muted transition-colors is-hover:bg-surface-3 is-hover:text-fg"
            aria-label="Source code on GitHub"
          >
            <Github aria-hidden className="size-4" />
          </a>
        </div>
      </div>
    </header>
  )
}
