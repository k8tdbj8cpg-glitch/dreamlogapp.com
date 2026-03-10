<h1 align="center">DreamLogApp</h1>

<p align="center">
    An AI-powered dream journal built with Next.js, the AI SDK, and PostgreSQL.
    Log your dreams, discover patterns, and gain insight with the help of artificial intelligence.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a> ·
  <a href="#contributing"><strong>Contributing</strong></a>
</p>
<br/>

## Features

- [Next.js](https://nextjs.org) App Router
  - Advanced routing for seamless navigation and performance
  - React Server Components (RSCs) and Server Actions for server-side rendering and increased performance
- [AI SDK](https://ai-sdk.dev/docs/introduction)
  - Unified API for generating text, structured objects, and tool calls with LLMs
  - Hooks for building dynamic chat and generative user interfaces
  - Supports xAI (default), OpenAI, Fireworks, and other model providers
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - Component primitives from [Radix UI](https://radix-ui.com) for accessibility and flexibility
- Data Persistence
  - [Neon Serverless Postgres](https://vercel.com/marketplace/neon) for saving dream journals and user data
  - [Vercel Blob](https://vercel.com/storage/blob) for efficient file storage
- [Auth.js](https://authjs.dev)
  - Simple and secure authentication
- Dream Journal
  - AI-assisted dream interpretation and pattern recognition
  - Reusable UI components under `src/components/` (Header, Footer)
  - Placeholder pages under `src/pages/` (Home)
  - API helpers under `src/api/` for future backend integration

## Model Providers

This template uses the [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) to access multiple AI models through a unified interface. The default configuration includes [xAI](https://x.ai) models (`grok-2-vision-1212`, `grok-3-mini`) routed through the gateway.

### AI Gateway Authentication

**For Vercel deployments**: Authentication is handled automatically via OIDC tokens.

**For non-Vercel deployments**: You need to provide an AI Gateway API key by setting the `AI_GATEWAY_API_KEY` environment variable in your `.env.local` file.

With the [AI SDK](https://ai-sdk.dev/docs/introduction), you can also switch to direct LLM providers like [OpenAI](https://openai.com), [Anthropic](https://anthropic.com), [Cohere](https://cohere.com/), and [many more](https://ai-sdk.dev/providers/ai-sdk-providers) with just a few lines of code.

## Deploy Your Own

You can deploy your own version of DreamLogApp to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/templates/next.js/chatbot)

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run DreamLogApp. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env.local` file is all that is necessary.

> Note: You should not commit your `.env.local` file or it will expose secrets that will allow others to control access to your various AI and authentication provider accounts.

### Setup Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/k8tdbj8cpg-glitch/dreamlogapp.com.git
   cd dreamlogapp.com
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual credentials
   ```

4. **Set up the database** (requires a running PostgreSQL instance):
   ```bash
   pnpm db:migrate
   ```

5. **Start the development server**:
   ```bash
   pnpm dev
   ```

Your app should now be running on [localhost:3000](http://localhost:3000).

### Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server with Turbopack |
| `pnpm build` | Run migrations + Next.js production build |
| `pnpm lint` | Lint code with Biome via ultracite |
| `pnpm format` | Auto-fix formatting with Biome via ultracite |
| `pnpm db:generate` | Generate Drizzle migration files |
| `pnpm db:migrate` | Apply pending database migrations |
| `pnpm db:studio` | Open Drizzle Studio (database GUI) |
| `pnpm test` | Run Playwright end-to-end tests |

## Contributing

Contributions are welcome! To get started:

1. **Fork** the repository and create a feature branch from `main`.
2. **Install** dependencies with `pnpm install`.
3. **Make** your changes, following the existing code style (Biome / ultracite).
4. **Lint** your changes: `pnpm lint`
5. **Test** your changes: `pnpm test`
6. **Open a pull request** with a clear description of what you've changed and why.

### Code Style

- Formatter: spaces, indent width 2 (configured in `biome.jsonc`)
- Linting and formatting via `pnpm lint` / `pnpm format`
- Import aliases: use `@/` for the project root
- TypeScript strict mode enabled

### Project Structure

```
app/          # Next.js App Router pages and API routes
src/
  components/ # Reusable UI components (Header, Footer, …)
  pages/      # Page-level components (Home, …)
  api/        # API helper functions
components/   # Shared shadcn/ui components
lib/          # DB schema, AI helpers, utilities
public/       # Static assets (favicon.ico, manifest.json, images)
tests/        # Playwright end-to-end tests
```
