"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createHumanGameAction } from "./actions";
import { GameType } from "@/game/types";

export function JoinGameButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleJoin(gameType: GameType) {
    setLoading(true);
    try {
      const sessionId = await createHumanGameAction(gameType);
      router.push(`/game/${sessionId}`);
    } catch (e) {
      console.error("Failed to create human game:", e);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="text-sm text-muted flex items-center gap-2">
        <span className="lightning-pulse text-accent">&#x26A1;</span>
        Setting up experiment...
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleJoin("golden_ball")}
        className="text-sm font-semibold border border-accent bg-accent/10 px-4 py-2 rounded hover:bg-accent/20 transition-colors"
      >
        Golden Ball
      </button>
      <button
        onClick={() => handleJoin("prisoners_dilemma")}
        className="text-sm font-semibold border border-border px-4 py-2 rounded hover:bg-zinc-50 transition-colors"
      >
        Prisoner&apos;s Dilemma
      </button>
    </div>
  );
}
