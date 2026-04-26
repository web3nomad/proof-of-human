# Proof of Human — Slide Deck

HackNation 2026 — Spiral Challenge: Earn in the Agent Economy

---

## Slide 1: Title

**Proof of Human**

AI agents pay you to prove what it means to be human.

Lightning × Game Theory × Behavioral Eval

---

## Slide 2: The Problem

Agents are entering the economy. They'll negotiate, trade, and spend. But:

**How should they behave when real money is at stake?**

They can't learn from each other — that's an echo chamber. They need **ground truth from real humans**. And human attention costs money.

---

## Slide 3: The Insight

Eval is labor. Humans provide something agents can't fake: authentic economic decisions.

Agents should **pay** for this.

But you can't pay a stranger $0.05 for one game-theory decision on Visa. The minimum fee kills it.

**Lightning is the only rail where agents can micropay humans for behavioral data.**

---

## Slide 4: How It Works

```
  You join          →  AI agents discuss   →  You decide        →  All reveal
  (3 AI + 1 human)    (public + private)     (split or steal)     + Lightning payout
```

1. You play against 3 AI agents (GPT-5.4, Claude 4.5, Gemini 3.1 Pro)
2. Agents negotiate — you see what they say AND what they secretly think
3. You make your choice
4. Everyone's decision reveals. Arena pays you ⚡ sats via Lightning.

---

## Slide 5: Demo

[LIVE DEMO — join a Golden Ball game, see AI discussion, make a decision, get paid]

---

## Slide 6: The Behavioral Insight

After every human game, the system generates a calibration report:

| | Human | GPT-5.4 | Claude 4.5 | Gemini 3.1 |
|---|---|---|---|---|
| **Decision** | STEAL | SPLIT | SPLIT | STEAL |
| **Cooperation rate** | 38% | 72% | 67% | 45% |

**Calibration Score: 34/100** — Agents overestimate cooperation. GPT and Claude are exploitable by strategic humans.

This is the data that doesn't exist anywhere else.

---

## Slide 7: The Value Chain

| Layer | What Happens |
|---|---|
| **Human plays** | You make a real economic decision — split or steal |
| **Agent pays** | Arena wallet sends you ⚡100+ sats via Lightning |
| **Data produced** | Your decision becomes a calibration data point |
| **Agent calibrates** | AI models compare their behavior to human baselines |

Eval is the product. Lightning is the payment rail. Human behavior is the scarce resource.

---

## Slide 8: Why Lightning

| | Visa / Stripe | Lightning |
|---|---|---|
| Pay human $0.05 per eval | ❌ $0.30 minimum | ✅ 1 sat |
| Agent creates payment | ❌ needs human | ✅ one API call |
| Settlement | ❌ T+2 days | ✅ < 1 second |
| Cross-border | ❌ compliance | ✅ no borders |

Lightning isn't bolted on. Without Lightning, this product can't exist. The unit economics of "agent pays human for one decision" only work with micropayments.

---

## Slide 9: The Audit Layer

| What they said | What they actually thought |
|---|---|
| "I believe in cooperation." | "They seem naive. If I steal, I take everything." |
| "Let's split fairly." | "Fair split is suboptimal. Defecting maximizes payoff." |

Every agent's reasoning trace is captured and stored. When an agent betrays — you can see exactly why.

---

## Slide 10: Architecture

```
Next.js 15 + Vercel AI SDK + LNbits + Neon PostgreSQL

Two-phase game engine:
  Phase 1: AI discussion + pre-decision (async)
  Phase 2: Human decides → reveal → payoff → Lightning settlement

Three flagship models: GPT-5.4, Claude Sonnet 4.5, Gemini 3.1 Pro
Event-sourced timeline: every state change is immutable
Behavioral insight: LLM-generated calibration analysis per game
```

---

## Slide 11: What's Next

1. **Trust API**
   Other platforms query before letting an agent transact:
   "What's this model's cooperation rate vs. humans?"

2. **Specialized evals**
   Beyond split/steal: auctions, negotiations, risk assessment.
   Each produces a new behavioral dimension.

3. **Scale the human side**
   More humans = better baselines. Lightning micropayments
   make it economically viable at any scale.

---

## Slide 12: The Team

**atypica.AI**

- Production AI research platform (atypica.ai)
- Open-source Game Theory Lab — 10 games, reasoning traces, human baselines
- Multi-agent persona systems in production

---

## Slide 13: Close

> The agent economy needs more than payments.
> It needs proof that agents can behave like humans.
> And only humans can provide that proof.

**Proof of Human**
*AI agents pay you to prove what it means to be human.*
