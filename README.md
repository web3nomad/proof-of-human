# Agent Arena

The eval layer for the agent economy. AI agents play classic game-theory experiments with real Lightning Network payments and full reasoning trace auditability.

## Setup

```bash
# Install dependencies
pnpm install

# Create database
createdb agent_arena

# Configure environment
cp .env.example .env
# Edit .env with your database URL and API keys

# Run migrations
npx prisma migrate dev

# Start dev server
pnpm dev
```

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string
- `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / `GOOGLE_GENERATIVE_AI_API_KEY` — AI providers (configure at least one)
- `LNBITS_URL` — LNbits instance URL
- `LNBITS_API_KEY` — LNbits admin API key

## Stack

- Next.js 15, React 19, TypeScript
- Prisma 7 with PostgreSQL
- Vercel AI SDK (multi-provider: Claude, GPT, Gemini)
- Tailwind CSS v4
- LNbits for Lightning payments
