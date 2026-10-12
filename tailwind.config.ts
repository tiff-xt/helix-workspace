import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import containerQueries from '@tailwindcss/container-queries'

/** Every color resolves to a CSS variable, so themes swap in one place (src/styles/tokens.css). */
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: { DEFAULT: token('surface'), 2: token('surface-2'), 3: token('surface-3') },
        border: { DEFAULT: token('border'), strong: token('border-strong') },
        fg: { DEFAULT: token('fg'), muted: token('fg-muted'), subtle: token('fg-subtle') },
        accent: {
          DEFAULT: token('accent'),
          hover: token('accent-hover'),
          fg: token('accent-fg'),
          subtle: token('accent-subtle'),
          text: token('accent-text'),
        },
        success: { DEFAULT: token('success'), subtle: token('success-subtle') },
        warning: { DEFAULT: token('warning'), subtle: token('warning-subtle') },
        danger: { DEFAULT: token('danger'), subtle: token('danger-subtle'), solid: token('danger-solid') },
        ring: token('ring'),
        viz: { up: token('viz-up'), down: token('viz-down'), ns: token('viz-ns'), grid: token('viz-grid') },
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.8125rem', { lineHeight: '1.25rem' }],
        base: ['0.875rem', { lineHeight: '1.375rem' }],
        md: ['1rem', { lineHeight: '1.625rem' }],
        lg: ['1.125rem', { lineHeight: '1.625rem' }],
        xl: ['1.375rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        '2xl': ['1.75rem', { lineHeight: '2.125rem', letterSpacing: '-0.02em' }],
        '3xl': ['2.25rem', { lineHeight: '2.625rem', letterSpacing: '-0.025em' }],
      },
      borderRadius: { sm: '4px', DEFAULT: '6px', md: '8px', lg: '10px', xl: '14px' },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      transitionTimingFunction: { out: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
      keyframes: {
        shimmer: { '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } },
        'fade-in': { from: { opacity: '0', transform: 'translateY(2px)' }, to: { opacity: '1', transform: 'none' } },
        progress: { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(250%)' } },
      },
      animation: {
        shimmer: 'shimmer 1.6s linear infinite',
        'fade-in': 'fade-in 160ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        progress: 'progress 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [
    containerQueries,
    /**
     * Interaction variants that can also be forced with `data-demo="hover focus"`.
     * Components use `is-hover:` / `is-focus:` instead of `hover:` / `focus-visible:`,
     * which lets the design-system page render every state statically from the
     * same class definitions the product uses — no duplicated "demo" styles.
     */
    plugin(({ addVariant }) => {
      addVariant('is-hover', ['@media (hover: hover) { &:hover }', '&[data-demo~="hover"]'])
      addVariant('is-focus', ['&:focus-visible', '&[data-demo~="focus"]'])
      addVariant('is-active', ['&:active', '&[data-demo~="active"]'])
      addVariant('group-is-hover', ['@media (hover: hover) { :merge(.group):hover & }', ':merge(.group)[data-demo~="hover"] &'])
    }),
  ],
} satisfies Config
