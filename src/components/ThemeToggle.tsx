import { Monitor, Moon, Sun } from 'lucide-react'
import { SegmentedControl } from '@/design-system'
import { useTheme, type ThemePreference } from '@/hooks/useTheme'

export function ThemeToggle() {
  const { preference, setPreference } = useTheme()
  return (
    <SegmentedControl<ThemePreference>
      label="Color theme"
      size="sm"
      value={preference}
      onChange={setPreference}
      options={[
        { value: 'light', label: null, icon: <Sun aria-hidden />, ariaLabel: 'Light theme' },
        { value: 'dark', label: null, icon: <Moon aria-hidden />, ariaLabel: 'Dark theme' },
        { value: 'system', label: null, icon: <Monitor aria-hidden />, ariaLabel: 'Match system theme' },
      ]}
    />
  )
}
