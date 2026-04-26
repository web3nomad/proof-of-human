export function InsightCard({
  insight,
  calibrationScore,
  patterns,
  humanAction,
  humanAlias,
}: {
  insight: string;
  calibrationScore: number;
  patterns: string[];
  humanAction: string;
  humanAlias: string;
}) {
  return (
    <section>
      <h2 className="text-xs text-muted uppercase tracking-wider mb-3">
        Behavioral Insight
      </h2>
      <div className="border border-amber-300/50 rounded-lg bg-amber-50/30 p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-amber-600/80 uppercase tracking-wider font-mono mb-1">
              Agent Calibration
            </p>
            <p className="text-sm leading-relaxed">{insight}</p>
          </div>
          <div className="text-center ml-4 flex-shrink-0">
            <div className="text-2xl font-mono font-semibold">
              {calibrationScore}
            </div>
            <div className="text-xs text-muted">/ 100</div>
            <div className="text-xs text-amber-600/80 mt-0.5">
              calibration
            </div>
          </div>
        </div>

        <div className="text-xs text-muted">
          {humanAlias} chose <span className="font-semibold">{humanAction}</span>
        </div>

        {patterns.length > 0 && (
          <div className="border-t border-amber-200/50 pt-3">
            <p className="text-xs text-amber-600/80 uppercase tracking-wider font-mono mb-2">
              Patterns Observed
            </p>
            <ul className="space-y-1">
              {patterns.map((p, i) => (
                <li key={i} className="text-xs text-muted flex items-start gap-1.5">
                  <span className="text-amber-500 mt-0.5">&#x2022;</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
