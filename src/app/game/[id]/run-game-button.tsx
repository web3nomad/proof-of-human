"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { runGameAction } from "@/app/actions";

const PHASES = [
  "Staking sats...",
  "Agents are negotiating...",
  "Reading bluffs and promises...",
  "Final decisions locked in...",
  "Settling on Lightning...",
];

export function RunGameButton({
  sessionId,
  autoRun = false,
}: {
  sessionId: number;
  autoRun?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);

  const handleRun = useCallback(async () => {
    setLoading(true);
    setPhaseIndex(0);
    const interval = setInterval(() => {
      setPhaseIndex((i) => Math.min(i + 1, PHASES.length - 1));
    }, 4000);
    try {
      await runGameAction(sessionId);
      clearInterval(interval);
      router.refresh();
    } catch (e) {
      console.error(e);
      clearInterval(interval);
      setLoading(false);
    }
  }, [sessionId, router]);

  useEffect(() => {
    if (autoRun) {
      handleRun();
    }
  }, [autoRun, handleRun]);

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
        <span className="text-sm text-muted">{PHASES[phaseIndex]}</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleRun}
      className="text-sm bg-foreground text-background px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
    >
      Run Game
    </button>
  );
}
