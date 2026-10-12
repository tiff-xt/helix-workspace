import { Note, Section } from '@/components/Section'
import { ColorTokens, SpacingScale, TypeScale } from './design-system/Foundations'
import {
  AlertSpecimen,
  BadgeSpecimen,
  ButtonMatrix,
  CardTooltipSpecimen,
  InputStates,
  LoadingEmptySpecimen,
  NavigationSpecimen,
  TableSpecimen,
} from './design-system/Components'
import { ThemeComparison } from './design-system/ThemeComparison'

export function DesignSystemSection() {
  return (
    <Section
      id="system"
      index="04 — Design system"
      title="One set of parts, built to be reused"
      lede={
        <p>
          Every screen above is assembled from the components on this page. Colors, type and spacing are tokens; themes are just a different
          set of token values. The theme toggle in the header switches the whole page — including the product.
        </p>
      }
    >
      <h3 className="mb-4 text-lg font-semibold text-fg">Themes, side by side</h3>
      <ThemeComparison />

      <h3 className="mb-4 mt-12 text-lg font-semibold text-fg">Foundations</h3>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <ColorTokens />
        <div className="grid gap-4">
          <TypeScale />
          <SpacingScale />
        </div>
      </div>

      <h3 className="mb-4 mt-12 text-lg font-semibold text-fg">Components and states</h3>
      <div className="grid gap-4 lg:grid-cols-2">
        <ButtonMatrix />
        <InputStates />
        <NavigationSpecimen />
        <BadgeSpecimen />
        <CardTooltipSpecimen />
        <AlertSpecimen />
        <TableSpecimen />
        <LoadingEmptySpecimen />
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <Note title="States from one source">
          Components use custom <code className="font-mono text-xs">is-hover</code> and <code className="font-mono text-xs">is-focus</code>{' '}
          variants that respond to real interaction or a <code className="font-mono text-xs">data-demo</code> attribute. The state matrix
          can’t drift from the product.
        </Note>
        <Note title="Tokens, not hex codes">
          Components only reference names like <code className="font-mono text-xs">surface</code> or{' '}
          <code className="font-mono text-xs">fg-muted</code>. Adding a theme means adding one block of CSS variables.
        </Note>
        <Note title="Native where it counts">
          Selects, dialogs and range inputs are native elements with custom styling, so keyboard, screen reader and mobile behavior come
          from the platform.
        </Note>
      </div>
    </Section>
  )
}
