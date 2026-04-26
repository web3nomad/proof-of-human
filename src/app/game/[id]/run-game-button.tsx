"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { runGameAction } from "@/app/actions";

export function RunGameButton({
  sessionId,
  autoRun = false,
}: {
  sessionId: number;
  autoRun?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState("");

  async function handleRun() {
    setLoading(true);
    setPhase("Starting game...");
    try {
      setPhase("AI agents are discussing...");
      await runGameAction(sessionId);
      setPhase("Game complete!");
      router.refresh();
    } catch (e) {
      console.error(e);
      setPhase("Error occurred");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (autoRun && !loading) {
      handleRun();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <span className="inline-block w-3 h-3 border-2 border-muted border-t-foreground rounded-full animate-spin" />
        {phase}
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
