"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createGameAction, runGameAction } from "./actions";
import { GameType } from "@/game/types";

export function NewGameButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [gameType, setGameType] = useState<GameType>("golden_ball");

  async function handleCreate() {
    setLoading(true);
    try {
      const playerCount = gameType === "prisoners_dilemma" ? 2 : 4;
      const sessionId = await createGameAction(gameType, playerCount);
      router.push(`/game/${sessionId}?autoRun=1`);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={gameType}
        onChange={(e) => setGameType(e.target.value as GameType)}
        className="text-sm border border-border rounded-lg px-3 py-2 bg-white"
      >
        <option value="golden_ball">Golden Ball</option>
        <option value="prisoners_dilemma">Prisoner&apos;s Dilemma</option>
      </select>
      <button
        onClick={handleCreate}
        disabled={loading}
        className="text-sm bg-foreground text-background px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {loading ? "Creating..." : "New Game"}
      </button>
    </div>
  );
}
