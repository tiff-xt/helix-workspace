# Helix Workspace

**Designing clarity into complex scientific workflows.**
An original design engineering case study: a fictional research tool for inspecting gene-expression results and deciding what to investigate next. I designed and built it end to end: the product, the component system and the interactions.

**Live site:** `https://tiff-xt.github.io/helix-workspace/`

> This is an original portfolio case study built to demonstrate my design and frontend engineering approach. It does not reproduce proprietary screens, code, data, or branding from any former employer. Gene symbols are public names used only as labels. Every number is synthetic and generated in the browser. People, labs and datasets are fictional.

<!--
Screenshots: run `npm run dev`, capture the views below at 1440px wide (light and dark),
save them to docs/screenshots/, and uncomment.

![Workspace overview](docs/screenshots/overview.png)
![Design system](docs/screenshots/design-system.png)
-->

## What's in it

The site is one page that alternates between a working product demo and short explanations of the decisions behind it.

| Section                | What it shows                                                                                                                                                                                       |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Product**            | An app shell with sidebar, top bar, workspace and inspector. Six views: Overview, Datasets, Analyses, Genes, Reports, Settings.                                                                     |
| **Volcano plot**       | About 2,400 genes. Hover tooltips, click to select, keyboard navigation, search highlighting, live threshold controls, selective direct labels, and a legend that shows counts.                     |
| **Workflow**           | A five-step pipeline with completed, running, pending, failed and loading states. Retrying the failed step shows the recovery.                                                                      |
| **Research Assistant** | A structured AI suggestion panel (not a chatbot). It gives ranked candidates with rationale, calibrated confidence and a next step, shows what each answer is based on, and links back to the plot. |
| **Design system**      | Tokens, type and spacing scales, and every component state rendered from production components. Light and dark themes appear side by side.                                                          |
| **Accessibility**      | Contrast ratios computed live from the active theme, a grayscale preview to prove status doesn't rely on color, and a keyboard map.                                                                 |
| **Design decisions**   | The reasoning, briefly.                                                                                                                                                                             |

## Why I built it

My professional work has been on complex scientific and data-analysis products. That work is proprietary, so I built something new that deals with the same kinds of problems: dense datasets, multi-step workflows, reusable component systems, data visualization, and tools that work for expert users while staying clear for everyone else.

## Tech stack

- **React 19 + TypeScript** (strict)
- **Vite** for dev and static builds
- **Tailwind CSS 3** with CSS-variable design tokens and the container-queries plugin
- **d3-scale + d3-quadtree** for the plot. Rendering is custom SVG, which gives full control over interaction and accessibility without a heavyweight chart library.
- **lucide-react** icons, **Inter** (self-hosted via Fontsource)
- **ESLint + Prettier**
- **GitHub Actions → GitHub Pages**

There is no state library. Shared workspace state (selection, thresholds, shortlist) lives in one React context.

## Design goals

- **Hierarchy before density.** Each layer goes deeper than the last: summary → plot → table → inspector.
- **One source of truth.** Plot, table, inspector and assistant read the same selection and thresholds.
- **States are designed, not left over.** Loading, empty, error, disabled, selected and success states exist for real flows.
- **The system is structural.** Components reference semantic tokens (`surface`, `fg-muted`, `accent`). A theme is a block of CSS variables, scoped by `[data-theme]`, so any subtree can render in either theme.
- **Calm, credible visuals.** Neutral surfaces, one accent, reserved status colors, borders and spacing instead of decoration.

## Accessibility notes

- One visible focus style, defined in the base layer and used by every component
- Custom `is-hover` / `is-focus` Tailwind variants that respond to real interaction _or_ a `data-demo` attribute, so the design-system page renders states from the production class definitions
- Contrast for every text/surface token pair is checked live in both themes (all pass WCAG AA)
- Status is always shown with an icon, a text label and color. Workflow states also differ in border style.
- The volcano plot can be focused: arrow keys / PgUp / PgDn / Home / End move between genes, Enter selects, Escape clears, and changes are announced through a live region. The gene table holds the same data.
- WAI-ARIA tabs and radio groups with roving tabindex, a native `<dialog>` for the mobile drawer, native `<select>` and range inputs
- `IconButton` requires a `label` prop, so an unlabeled icon button is a type error
- `aria-sort` on sortable headers, `aria-busy` on loading regions, `aria-describedby` for hints and errors
- `prefers-reduced-motion` turns off transitions, animations and smooth scrolling

## Project structure

```
src/
  design-system/      Reusable primitives (Button, Field, Tabs, Table, Tooltip, …)
  features/
    workspace/        App shell, context, views, gene table, inspector
    visualization/    Volcano plot, controls, legend, tooltip
    workflow/         Pipeline + step cards + scenario demo
    assistant/        Research Assistant panel
  sections/           Case-study page sections
  components/         Site chrome (header, footer, section layout)
  data/               Synthetic data + async mock API (swap for a real backend)
  hooks/              Theme, media queries, async data, element size, tokens
  lib/                Formatting, color math, seeded RNG, gene helpers
  styles/tokens.css   Design tokens for light and dark themes
  types/              Domain types
```

## Local development

Requires Node 20+.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build at /helix-workspace/
npm run lint
npm run format
```

## Deploying to GitHub Pages

The workflow in `.github/workflows/deploy.yml` installs dependencies, lints, builds and deploys `dist/` to Pages on every push to `main`.

1. Push the repo to GitHub (e.g. `tiff-xt/helix-workspace`).
2. On GitHub, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. Push to `main`, or run the workflow manually from the **Actions** tab.
4. The site is published at `https://tiff-xt.github.io/helix-workspace/`.

**Base path:** GitHub Pages serves project sites from `/<repo-name>/`. In CI, the base path comes from the repository name automatically, so renaming the repo needs no code change. For local production builds, the fallback is `REPO_NAME` in `vite.config.ts`, or you can override it with `BASE_PATH=/other-name/ npm run build`. If you deploy to a user site (`tiff-xt.github.io`) or a custom domain, set `BASE_PATH=/`.

## Data

`src/data/genes.ts` generates 2,412 genes from a fixed seed. 43 of them use public gene symbols (TP53, BRCA1, EGFR, MYC, KRAS, PIK3CA, PTEN, …) with hand-set synthetic values, so the story stays consistent. The rest are fictional `HXT` transcripts. Adjusted p-values are computed with Benjamini–Hochberg. All data access goes through `src/data/api.ts`, which simulates network latency so loading states show.
