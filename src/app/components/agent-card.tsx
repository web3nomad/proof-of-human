import { ActionBadge } from "./action-badge";

export function AgentCard({
  name,
  modelName,
  traits,
  stakeSats,
  finalAction,
  payoffSats,
}: {
  name: string;
  modelName: string;
  traits: string[];
  stakeSats: number;
  finalAction: string | null;
  payoffSats: number;
}) {
  const hasResult = finalAction !== null;
  const won = payoffSats > 0;

  return (
    <div
      className={`border rounded-lg p-3 ${
        hasResult
          ? won
            ? "border-accent/40 bg-accent/5 border-l-4 border-l-accent"
            : "border-red-200 bg-red-50/30 border-l-4 border-l-red-400"
          : "border-border"
      }`}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-semibold">{name}</p>
        <span className="text-xs font-mono text-muted">
          {stakeSats}&#x26A1;
        </span>
      </div>
      <p className="text-xs text-muted mt-1 line-clamp-1">
        {traits.join(", ")}
      </p>
      <p className="text-xs font-mono text-muted mt-1">{modelName}</p>
      {hasResult && (
        <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between">
          <ActionBadge action={finalAction} />
          <span
            className={`text-sm font-mono font-semibold sats-fly ${
              won ? "text-green-600" : "text-red-500"
            }`}
          >
            {won ? "+" : ""}
            {payoffSats}
          </span>
        </div>
      )}
    </div>
  );
}
