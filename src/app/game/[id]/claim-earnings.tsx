"use client";

import { useState } from "react";
import { claimEarningsAction } from "@/app/actions";

export function ClaimEarnings({
  sessionId,
  totalEarnings,
  participationFee,
  gameWinnings,
}: {
  sessionId: number;
  totalEarnings: number;
  participationFee: number;
  gameWinnings: number;
}) {
  const [bolt11, setBolt11] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [paymentHash, setPaymentHash] = useState("");

  async function handleClaim() {
    if (!bolt11.trim()) return;
    setStatus("loading");
    try {
      const result = await claimEarningsAction(sessionId, bolt11.trim());
      if (result.success) {
        setStatus("success");
        setPaymentHash(result.paymentHash ?? "");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section>
      <h2 className="text-xs text-muted uppercase tracking-wider mb-3">
        Claim Your Earnings
      </h2>
      <div className="border border-accent/30 rounded-lg bg-accent/5 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold">You earned</span>
          <span className="text-xl font-mono font-semibold text-accent">
            &#x26A1; {totalEarnings} sats
          </span>
        </div>
        <div className="text-xs text-muted mb-4 space-y-0.5">
          <p>Participation fee: {participationFee} sats</p>
          <p>Game winnings: {gameWinnings} sats</p>
        </div>

        {status === "success" ? (
          <div className="text-sm">
            <p className="text-green-600 font-medium">
              &#x2713; Payment sent!
            </p>
            {paymentHash && (
              <code className="block text-xs font-mono text-muted mt-1 break-all">
                {paymentHash}
              </code>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-muted">
              Paste a Lightning invoice for {totalEarnings} sats from your wallet:
            </p>
            <input
              type="text"
              value={bolt11}
              onChange={(e) => setBolt11(e.target.value)}
              placeholder="lnbc..."
              className="w-full text-xs font-mono border border-border rounded px-3 py-2 bg-white"
            />
            <button
              onClick={handleClaim}
              disabled={!bolt11.trim() || status === "loading"}
              className="w-full text-sm font-semibold border border-accent bg-accent/10 text-foreground rounded py-2 hover:bg-accent/20 transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "Sending..." : "Claim Sats"}
            </button>
            {status === "error" && (
              <p className="text-xs text-red-500">
                Payment failed. Check your invoice and try again.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
