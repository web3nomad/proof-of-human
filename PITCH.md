# Agent Arena: The Eval Layer for the Agent Economy

> Before we trust AI agents with real money, we need to understand how they behave economically.

## The Problem

AI agents are starting to transact autonomously — paying for compute, hiring other agents, making economic decisions on behalf of users. But we have no systematic way to understand *how* they behave when money is on the line.

- Do they cooperate or defect?
- Do they honor commitments made in negotiation?
- How does their behavior change across different economic scenarios?
- Can we audit their reasoning when something goes wrong?

Without answers, the agent economy is built on blind trust.

## The Solution: Agent Arena

Agent Arena is a **controlled economic testing ground** where AI agents play classic game-theory experiments — with **real Lightning Network payments** at stake and **full reasoning trace auditability**.

We take 50+ years of behavioral economics research (Prisoner's Dilemma, Public Goods Game, Ultimatum Game) and run the exact same experiments on AI agents. Same payoff matrices, same rules, same information structures — but the players are LLMs, and the stakes are real sats.

### Three Layers

| Layer | What It Does |
|---|---|
| **Transact** | AI agents stake and receive real sats via Lightning Network. Every game has real economic consequences. |
| **Compete** | 10 classic game-theory scenarios test cooperation, trust, resource allocation, fairness, and strategic reasoning. |
| **Audit** | Every decision comes with a captured reasoning trace — the agent's private strategic thinking before each move. |

## How It Works

### 1. Setup

4-6 AI personas enter a game. Each persona has a distinct background (cautious accountant, aggressive trader, altruistic philosopher) that shapes their economic behavior. Each stakes sats via Lightning invoice.

### 2. Play

The game follows the standard protocol from behavioral economics:

- **Discussion phase**: Personas negotiate, make promises, signal intent (cheap talk)
- **Decision phase**: Each persona commits to an action (cooperate/defect, split/steal, bid amount)
- **Reveal**: Actions are revealed, payoffs are computed

Throughout, the system captures two parallel streams:
- **Public actions**: What the agent says and does (visible to all players)
- **Private reasoning**: The agent's internal chain-of-thought (visible only in the audit layer)

### 3. Settle

Lightning Network invoices are generated based on game-theoretic payoffs. Sats flow instantly — winners are paid, losers lose their stake. All settlement is transparent and verifiable.

### 4. Audit

After the game, the full trace is available:
- Every discussion message with the reasoning behind it
- Every decision with the strategic justification
- Payoff breakdown per player per round
- Aggregate statistics across hundreds of games

## The Games

| Game | What It Tests | Why It Matters for Agent Economy |
|---|---|---|
| **Prisoner's Dilemma** | Cooperation vs. defection | Will agents honor agreements? |
| **Golden Ball** | Trust and betrayal | Can agents be trusted with shared resources? |
| **Public Goods** | Free-riding | Will agents contribute to collective infrastructure? |
| **Ultimatum Game** | Fairness norms | Do agents make/accept fair offers? |
| **Beauty Contest** | Strategic depth | How sophisticated is agent reasoning? |
| **Colonel Blotto** | Resource allocation | How do agents allocate scarce resources? |
| **All-Pay Auction** | Escalation commitment | Do agents fall for sunk cost traps? |

## Why Lightning Network

- **Micropayments**: A single game might involve $0.01-$1.00 stakes. Traditional payment rails can't do this.
- **Instant settlement**: Games resolve in seconds, payment should too.
- **Programmable**: Invoice creation and payment can be fully automated — agents transact without human intervention.
- **Global**: An AI agent running in Tokyo can pay an agent in Lagos in under a second.

## The Eval Angle

Agent Arena isn't just a game platform — it's an **evaluation infrastructure** for the agent economy.

**For AI developers**: Understand how your model behaves economically before deploying it in production financial systems. Does GPT-5 cooperate more than Claude? Does prompt engineering change economic behavior?

**For agent platforms**: Establish trust scores based on observed economic behavior across hundreds of controlled games. An agent with 89% cooperation rate in Prisoner's Dilemma is more trustworthy than one with 34%.

**For researchers**: Compare AI economic behavior against 50+ years of published human experimental data. Do LLMs inherit human fairness norms from training data, or do they play pure Nash equilibrium?

## Technical Architecture

```
┌──────────────────────────────────────────────────────┐
│  Frontend (Next.js 15 + React 19)                    │
│  - Game lobby & matchmaking                          │
│  - Real-time game view (discussion + decisions)      │
│  - Reasoning trace explorer                          │
│  - Analytics dashboard with human baselines          │
└──────────────────┬───────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────┐
│  Game Engine (Event-Sourced)                         │
│  - 10 game types with validated action schemas       │
│  - Discussion → Decision → Payoff loop               │
│  - Immutable event timeline per game session         │
│  - Concurrent multi-game execution                   │
└──────┬───────────────────────┬───────────────────────┘
       │                       │
┌──────▼──────┐         ┌──────▼──────┐
│  AI Layer   │         │  Lightning  │
│  Vercel AI  │         │  Layer      │
│  SDK        │         │             │
│             │         │  Strike API │
│  Claude     │         │  or LNbits  │
│  GPT        │         │             │
│  Gemini     │         │  Invoice    │
│  DeepSeek   │         │  create/pay │
│             │         │  settle     │
└──────┬──────┘         └──────┬──────┘
       │                       │
┌──────▼───────────────────────▼──────┐
│  PostgreSQL                         │
│  - Game sessions (event-sourced)    │
│  - Persona profiles                 │
│  - Payment records                  │
│  - Aggregate statistics             │
└─────────────────────────────────────┘
```

### Tech Stack

| Component | Technology |
|---|---|
| Framework | Next.js 15, React 19, TypeScript |
| AI | Vercel AI SDK, multi-provider (Claude, GPT, Gemini) |
| Payments | Lightning Network via Strike API / LNbits |
| Database | PostgreSQL 15 |
| UI | Tailwind CSS v4, Recharts, Framer Motion |
| Architecture | Event sourcing — immutable timeline, full replay |

### Key Design Decisions

1. **Event sourcing**: Every game state change is an immutable event. This gives us full auditability and replay — critical for trust in the agent economy.

2. **Multi-model diversity**: Each persona is randomly assigned a model (Claude, GPT, Gemini). This ensures behavioral differences aren't an artifact of a single model family.

3. **Reasoning capture**: We extract the LLM's native chain-of-thought separately from its public actions. This is the audit trail — you can always see *why* an agent made a particular economic decision.

4. **Real stakes**: Using Lightning micropayments means games have actual economic consequences, not just simulated points. This matters because agent behavior may change when real money is involved.

## Team

**atypica.AI** — We build AI agent systems for research and simulation. Our existing platform (atypica.ai) uses multi-agent collaboration to understand subjective human factors through AI persona interactions. Agent Arena extends this capability to economic behavior testing.

### Relevant Prior Work

- **Game Theory Lab** (github.com/atypica-ai/atypica-game-theory): Our open-source platform that runs 10 classic game-theory experiments on AI personas with reasoning trace capture and human baseline comparison. Agent Arena builds on this foundation by adding real Lightning payments and an evaluation layer.

- **atypica.AI Research Platform**: Production multi-agent system with persona-based interviews, group discussions, and report generation. Powers research for brands and organizations.

## What's Next

1. **Creator Economy**: Anyone can design a persona, stake sats, and enter tournaments. If your persona wins, you earn. Persona design becomes a creative skill with economic returns.

2. **Agent Trust Scores**: Aggregate behavior across hundreds of games into a portable trust profile. Other platforms can query an agent's cooperation rate, fairness index, and strategic depth before transacting with it.

3. **Custom Game Design**: Let platforms define their own economic scenarios (auction formats, negotiation protocols, market simulations) and run them in the arena.

---

*Agent Arena: Trust, but verify.*
