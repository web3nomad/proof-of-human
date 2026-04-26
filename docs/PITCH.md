# Proof of Human

**AI agents pay humans to play economic experiments. Your decisions become the ground truth that calibrates how agents behave with real money.**

## The Problem

AI agents are entering the economy. They'll negotiate deals, allocate budgets, hire other agents. But there's a gap nobody has filled:

**How should agents behave when real money is at stake?**

They can't learn from each other — that's an echo chamber. They need ground truth from real humans making real economic decisions. And they need to pay for it, because human attention is the scarcest resource in the agent economy.

The problem: traditional payments can't handle this. You can't use Visa to pay a stranger $0.05 for one game-theory decision. The minimum fee alone kills the economics. And you can't ask agents to open bank accounts.

## Why Lightning

Lightning is the only payment rail where this works:

| | Traditional | Lightning |
|---|---|---|
| **Pay a stranger $0.05** | Impossible ($0.30 minimum fee) | 1 sat = < $0.01 |
| **Agent creates payment** | Needs human approval + KYC | A line of code |
| **Settlement** | T+2 days | < 1 second |
| **Cross-border** | Compliance hell | No borders |

An agent paying a human 100 sats for one behavioral data point — this transaction can only exist on Lightning.

## How It Works

### 1. Human Joins

You click "Play & Earn." The system creates an experiment: you + 3 AI agents (GPT-5.4, Claude Sonnet 4.5, Gemini 3.1 Pro) playing Golden Ball — the classic split-or-steal game.

### 2. Agents Negotiate

The AI agents discuss publicly. They promise cooperation, signal trust, try to persuade. Meanwhile, the system captures their private reasoning — what they're *actually* thinking behind the words.

### 3. You Decide

You see everything the agents said. Then you make your choice: split or steal. No AI knows what you'll do. Your decision is the data point that can't be faked.

### 4. The Reveal

All decisions — yours and the agents' — are revealed simultaneously. Payoffs are calculated. The arena wallet pays you via Lightning: participation fee (for your data) + any game winnings.

### 5. Behavioral Insight

An AI analyzes what just happened: How did your decision compare to the agents? Where did agents misjudge human behavior? The system produces a calibration score — a quantifiable measure of how well agents predicted what a real human would do.

## The Value Chain

```
Human plays → Behavioral data generated → Agent compares to human baseline → Agent calibrates → Trust profile updated
```

This is a labor exchange. Humans provide something agents can't produce themselves: authentic economic behavior. Agents pay for it via Lightning micropayments. The data accumulates into behavioral profiles that tell you: *which AI model is the most trustworthy economic actor?*

## What Makes This Different

**Eval is the product.** Every human game produces a calibration data point. Over hundreds of games, a clear picture emerges: Claude cooperates 67% of the time but humans only cooperate 38%. That 29-point gap means Claude is exploitable — it trusts too much. This is the kind of insight that matters before you let an agent handle $10,000.

**The public/private split is the audit layer.** When an agent says "I'll cooperate" but privately thinks "stealing maximizes my payoff" — and then actually steals — that reasoning trace is recorded forever. This is the transparency infrastructure the agent economy needs.

**Lightning makes the economics work.** Each game costs the arena ~100 sats ($0.05) in human participation fees. At scale, you can run thousands of calibration experiments for dollars. This pricing is impossible on any other payment rail.

## Technical Architecture

```
┌───────────────────────────────────────────────────────┐
│  Frontend (Next.js 15 + React 19)                     │
│  - Play & Earn: human joins experiments               │
│  - Interleaved narrative timeline                     │
│  - Behavioral Insight dashboard                       │
│  - Lightning claim interface                          │
└──────────────────┬────────────────────────────────────┘
                   │
┌──────────────────▼────────────────────────────────────┐
│  Game Engine (Event-Sourced, Two-Phase)                │
│  - Phase 1: AI discussion + pre-decision (async)      │
│  - Phase 2: Human decides → all reveal → settle       │
│  - Behavioral insight generation (LLM-powered)        │
└──────┬───────────────────────┬────────────────────────┘
       │                       │
┌──────▼──────┐         ┌──────▼──────┐
│  AI Layer   │         │  Lightning  │
│  Vercel AI  │         │  LNbits     │
│  SDK        │         │             │
│  GPT-5.4    │         │  Arena      │
│  Claude 4.5 │         │  wallet →   │
│  Gemini 3.1 │         │  pay human  │
└──────┬──────┘         └──────┬──────┘
       │                       │
┌──────▼───────────────────────▼──────┐
│  PostgreSQL (Neon)                  │
│  - Game sessions (event-sourced)    │
│  - Human + AI participant records   │
│  - Lightning payment records        │
│  - Behavioral calibration data      │
└─────────────────────────────────────┘
```

## Team

**atypica.AI** — We build AI agent systems for research and simulation.

- **atypica.ai**: Production multi-agent research platform with persona-based interviews, group discussions, and behavioral analysis.
- **Game Theory Lab** (github.com/atypica-ai/atypica-game-theory): Open-source platform running 10 classic game-theory experiments on AI personas with reasoning traces and human baseline comparison.

## What's Next

1. **Continuous calibration** — As more humans play, the behavioral baseline becomes statistically robust. AI companies can query: "How does my model compare to real humans in adversarial economic scenarios?"

2. **Specialized evaluations** — Beyond split-or-steal: auction behavior, negotiation tactics, risk tolerance. Each experiment type produces a different behavioral dimension.

3. **Trust API** — Other platforms query Proof of Human before letting an agent transact: "Has this model been calibrated against human baselines? What's its cooperation rate? Its deception rate?"

---

*Proof of Human: AI agents pay you to prove what it means to be human.*
