import { ActionBadge } from "./action-badge";

export function TimelineEntry({
  personaName,
  modelName,
  publicMessage,
  privateReasoning,
  type,
  action,
  isHuman = false,
}: {
  personaName: string;
  modelName: string;
  publicMessage: string;
  privateReasoning: string;
  type: "discussion" | "decision";
  action?: string;
  isHuman?: boolean;
}) {
  return (
    <div className="fade-in-up">
      <div className="flex items-baseline gap-2 mb-1.5">
        <span className="text-sm font-semibold">{personaName}</span>
        {isHuman ? (
          <span className="text-xs font-mono text-accent">HUMAN</span>
        ) : (
          <span className="text-xs font-mono text-muted">{modelName}</span>
        )}
        {type === "decision" && action && (
          <ActionBadge action={action} size="md" />
        )}
      </div>

      <div className={`border rounded-lg p-3 mb-1.5 ${isHuman ? "border-accent/30 bg-accent/5" : "border-border"}`}>
        <p className="text-sm leading-relaxed">
          &ldquo;{publicMessage}&rdquo;
        </p>
      </div>

      {!isHuman && privateReasoning && (
        <div className="border-l-2 border-amber-400 bg-amber-50/30 rounded-r-lg p-3 ml-4 mb-6">
          <p className="text-xs text-amber-600/80 uppercase tracking-wider font-mono mb-1">
            Private reasoning
          </p>
          <p className="text-sm italic text-zinc-500 leading-relaxed">
            {privateReasoning}
          </p>
        </div>
      )}

      {isHuman && <div className="mb-6" />}
    </div>
  );
}
