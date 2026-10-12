import { useEffect, useRef, useState } from 'react'
import { readToken } from '@/lib/color'
import { useTheme } from './useTheme'

/**
 * Resolve token values from the element's own theme scope, so a swatch inside a
 * [data-theme="dark"] wrapper reports the dark value even when the page is light.
 */
export function useTokens<T extends HTMLElement>(names: readonly string[]) {
  const ref = useRef<T>(null)
  const { resolved } = useTheme()
  const [values, setValues] = useState<Record<string, [number, number, number] | null>>({})
  const key = names.join(',')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    setValues(Object.fromEntries(key.split(',').map((n) => [n, readToken(el, n)])))
  }, [key, resolved])

  return [ref, values] as const
}
