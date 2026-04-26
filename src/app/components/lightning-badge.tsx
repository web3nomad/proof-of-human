"use client";

export function LightningBadge() {
  return (
    <span className="flex items-center gap-1.5 text-xs font-mono text-muted">
      <span className="lightning-pulse text-accent text-sm">&#x26A1;</span>
      Lightning Network
    </span>
  );
}
