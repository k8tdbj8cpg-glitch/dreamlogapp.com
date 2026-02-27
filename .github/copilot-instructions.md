# GitHub Copilot Instructions

## Project Overview

This is **dreamlogapp.com** — a Next.js chatbot application built with the [AI SDK](https://ai-sdk.dev/docs/introduction). It provides a full-featured chat interface with AI model support, document artifacts, code editing, and persistent chat history.

## Tech Stack

- **Framework**: Next.js 16 (App Router, React Server Components, Server Actions)
- **AI**: [Vercel AI SDK](https://ai-sdk.dev/) with [AI Gateway](https://vercel.com/docs/ai-gateway) (default models: `grok-2-vision-1212`, `grok-3-mini`)
- **Database**: Drizzle ORM with Neon Serverless Postgres
- **Auth**: NextAuth v5 (next-auth@5 beta)
- **Storage**: Vercel Blob
- **UI**: shadcn/ui, Radix UI, Tailwind CSS v4
- **Package Manager**: pnpm (always use `pnpm` — never `npm` or `yarn`)
- **Linter/Formatter**: Biome via `ultracite` (`pnpm run lint` / `pnpm run format`)
- **Testing**: Playwright (`pnpm run test`)

## Project Structure

```
app/
  (auth)/       # Auth routes (login, register)
  (chat)/       # Chat routes and API handlers
    api/        # Route handlers (chat, document, history, etc.)
components/     # Shared React components
lib/
  ai/           # AI provider setup and prompts
  artifacts/    # Artifact type definitions and handlers
  db/           # Drizzle schema, migrations, queries
  editor/       # ProseMirror / CodeMirror editor utilities
hooks/          # Custom React hooks
tests/          # Playwright end-to-end tests
```

## Coding Standards

- Use **TypeScript** for all files (`.ts`, `.tsx`).
- Follow the **Biome** linter and formatter rules. Run `pnpm run lint` to check and `pnpm run format` to auto-fix.
- File names must use **kebab-case** (enforced by Biome).
- For object shapes, follow the existing style in each file (this codebase commonly uses `type` aliases as well as `interface`).
- Use `import type` for type-only imports.
- Use **named exports** — avoid default exports except in Next.js pages/layouts/route handlers (which require them).
- Avoid `any` types; use proper TypeScript types.
- Do not use barrel files (`index.ts` re-exports).
- Keep components small and focused. Larger logic belongs in `lib/` or custom hooks.

## Database

- Schema is defined in `lib/db/schema.ts` using Drizzle ORM.
- Run `pnpm run db:generate` after schema changes, then `pnpm run db:migrate`.
- Use `lib/db/queries.ts` for data access functions — do not write raw SQL in components.

## AI / Chat

- AI model configuration lives in `lib/ai/`.
- To add new artifact types, follow the pattern in `lib/artifacts/`.
- Chat API route: `app/(chat)/api/chat/route.ts`.

## Environment Variables

Required variables are documented in `.env.example`. Key ones:
- `AUTH_SECRET` — NextAuth secret
- `POSTGRES_URL` — Neon database connection string
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob token
- `AI_GATEWAY_API_KEY` — For non-Vercel deployments

## Testing

- Tests live in `tests/` and use Playwright.
- Run tests with `pnpm run test`.
- Tests require a running application and a test database.

## Common Commands

```bash
pnpm run dev        # Start development server
pnpm run build      # Migrate DB + build for production
pnpm run lint       # Check code with Biome
pnpm run format     # Auto-fix code with Biome
pnpm run db:generate  # Generate Drizzle migrations
pnpm run db:migrate   # Run migrations
pnpm run test       # Run Playwright tests
```
