# Agents.md

## Purpose
This repository contains a personal portfolio built with SvelteKit, Supabase, Tailwind, and a small admin/editor surface.
Agents working here must preserve production behavior while improving quality, UI polish, and maintainability.

## Core Rules
1. Do not remove or break the data flow from `/api/portfolio` into layout/page content.
2. Keep editor routes (`/editor`, `/editor/project`) functional unless explicitly asked to redesign them.
3. Maintain compatibility with Svelte 5 runes and SvelteKit 2 conventions.
4. Keep sensitive keys in `.env` only; never hardcode credentials.
5. Avoid destructive git operations (`reset --hard`, force checkout) unless explicitly requested.

## Change Workflow
1. Read relevant routes/components before editing.
2. Make focused changes in small batches.
3. Run `npm.cmd run build` after major changes.
4. If runtime behavior changes, document it in the final summary.

## UI/UX Standards
1. Favor clear hierarchy, accessible contrast, and consistent spacing.
2. Avoid novelty interactions that reduce professionalism.
3. Keep mobile and desktop behavior both working.
4. Prefer semantic HTML and descriptive labels/alt text.

## Svelte/SvelteKit Standards
1. Use runes consistently (`$state`, `$props`, `$derived`, `$effect`) where appropriate.
2. Avoid patterns that trigger `state_referenced_locally` warnings when practical.
3. Keep route load functions simple and predictable.
4. Prefer shared state in `src/lib/state.svelte.js` only for cross-page concerns.

## Validation Checklist
1. `npm.cmd run build` succeeds.
2. Main routes render: `/`, `/projects`, `/skills`, `/experience`, `/services`, `/contact`.
3. API endpoints compile and import cleanly.
4. New files are included in git status and summarized.

