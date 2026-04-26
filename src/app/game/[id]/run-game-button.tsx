"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { runGameAction } from "@/app/actions";

const PHASES = [
  "Staking sats on Lightning...",
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
    return <GameLoadingOverlay phase={PHASES[phaseIndex]} />;
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

function GameLoadingOverlay({ phase }: { phase: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="text-center space-y-6">
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 bg-accent rounded-full animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
        <p className="text-lg font-semibold">{phase}</p>
        <p className="text-xs text-muted">
          AI agents are playing a real economic experiment
        </p>
      </div>
    </div>
  );
}
