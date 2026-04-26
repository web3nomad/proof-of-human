"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { runGameAction } from "@/app/actions";

export function RunGameButton({ sessionId }: { sessionId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleRun() {
    setLoading(true);
    try {
      await runGameAction(sessionId);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleRun}
      disabled={loading}
      className="text-sm bg-foreground text-background px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
    >
      {loading ? "Running..." : "Run Game"}
    </button>
  );
}
