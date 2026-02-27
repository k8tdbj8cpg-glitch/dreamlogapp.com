# Copilot Instructions

## Project Overview

This is **dreamlogapp.com**, an AI-powered chat application built on the [AI SDK](https://sdk.vercel.ai/) and deployed on [Vercel](https://vercel.com). It supports multi-modal inputs, artifact creation (text, code, sheets, images), and integrates with a PostgreSQL database via Drizzle ORM.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router) with React 19
- **AI Integration**: Vercel AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/gateway`)
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [NextAuth.js v5](https://authjs.dev/) (credentials-based, guest + regular users)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with shadcn/ui components
- **Editor**: ProseMirror (rich text), CodeMirror (code)
- **Testing**: Playwright (end-to-end)
- **Linting/Formatting**: [Biome](https://biomejs.dev/) via [Ultracite](https://ultracite.ai/) preset
- **Package Manager**: pnpm

## Project Structure

```
app/                   # Next.js App Router pages and API routes
  (auth)/              # Authentication pages and config (login, register)
  (chat)/              # Chat UI and API routes
artifacts/             # Artifact renderers (code, image, sheet, text)
components/            # Shared React components
  ai-elements/         # AI-specific UI components (message, tool, canvas, etc.)
  ui/                  # shadcn/ui base components (do not lint these)
hooks/                 # Custom React hooks
lib/
  ai/                  # AI tools, providers, prompts, entitlements
  artifacts/           # Server-side artifact handlers
  db/                  # Drizzle schema, queries, migrations
  editor/              # ProseMirror editor helpers
tests/                 # Playwright e2e tests
```

## Key Conventions

- Use **kebab-case** for all file names (enforced by Biome/Ultracite).
- Prefer **interfaces** over types for object shapes where possible (though `useConsistentTypeDefinitions` is disabled).
- All imports should use `type` imports where applicable (`import type { ... }`).
- Use `"use client"` / `"use server"` directives appropriately for Next.js Server/Client Components.
- No barrel files (`index.ts` re-exports) — import directly from source files.
- No magic numbers — extract named constants.
- CSS uses Tailwind utility classes; custom CSS is in `app/globals.css`.

## Linting and Formatting

Run lint and format with:

```bash
pnpm lint     # ultracite check (biome-based)
pnpm format   # ultracite fix (biome-based, auto-fixes)
```

Biome is configured in `biome.jsonc` extending Ultracite presets for Next.js and React.  
Excluded from linting: `components/ui/`, `lib/utils.ts`, `hooks/use-mobile.ts`.

## Database

- Schema: `lib/db/schema.ts`
- Queries: `lib/db/queries.ts`
- Migrations: `lib/db/migrations/`

Run migrations: `pnpm db:migrate`  
Generate migrations: `pnpm db:generate`

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

- `POSTGRES_URL` — PostgreSQL connection string
- `AUTH_SECRET` — NextAuth secret
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob token (for file uploads)
- Model API keys as required by `lib/ai/providers.ts`

## Testing

End-to-end tests use Playwright:

```bash
pnpm test
```

Tests are in `tests/e2e/`. Helpers and fixtures are in `tests/`.

## Artifact System

Artifacts (text documents, code files, spreadsheets, images) are handled via:
- Client renderers in `artifacts/`
- Server-side tools in `lib/ai/tools/`
- The `ArtifactKind` type in `components/artifact.tsx`

## AI Tools

AI tools are defined in `lib/ai/tools/` and include:
- `create-document` — creates a new artifact
- `update-document` — updates an existing artifact
- `request-suggestions` — requests text improvement suggestions
- `get-weather` — example weather tool
