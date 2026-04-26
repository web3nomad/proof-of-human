"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createGameAction } from "./actions";
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
    <div className="flex items-center gap-1.5">
      <select
        value={gameType}
        onChange={(e) => setGameType(e.target.value as GameType)}
        className="text-xs border border-border rounded px-2 py-1 bg-white text-muted"
      >
        <option value="golden_ball">Golden Ball</option>
        <option value="prisoners_dilemma">Prisoner&apos;s Dilemma</option>
      </select>
      <button
        onClick={handleCreate}
        disabled={loading}
        className="text-xs text-muted border border-border px-2.5 py-1 rounded hover:bg-zinc-50 disabled:opacity-50 transition-colors"
      >
        {loading ? "..." : "AI vs AI"}
      </button>
    </div>
  );
}
