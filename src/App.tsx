import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { WorkspaceProvider } from '@/features/workspace/WorkspaceContext'
import { ThemeProvider } from '@/hooks/useTheme'
import { AccessibilitySection } from '@/sections/AccessibilitySection'
import { AssistantSection } from '@/sections/AssistantSection'
import { DecisionsSection } from '@/sections/DecisionsSection'
import { DemonstratesSection } from '@/sections/DemonstratesSection'
import { DesignSystemSection } from '@/sections/DesignSystemSection'
import { Hero } from '@/sections/Hero'
import { ProductSection } from '@/sections/ProductSection'
import { WorkflowSection } from '@/sections/WorkflowSection'

export default function App() {
  return (
    <ThemeProvider>
      <WorkspaceProvider>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="outline-none">
          <Hero />
          <ProductSection />
          <WorkflowSection />
          <AssistantSection />
          <DesignSystemSection />
          <AccessibilitySection />
          <DecisionsSection />
          <DemonstratesSection />
        </main>
        <SiteFooter />
      </WorkspaceProvider>
    </ThemeProvider>
  )
}
