# Agent Context

## Repository Snapshot
- Framework: SvelteKit
- Language mode: JavaScript (no TS source files in app logic)
- Styling: Tailwind CSS + custom CSS variables
- Data backend: Supabase (`event.locals.supabase` from `src/hooks.server.js`)
- Hosting target: Netlify (`@sveltejs/adapter-netlify`)

## Current Dependency Baseline
- `svelte`: `^5.55.1`
- `@sveltejs/kit`: `^2.55.0`
- `@sveltejs/vite-plugin-svelte`: `^7.0.0`
- `vite`: `^8.0.3`
- `@sveltejs/adapter-netlify`: `^6.0.4`

## Key Runtime Flow
1. `src/hooks.server.js` creates request-scoped Supabase client.
2. `src/routes/+layout.server.js` fetches `/api/portfolio`.
3. `src/routes/+layout.svelte` stores payload in `portfolioContext.info`.
4. Pages/components read data from `data` props and `portfolioContext`.

## Important Files
- App shell: `src/routes/+layout.svelte`
- Landing page: `src/routes/+page.svelte`
- Section components: `src/lib/pages/*.svelte`
- Projects list/detail: `src/routes/projects/+page.svelte`, `src/routes/projects/[project_slug]/+page.svelte`
- Shared global styles: `src/app.css`
- Portfolio API: `src/routes/api/portfolio/+server.js`
- Contact mail API: `src/routes/api/contact/message/+server.js`
- Editor UI: `src/routes/editor/+layout.svelte`, `src/routes/editor/+page.svelte`, `src/routes/editor/project/+page.svelte`

## Agent Priorities
1. Preserve route/data behavior before visual changes.
2. Keep component contracts stable (`data`, `pageData`, `isMobile` props).
3. Improve professionalism of typography, spacing, color discipline, and interaction quality.
4. Prefer low-risk refactors unless asked for deeper architectural changes.

## Validation Commands
- Build: `npm.cmd run build`
- Lint: `npm.cmd run lint`
- Dev: `npm.cmd run dev`

## Notes
- Existing codebase includes mobile hash-based section navigation and desktop multi-route behavior.
- Some files may emit Svelte rune warnings (`state_referenced_locally`); clean these where touched.
- Avoid changing API shapes consumed by the editor unless coordinated across corresponding route handlers.

