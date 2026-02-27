# GitHub Copilot Instructions

## Project Overview

This is **dreamlogapp.com**, a Next.js-based AI chatbot application built with the [Vercel AI SDK](https://ai-sdk.dev). It provides a full-featured chat interface with AI-powered assistants, supporting multi-modal inputs, document creation/editing, code execution, and more.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, React Server Components, Server Actions)
- **AI**: [Vercel AI SDK](https://ai-sdk.dev) with [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) (default: xAI `grok-2-vision-1212`, `grok-3-mini`)
- **UI**: [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://radix-ui.com) + [Tailwind CSS v4](https://tailwindcss.com)
- **Database**: [Drizzle ORM](https://orm.drizzle.team) + [Neon Serverless Postgres](https://vercel.com/marketplace/neon)
- **Storage**: [Vercel Blob](https://vercel.com/storage/blob)
- **Auth**: [Auth.js v5](https://authjs.dev)
- **Linting/Formatting**: [Biome](https://biomejs.dev) via [Ultracite](https://ultracite.ai) (`^7.0.11`, requires Biome `>=2.4.4`)
- **Testing**: [Playwright](https://playwright.dev)
- **Package Manager**: [pnpm](https://pnpm.io) v9.12.3

## Project Structure

```
app/
  (auth)/           # Auth routes (login, register)
  (chat)/           # Chat routes and API handlers
  globals.css       # Global styles (Tailwind CSS)
  layout.tsx        # Root layout
artifacts/          # Artifact renderers (code, image, sheet, text)
components/
  ui/               # shadcn/ui components (excluded from linting)
  ai-elements/      # AI-specific UI components
  *.tsx             # Feature components
hooks/              # Custom React hooks
lib/
  ai/               # AI providers, models, prompts, tools
  db/               # Drizzle schema, queries, migrations
  editor/           # ProseMirror editor utilities
  types.ts          # Shared TypeScript types
tests/              # Playwright e2e tests
```

## Development Setup

```bash
pnpm install
pnpm db:migrate     # Apply database migrations
pnpm dev            # Start development server (localhost:3000)
```

Required environment variables (see `.env.example`):
- `DATABASE_URL` – Neon Postgres connection string
- `AUTH_SECRET` – Auth.js secret
- `AI_GATEWAY_API_KEY` – AI Gateway API key (non-Vercel deployments)

## Code Style & Conventions

This project uses **Biome** (via Ultracite) for linting and formatting. Run:

```bash
pnpm lint     # Check for issues (ultracite check)
pnpm format   # Auto-fix issues (ultracite fix)
```

### Key Rules (enforced by Ultracite/Biome)

- **TypeScript**: Strict types, no `any`, no `@ts-ignore`, use `import type` for type-only imports
- **Imports**: Sorted automatically by Biome's `organizeImports` assist
- **JSX Attributes**: Sorted alphabetically by Biome's `useSortedAttributes` assist
- **React**: No nested component definitions, proper hook dependency arrays, key props required
- **Accessibility**: All interactive elements must be keyboard-accessible, SVGs need titles
- **No enums**: Use `as const` objects instead of TypeScript enums
- **No namespaces**: Use ES modules
- **Arrow functions**: Prefer over function expressions

### Excluded from Linting

The following paths are excluded from Biome linting:
- `components/ui/` – shadcn/ui auto-generated components
- `lib/utils.ts` – Utility helpers
- `hooks/use-mobile.ts` – Auto-generated hook

### CSS & Styling

- Use Tailwind CSS v4 utility classes
- Design tokens defined in `app/globals.css` as CSS custom properties
- Use `cn()` from `lib/utils.ts` for conditional class merging
- Dark mode via `.dark` class (programmatic, not system preference)

## AI Features

- **Multi-model support** via Vercel AI Gateway
- **Artifacts**: Documents (text/markdown), code files, spreadsheets, images
- **Tools**: Weather lookup, document creation/update, suggestion requests
- **Streaming**: Uses AI SDK's streaming APIs for real-time responses
- **Chat history**: Persisted to Postgres via Drizzle ORM

## Database

```bash
pnpm db:generate   # Generate migration files from schema
pnpm db:migrate    # Run pending migrations
pnpm db:studio     # Open Drizzle Studio
pnpm db:push       # Push schema changes directly (dev only)
```

## Testing

```bash
pnpm test          # Run Playwright e2e tests
```

Tests are in `tests/e2e/`. Requires a running application instance.

## Deployment

Deploy to Vercel with one click. The AI Gateway authentication is handled automatically via OIDC tokens on Vercel deployments.
