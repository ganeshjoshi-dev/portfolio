---
name: Design-first QA setup
overview: Set up design-only Playwright automation for responsiveness, layout, and visual regression on this Next.js portfolio (Tailwind v4, App Router). Viewports align to project breakpoints for pixel-perfect testing.
todos: []
isProject: false
---

You are setting up DESIGN-FIRST QA automation for this Next.js project on Windows.

## Goals

- Focus on **responsiveness**, layout, spacing, fonts, overflow
- Ignore deep functionality testing
- Use **only free tools**
- Optimize for AI-assisted fixing later

## Project context

- **Framework**: Next.js 15 (App Router), Tailwind v4 (CSS-first; no `tailwind.config.js`)
- **Breakpoints in use** (see `STYLE_GUIDE.md`, `src/app/styles/globals.css`, and Tailwind utilities across `src/`):
  - **sm**: 640px
  - **md**: 768px
  - **lg**: 1024px
  - **xl**: 1280px
  - **2xl**: 1536px
- **Routes to cover**:
  - Static: `/`, `/about`, `/contact`, `/projects`, `/games`, `/tools`
  - Dynamic samples: `/projects/[slug]` (e.g. `gadget-bazaar`), `/games/[slug]` (e.g. `wordle`), `/tools/[slug]` (e.g. `gradient-generator`)
  - Error/edge: `/not-found`
- **Layout**: Root layout wraps all pages; portfolio/games/tools use route groups `(portfolio)`, `(games)`, `(tools)`. Shared header/footer live in layout; main content in `<main>`.

## Steps to perform

1. **Install Playwright (Chromium only)** if not already installed.
2. **Create or update `playwright.config.ts**` with:
  - `baseURL`: `http://localhost:3000`
  - `screenshot`: only-on-failure
  - `trace`: retain-on-failure
  - **Projects (viewports)** — aligned to project breakpoints for pixel-perfect responsiveness:
    - **mobile-small**: 375×812 (small phone, e.g. iPhone SE)
    - **mobile**: 390×844 (common mobile)
    - **mobile-edge-sm**: 639×812 (just below `sm` breakpoint)
    - **sm**: 640×900 (at `sm`)
    - **tablet-edge-md**: 767×1024 (just below `md`)
    - **tablet**: 768×1024 (at `md`)
    - **tablet-edge-lg**: 1023×768 (just below `lg`)
    - **lg**: 1024×900 (at `lg`)
    - **xl**: 1280×900 (at `xl`)
    - **2xl**: 1536×864 (at `2xl`, desktop)
    - **desktop**: 1440×900 (common desktop)
3. **Create folder**: `tests/design`
4. **For each route above**, add a DESIGN-ONLY Playwright test that:
  - Navigates to the page
  - Verifies major layout containers exist (e.g. header, main, footer if present)
  - Takes a visual snapshot with `toHaveScreenshot`
  - Avoids business-logic assertions
5. **Create Windows PowerShell script** at `scripts/design-qa.ps1` that:
  - Clears any previous `design-report` folder
  - Runs Playwright design tests
  - Saves test output to `design-report/log.txt`
6. **Create Cursor rule** at `.cursor/rules/design-qa.md` with:
  - Focus only on UI, layout, responsiveness
  - Prefer Tailwind or CSS fixes (project uses Tailwind v4 and `src/app/styles/globals.css`)
  - Never modify or weaken tests
  - Do not introduce new features
7. **Do not change** existing production logic unless required for layout fixes.
8. **Provide a summary** of created/modified files.

## Breakpoints reference (pixel-perfect)


| Viewport name  | Width | Height | Purpose              |
| -------------- | ----- | ------ | -------------------- |
| mobile-small   | 375   | 812    | Small phones         |
| mobile         | 390   | 844    | Common mobile        |
| mobile-edge-sm | 639   | 812    | Just below sm (640)  |
| sm             | 640   | 900    | At sm breakpoint     |
| tablet-edge-md | 767   | 1024   | Just below md (768)  |
| tablet         | 768   | 1024   | At md breakpoint     |
| tablet-edge-lg | 1023  | 768    | Just below lg (1024) |
| lg             | 1024  | 900    | At lg breakpoint     |
| xl             | 1280  | 900    | At xl breakpoint     |
| 2xl            | 1536  | 864    | At 2xl breakpoint    |
| desktop        | 1440  | 900    | Common desktop       |


## Constraints

- No paid tools
- No new backend services
- Do not bump package versions unnecessarily
- Keep changes minimal and reversible
- Reuse existing config and scripts where they already exist

