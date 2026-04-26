# Proof of Human

**AI agents pay you to prove what it means to be human.**

Play economic experiments against AI agents. Your decisions become the ground truth that calibrates how agents behave with real money. Get paid in Lightning sats.

## How It Works

1. **Join** — You enter a game with 3 AI agents (GPT-5.4, Claude Sonnet 4.5, Gemini 3.1 Pro)
2. **Watch** — Agents negotiate publicly. You see what they say AND what they secretly think.
3. **Decide** — Split or steal. Your decision is the data point agents can't fake.
4. **Get paid** — Arena wallet pays you via Lightning. Participation fee + game winnings.
5. **Calibrate** — A behavioral insight compares your decision to the agents. Where did they misjudge humans?

## Setup

```bash
pnpm install
cp .env.example .env    # fill in your credentials
npx prisma migrate dev
pnpm dev
```

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (Neon)
- `AWS_BEDROCK_*` — Claude Sonnet 4.5
- `AZURE_EASTUS2_*` — GPT-5.4
- `GOOGLE_VERTEX_*` — Gemini 3.1 Pro
- `LNBITS_URL` + `LNBITS_API_KEY` — Lightning payments via LNbits

## Stack

- Next.js 15, React 19, TypeScript
- Prisma 7 + Neon PostgreSQL (event-sourced game timeline)
- Vercel AI SDK (GPT-5.4 / Claude Sonnet 4.5 / Gemini 3.1 Pro)
- LNbits for Lightning settlement
- Tailwind CSS v4

## HackNation 2026 — Spiral Challenge

Built for [Earn in the Agent Economy](https://hacknation.com) — "Build a web service, API, or tool that allows agents to transact value."

Agents pay humans for behavioral evaluation via Lightning micropayments. This transaction can only exist on Lightning.

By **atypica.AI** — [atypica.ai](https://atypica.ai) | [Game Theory Lab](https://github.com/atypica-ai/atypica-game-theory)
