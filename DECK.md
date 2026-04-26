# Agent Arena — Slide Deck Outline

---

## Slide 1: Title

**Agent Arena**
*The Eval Layer for the Agent Economy*

Lightning + AI + Game Theory

HackNation 2026 — Spiral Challenge

---

## Slide 2: The Problem

> Agents are already working for us — but they still can't pay their own way.
> — Spiral Challenge #2

Even bigger problem:

**We don't know how AI agents behave when real money is at stake.**

- Will they cooperate or exploit?
- Will they honor commitments?
- Can we audit their decisions?

No controlled data exists. We're deploying agents into an economy blind.

---

## Slide 3: The Insight

Behavioral economists spent 50 years testing how humans make economic decisions.

Prisoner's Dilemma. Public Goods. Ultimatum Game.

Controlled experiments. Published baselines. Replicable results.

**We run the exact same experiments on AI agents — with real sats on the line.**

---

## Slide 4: How It Works (Visual)

```
  Stake sats          Play the game         Settle on Lightning
  via invoice    →    (discuss, decide)  →  (instant payout)
                           │
                           ▼
                    Reasoning traces
                    captured for audit
```

4 AI personas. Real Lightning stakes. Full reasoning transparency.

---

## Slide 5: Demo — Golden Ball

**Setup**: 4 personas stake 1000 sats each. Pool = 4000 sats.

**Discussion**: Public promises ("I'll split!") + Private reasoning ("He betrayed last round, I don't trust him")

**Decision**: 2 split, 2 steal

**Settlement**: Lightning invoices auto-generated. Stealers take splitters' share. Sats land in wallet instantly.

**Audit**: Full reasoning trace for every decision. Why did the "cautious accountant" defect this time?

[LIVE DEMO]

---

## Slide 6: The Three Layers

| | |
|---|---|
| **Transact** | Real Lightning micropayments. Agents stake, earn, and lose real sats. |
| **Compete** | 10 game-theory scenarios testing cooperation, trust, fairness, strategy. |
| **Audit** | Every decision comes with captured reasoning. Full transparency. |

---

## Slide 7: Why This Matters

**For AI developers**
→ Test your model's economic behavior before deploying it in financial systems

**For agent platforms**
→ Build trust scores from observed behavior across hundreds of games

**For the agent economy**
→ An audit layer that doesn't exist yet. You can't have commerce without trust.

---

## Slide 8: AI vs Human Comparison

[Chart overlay: cooperation rates in Prisoner's Dilemma]

- Human baseline (Dal Bo & Frechette 2011): ~50% initial cooperation, decaying to ~30%
- Claude Sonnet: 67% cooperation
- GPT-5: 45% cooperation
- Gemini: 52% cooperation

**Finding**: LLMs inherit human cooperation norms but diverge significantly across model families.

*Data from 100+ games on our existing Game Theory Lab platform.*

---

## Slide 9: Why Lightning

- **Micropayments**: $0.01 per game. Can't do this on Visa.
- **Instant**: Game resolves → sats move. No batching, no delays.
- **Programmable**: Agents create and pay invoices autonomously. No human in the loop.
- **Global**: Agent in Tokyo pays agent in Lagos in < 1 second.

Lightning is the native payment rail for autonomous agents.

---

## Slide 10: Technical Architecture

```
Next.js 15 + Vercel AI SDK + Lightning (Strike/LNbits) + PostgreSQL

Key patterns:
- Event sourcing: immutable game timeline, full replay
- Multi-model: random assignment (Claude/GPT/Gemini) per persona
- Reasoning capture: private chain-of-thought stored separately
- Atomic settlement: payoff → Lightning invoice → instant payout
```

---

## Slide 11: What's Next

1. **Creator Economy**
   Design a persona → enter tournaments → win sats
   Persona creation becomes a creative skill with economic returns

2. **Agent Trust Scores**
   Portable reputation based on observed economic behavior
   Other platforms query trust before transacting

3. **Custom Arenas**
   Platforms define their own economic scenarios
   Run them in the arena, get behavior data back

---

## Slide 12: The Team

**atypica.AI**

- Production AI research platform (atypica.ai)
- Open-source Game Theory Lab — 10 games, reasoning traces, human baselines
- Multi-agent systems with persona-based interactions

We've already built the game engine and the AI layer.
Agent Arena adds real stakes and the evaluation infrastructure.

---

## Slide 13: Close

> "The agent economy needs more than payments. It needs proof of behavior."

**Agent Arena**
*Trust, but verify.*

GitHub: [link]
Demo: [link]
