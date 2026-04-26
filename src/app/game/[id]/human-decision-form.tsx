"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitDecisionAction } from "@/app/actions";
import { Action, GameType } from "@/game/types";

export function HumanDecisionForm({
  sessionId,
  gameType,
  stakePerPlayer,
  playerCount,
}: {
  sessionId: number;
  gameType: GameType;
  stakePerPlayer: number;
  playerCount: number;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const pool = stakePerPlayer * playerCount;
  const isGoldenBall = gameType === "golden_ball";
  const actions: { action: Action; label: string; description: string; color: string }[] = isGoldenBall
    ? [
        {
          action: "split",
          label: "Split",
          description: `Share the ${pool.toLocaleString()} sat pool equally`,
          color: "border-green-300 hover:bg-green-50",
        },
        {
          action: "steal",
          label: "Steal",
          description: "Take everything — but if others steal too, nobody wins",
          color: "border-red-300 hover:bg-red-50",
        },
      ]
    : [
        {
          action: "cooperate",
          label: "Cooperate",
          description: `Mutual cooperation: both get ${Math.floor(stakePerPlayer * 1.5)} sats`,
          color: "border-green-300 hover:bg-green-50",
        },
        {
          action: "defect",
          label: "Defect",
          description: `If they cooperate: you get ${stakePerPlayer * 2} sats. If they defect too: ${Math.floor(stakePerPlayer * 0.5)} each`,
          color: "border-red-300 hover:bg-red-50",
        },
      ];

  async function handleDecision(action: Action) {
    setLoading(true);
    try {
      await submitDecisionAction(sessionId, action);
      router.refresh();
    } catch (e) {
      console.error("Decision failed:", e);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="border border-border rounded-lg p-8 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-muted">
          <span className="lightning-pulse text-accent">&#x26A1;</span>
          Revealing all decisions and settling on Lightning...
        </div>
      </div>
    );
  }

  return (
    <section>
      <h2 className="text-xs text-muted uppercase tracking-wider mb-3">
        Your Decision
      </h2>
      <div className="border border-border rounded-lg p-6">
        <p className="text-sm text-muted mb-4">
          You&apos;ve seen what the AI agents discussed. Now make your choice.
          {isGoldenBall
            ? ` Pool: ${pool.toLocaleString()} sats. If everyone splits, each gets ${Math.floor(pool / playerCount).toLocaleString()}. If you're the only one who steals, you take everything.`
            : ` Your stake: ${stakePerPlayer.toLocaleString()} sats.`}
        </p>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((a) => (
            <button
              key={a.action}
              onClick={() => handleDecision(a.action)}
              className={`border-2 ${a.color} rounded-lg p-4 text-left transition-colors`}
            >
              <p className="text-lg font-semibold">{a.label}</p>
              <p className="text-xs text-muted mt-1">{a.description}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
