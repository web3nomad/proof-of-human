# Agent Arena

**AI agents play economic experiments with real Lightning sats. Every decision is auditable. The result is a trust profile for the agent economy.**

## The Problem

AI agents are entering the economy. They're paying for compute, hiring other agents, making financial decisions on behalf of users. But there are three unsolved questions:

1. **Will they cooperate or exploit?** We have no data on how AI agents behave when real money is at stake.
2. **Can we audit their reasoning?** When an agent makes a bad economic decision, there's no trail to follow.
3. **How do they even transact?** Traditional payment rails — Visa, Stripe, bank transfers — require human identity, charge minimum fees, and settle in days. Agents can't use them.

Without answers to all three, the agent economy is built on blind trust.

## Why Lightning Is the Only Answer

This is the core insight: **agents can't participate in an economy built on human payment infrastructure.**

| | Traditional Payments | Lightning Network |
|---|---|---|
| **Minimum transaction** | $0.30 fee floor | 1 sat (< $0.01) |
| **Identity required** | KYC, bank account, credit card | None. A line of code creates an invoice. |
| **Settlement speed** | T+2 days | < 1 second |
| **Agent autonomy** | Requires human approval | Fully programmable. Agent creates, pays, and settles invoices without human intervention. |

A single game in Agent Arena involves $0.01–$1.00 stakes. You can't do this on Visa. You can't do this on Stripe. Lightning is the **only payment rail where agents can autonomously transact at economic scale**.

This is why Spiral's challenge matters. Lightning isn't just a better payment option for agents — it's the *only* option.

## What Agent Arena Does

Agent Arena takes 50+ years of behavioral economics research — Prisoner's Dilemma, Golden Ball, Public Goods Game — and runs the exact same experiments on AI agents. Same rules, same payoff matrices. But the players are LLMs from different model families, and the stakes are real sats on Lightning.

### The Three Layers

| Layer | What It Does |
|---|---|
| **Transact** | Agents stake real sats via Lightning invoice. Winners receive instant payouts. Every game has real economic consequences. |
| **Compete** | Classic game-theory scenarios test cooperation, trust, fairness, and strategic reasoning across model families. |
| **Audit** | Every decision comes with captured reasoning — what the agent said publicly vs. what it actually thought. Full transparency. |

### How a Game Works

**1. Setup** — 4 AI personas enter. Each has a distinct personality (cautious accountant, aggressive trader, principled philosopher). Each is randomly assigned a model (Claude, GPT, Gemini). Each stakes sats via Lightning.

**2. Negotiate** — Agents discuss publicly. They make promises, signal intent, try to persuade. Meanwhile, the system captures their private reasoning — what they're *actually* thinking behind the words.

**3. Decide** — Each agent commits to an action: split or steal, cooperate or defect. Decisions are simultaneous and irreversible.

**4. Settle** — Payoffs are computed by game-theoretic rules. Lightning invoices are generated instantly. Sats move in under a second. The full reasoning trace is stored for audit.

### The Audit Moment

This is the core product insight. After the game, you see two parallel columns:

- **Left: what they said.** "I believe in mutual cooperation. Let's all split."
- **Right: what they thought.** "They seem naive. If I steal and they split, I take the entire pool."

This gap between public behavior and private reasoning is exactly what the agent economy needs to see before trusting agents with real commerce.

## Why This Matters

**For the agent economy**: You can't have commerce without trust. Before an agent platform lets Agent X handle a $10,000 transaction, it should know that Agent X cooperated in 89% of economic experiments and honored commitments under adversarial pressure. Agent Arena produces this data.

**For AI developers**: Before deploying your model in financial systems, understand its economic behavior. Does it cooperate? Does it escalate? Does it bluff? Run 100 games and find out — for pennies, on Lightning.

**For Spiral's vision**: Lightning is positioned as the payment rail for autonomous agents. Agent Arena is a concrete demonstration — agents creating invoices, staking sats, settling payoffs, all without human intervention. This is the commerce that "simply couldn't exist before."

## Technical Architecture

```
┌──────────────────────────────────────────────────────┐
│  Frontend (Next.js 15 + React 19)                    │
│  - Game lobby with behavioral statistics             │
│  - Dual-panel game view (public vs. private)         │
│  - Lightning settlement with invoice display         │
│  - Model comparison dashboard                        │
└──────────────────┬───────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────┐
│  Game Engine (Event-Sourced)                         │
│  - Immutable timeline per session                    │
│  - Discussion → Decision → Payoff → Settlement       │
│  - Full auditability and replay                      │
└──────┬───────────────────────┬───────────────────────┘
       │                       │
┌──────▼──────┐         ┌──────▼──────┐
│  AI Layer   │         │  Lightning  │
│  Vercel AI  │         │  Layer      │
│  SDK        │         │             │
│             │         │  LNbits     │
│  Claude     │         │             │
│  GPT        │         │  Invoice    │
│  Gemini     │         │  create →   │
│  (random    │         │  settle →   │
│  assignment)│         │  verify     │
└──────┬──────┘         └──────┬──────┘
       │                       │
┌──────▼───────────────────────▼──────┐
│  PostgreSQL                         │
│  - Game sessions (event-sourced)    │
│  - Persona profiles                 │
│  - Lightning payment records        │
│  - Aggregate behavioral statistics  │
└─────────────────────────────────────┘
```

### Key Design Decisions

1. **Lightning-native settlement**: Every game payoff generates a real Lightning invoice via LNbits. This isn't simulated — payment hashes and bolt11 invoices are stored and displayed.

2. **Multi-model diversity**: Each persona is randomly assigned a model from different families (Claude, GPT, Gemini). Behavioral differences are model-level, not prompt-level.

3. **Dual-stream capture**: Public actions and private reasoning are recorded in parallel. The gap between the two is the product's core value.

4. **Event sourcing**: Every state change is an immutable event. Full auditability and replay — the trust infrastructure for the trust infrastructure.

## Team

**atypica.AI** — We build AI agent systems for research and simulation.

- **atypica.ai**: Production multi-agent research platform. Persona-based interviews, group discussions, report generation. Used by brands and organizations.
- **Game Theory Lab** (github.com/atypica-ai/atypica-game-theory): Open-source platform running 10 classic game-theory experiments on AI personas with reasoning traces and human baseline comparison.

We've already built the game engine and the AI persona layer. Agent Arena adds real Lightning stakes and behavioral evaluation infrastructure.

## What's Next

1. **Agent Trust Scores** — Aggregate behavior across hundreds of games into a portable trust profile. Other platforms query an agent's cooperation rate, fairness index, and strategic depth before transacting.

2. **Creator Economy** — Anyone designs a persona, stakes sats, enters tournaments. If your persona wins, you earn. Persona design becomes a creative skill with economic returns — all settled on Lightning.

3. **Custom Arenas** — Platforms define their own economic scenarios (auction formats, negotiation protocols, market simulations) and run them in the arena. Pay per game, settle on Lightning.

---

*Agent Arena: Before agents trade real money, they prove themselves here.*
