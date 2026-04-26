"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createHumanGameAction, createGameAction } from "./actions";
import { GameType } from "@/game/types";

export function StartGame() {
  const [loading, setLoading] = useState(false);
  const [gameType, setGameType] = useState<GameType>("golden_ball");
  const router = useRouter();

  async function handleStart(mode: "human" | "ai") {
    setLoading(true);
    try {
      if (mode === "human") {
        const sessionId = await createHumanGameAction(gameType);
        router.push(`/game/${sessionId}`);
      } else {
        const playerCount = gameType === "prisoners_dilemma" ? 2 : 4;
        const sessionId = await createGameAction(gameType, playerCount);
        router.push(`/game/${sessionId}?autoRun=1`);
      }
    } catch (e) {
      console.error(e);
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
    <div className="flex items-center gap-3">
      <select
        value={gameType}
        onChange={(e) => setGameType(e.target.value as GameType)}
        className="text-sm border border-border rounded-lg px-3 py-2 bg-white"
      >
        <option value="golden_ball">Golden Ball</option>
        <option value="prisoners_dilemma">Prisoner&apos;s Dilemma</option>
      </select>
      <button
        onClick={() => handleStart("human")}
        className="text-sm font-semibold border border-accent bg-accent/10 px-4 py-2 rounded-lg hover:bg-accent/20 transition-colors"
      >
        Play
      </button>
      <button
        onClick={() => handleStart("ai")}
        className="text-sm text-muted border border-border px-4 py-2 rounded-lg hover:bg-zinc-50 transition-colors"
      >
        Watch AI
      </button>
    </div>
  );
}
