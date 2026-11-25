# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Facebook Wall — 2008.** A nostalgic Facebook-style wall: a visitor types a
message, hits **Share**, and it appears in a live feed (newest first) that
persists across refreshes. No auth; every post carries a fixed display name.

Core behaviours:

1. A visitor can type a message and press **Share**.
2. The message is saved in Supabase.
3. The feed shows all messages, newest first, still present after a refresh.

Stack: Next.js 15 (App Router) · React 19 · Tailwind CSS v4 · shadcn/ui
(`base-nova`, `@base-ui/react`) · `@supabase/supabase-js` · Vitest.
Deploy target: Vercel.

## Commands

```bash
npm install          # install dependencies
npm run dev          # Next dev server with Turbopack (http://localhost:3000)
npm run build        # production build (next build --turbopack)
npm run start        # serve the production build
npm run lint         # ESLint 9 flat config (eslint.config.mjs)
npm run typecheck    # tsc --noEmit
npm test             # Vitest run — pure logic unit tests
npm run test:watch   # Vitest in watch mode
```

Run `npm run typecheck`, `npm run lint` and `npm test` before committing; run
`npm run build` before deploying.

## Architecture

- **No React/Next imports in logic or data modules.** `src/lib/posts/validation.ts`
  and `src/lib/posts/format.ts` are pure; `src/lib/posts/types.ts` is types only;
  `src/lib/posts/queries.ts` is Supabase I/O only. Everything UI-shaped belongs in
  `src/components/**`.
- **Supabase client** is `src/lib/supabase/client.ts` — a lazy singleton reading
  only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  (the legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` is accepted as a fallback). Never
  put a secret/service key in this repo.
- **The wall is one client component tree**: `src/components/wall/wall.tsx` owns
  posts / loading / error state; `post-composer.tsx`, `post-feed.tsx` and
  `post-card.tsx` are presentational. Do not add Context, Zustand or Redux.
- **Realtime**: `supabase.channel('wall').on('postgres_changes', { event: 'INSERT',
  schema: 'public', table: 'posts' }, …)` prepends new rows. Always unsubscribe on
  unmount and refetch on window focus as a fallback.
- **The 280-char limit matches the DB**: Postgres `char_length` counts code
  points, so count with `Array.from(body).length`, never `body.length`.
- **Fixed identity**: `ANON_USER_ID` (uuid) and `DISPLAY_NAME` live in
  `src/lib/posts/constants.ts`. The `posts` table has no user or name column.

## Database

`supabase/schema.sql` is the source of truth — paste it into the Supabase SQL
editor. It creates the `posts` table, then:

```sql
alter table public.posts enable row level security;
create policy "anon read"   on public.posts for select to anon using (true);
create policy "anon insert" on public.posts for insert  to anon with check (true);
alter publication supabase_realtime add table public.posts;
```

The publishable key maps to the `anon` role by default, so the `to anon` policies
apply. It only ever gets SELECT + INSERT. Realtime needs the publication line.
`.env.local` (gitignored) holds `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

## Conventions

- **Tailwind v4**: theme tokens live in `@theme` in `src/app/globals.css`. Do
  **not** create `tailwind.config.js`. Facebook palette: `fb-blue` `#3b5998`,
  `fb-blue-dark` `#2d4373`, `fb-bg` `#e9ebed`, `fb-surface` `#ffffff`,
  `fb-border` `#ccd0d5`, `fb-text` `#1c1e21`, `fb-link` `#385898`.
- Typeface is the 2008 system stack (`"Lucida Grande", tahoma, verdana, arial`),
  not a webfont — keeps the build offline and the look authentic.
- shadcn primitives are in `src/components/ui`; `cn()` comes from `@/lib/utils`.
  Path alias `@/*` → `src/*`.
- TypeScript strict; no `any`.
- Accessibility: labelled `<textarea>`, feed uses `aria-live="polite"`, Share is a
  real `<button>` disabled while empty or over limit, and the remaining-character
  count is exposed to assistive tech.

## Testing

- Vitest, **node** environment, colocated `src/lib/posts/*.test.ts` (char
  counting, validation, timestamp formatting, feed sorting).
- `vitest.config.mts` mirrors the `@` alias. No Playwright/e2e in the first pass.

## CI & Deploy

- `.github/workflows/ci.yml` runs typecheck, lint, unit tests and build on
  push/PR.
- Vercel import from the GitHub default branch; build command `npm run build`;
  add the two `NEXT_PUBLIC_*` env vars in the Vercel dashboard. The production
  URL is the public entry point (`https://<project>.vercel.app`).
- Work on a feature branch and open a PR; the user merges. Do not merge to `main`
  yourself.
