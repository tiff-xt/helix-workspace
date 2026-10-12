import { LogoMark } from './Logo'
import { REPO_URL } from './site'

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-fg-subtle sm:px-6">
        <p className="flex items-center gap-2">
          <LogoMark className="size-5" />
          Helix Workspace — an original design engineering case study.
        </p>
        <p className="flex gap-4">
          <a href={REPO_URL} className="focus-ring rounded text-fg-muted underline-offset-4 is-hover:text-fg is-hover:underline">
            Source on GitHub
          </a>
          <a href="#top" className="focus-ring rounded text-fg-muted underline-offset-4 is-hover:text-fg is-hover:underline">
            Back to top
          </a>
        </p>
      </div>
    </footer>
  )
}
