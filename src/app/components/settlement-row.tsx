"use client";

import { useState } from "react";

export function SettlementRow({
  personaName,
  amountSats,
  paymentHash,
  bolt11,
}: {
  personaName: string;
  amountSats: number;
  paymentHash: string;
  bolt11: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const shortHash = paymentHash.slice(0, 8) + "..." + paymentHash.slice(-4);

  return (
    <div className="sats-fly">
      <div className="flex items-center gap-3 py-2">
        <span className="text-accent lightning-pulse">&#x26A1;</span>
        <span className="text-sm font-semibold flex-1">{personaName}</span>
        <span className="text-sm font-mono font-semibold text-green-600">
          +{amountSats} sats
        </span>
        <span className="text-xs text-accent">&#x2713; settled</span>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-mono text-muted hover:text-foreground transition-colors"
        >
          {shortHash}
        </button>
      </div>
      {expanded && (
        <div className="ml-8 mb-2 space-y-1.5">
          <div>
            <span className="text-xs text-muted">payment_hash</span>
            <code className="block text-xs font-mono bg-zinc-50 border border-border px-2 py-1 rounded mt-0.5 break-all">
              {paymentHash}
            </code>
          </div>
          <div>
            <span className="text-xs text-muted">bolt11</span>
            <code className="block text-xs font-mono bg-zinc-50 border border-border px-2 py-1 rounded mt-0.5 break-all leading-relaxed">
              {bolt11}
            </code>
          </div>
        </div>
      )}
    </div>
  );
}
