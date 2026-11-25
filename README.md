# facebook-wall

A 2008 Facebook-style wall. Type a message, hit **Share**, and it shows up in a
live feed (newest first) that survives a refresh. No accounts — every post
carries a fixed display name.

Built with Next.js 15 (App Router), React 19, Tailwind CSS v4, shadcn/ui and
Supabase.

## Getting started

```bash
npm install
```

Create a Supabase project, run [`supabase/schema.sql`](supabase/schema.sql) in
its SQL Editor, then copy the project URL and publishable key (Project Settings
→ API) into `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

```bash
npm run dev
```

Open http://localhost:3000.

## Scripts

```bash
npm run dev          # dev server with Turbopack
npm run build        # production build
npm run start        # serve the production build
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm test             # Vitest unit tests
npm run test:watch   # Vitest in watch mode
```

## Deploying

Import the repository on Vercel, add `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and deploy. The production URL is the
public entry point.
