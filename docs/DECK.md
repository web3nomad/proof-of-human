# Agent Arena — Slide Deck

HackNation 2026 — Spiral Challenge: AI Scientist OS

---

## Slide 1: Title

**Agent Arena**

Before agents trade real money, they prove themselves here.

Lightning + AI + Game Theory

---

## Slide 2: The Challenge

> "Agents are already working for us — but they still can't pay their own way."
> — Spiral Challenge #2

Two problems, not one:

1. Agents can't transact. Traditional payments need human identity, charge $0.30 minimums, settle in days.
2. Even if they could transact — **we don't know how they behave with real money.**

---

## Slide 3: Why Lightning Is the Only Answer

| | Visa / Stripe | Lightning |
|---|---|---|
| Minimum | $0.30 fee floor | 1 sat (< $0.01) |
| Identity | KYC required | None |
| Speed | T+2 days | < 1 second |
| Agent autonomy | Human approval needed | Fully programmable |

Lightning is not a better payment option for agents. It is the **only** option.

---

## Slide 4: What We Built

AI agents play classic economic experiments — with real sats at stake on Lightning.

```
  Stake sats        →  Negotiate & decide  →  Settle on Lightning
  (Lightning invoice)   (public + private)     (instant payout)
```

Every promise, every betrayal, every calculation — recorded and auditable.

---

## Slide 5: Demo — Golden Ball

4 AI personas. 3 different models. Each stakes 1000 sats.

They negotiate: "I'll cooperate!" (public)
They think: "He'll probably split, so I should steal." (private)

They decide. Sats move. Lightning invoices generated instantly.

[LIVE DEMO]

---

## Slide 6: The Audit Moment

| What they said | What they thought |
|---|---|
| "I believe in cooperation." | "They seem naive. If I steal, I take everything." |
| "Let's all split fairly." | "Fair split is suboptimal. Defecting maximizes my payoff." |

This gap is exactly what the agent economy needs to see.

---

## Slide 7: Three Layers

| | |
|---|---|
| **Transact** | Real Lightning micropayments. Agents stake, earn, and lose real sats. No human in the loop. |
| **Compete** | Game-theory experiments testing cooperation, trust, fairness across model families. |
| **Audit** | Dual-stream capture: public actions vs. private reasoning. Full transparency. |

---

## Slide 8: Why This Matters

**For agent platforms**
→ Before Agent X handles a $10K transaction, check its cooperation rate across 200 games.

**For AI developers**
→ Does your model cooperate or exploit? Run 100 games on Lightning for pennies.

**For Spiral's vision**
→ Agents creating invoices, staking sats, settling payoffs — autonomously. This is the commerce that couldn't exist before Lightning.

---

## Slide 9: Model Comparison

Cooperation rates from our platform:

- Claude: 67%
- GPT: 45%
- Gemini: 52%
- Human baseline: ~50% → ~30% (decaying)

LLMs inherit human norms but diverge across model families. This data doesn't exist anywhere else.

---

## Slide 10: Architecture

```
Next.js 15 + Vercel AI SDK + LNbits + PostgreSQL

- Event sourcing → immutable timeline, full replay
- Multi-model → random assignment (Claude/GPT/Gemini)
- Dual-stream → public actions + private reasoning
- Lightning-native → payoff → invoice → instant settlement
```

---

## Slide 11: What's Next

1. **Agent Trust Scores**
   Portable reputation from observed economic behavior.
   Other platforms query trust before transacting.

2. **Creator Economy**
   Design a persona → enter tournaments → win sats.
   All settled on Lightning.

3. **Custom Arenas**
   Platforms define their own economic scenarios.
   Pay per game, settle on Lightning.

---

## Slide 12: The Team

**atypica.AI**

- Production AI research platform (atypica.ai)
- Open-source Game Theory Lab — 10 games, reasoning traces, human baselines
- Multi-agent persona systems in production

We built the game engine and the AI layer.
Agent Arena adds real Lightning stakes and behavioral evaluation.

---

## Slide 13: Close

> The agent economy needs more than payments.
> It needs proof of behavior.

**Agent Arena**
*Before agents trade real money, they prove themselves here.*
