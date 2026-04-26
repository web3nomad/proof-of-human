import Link from "next/link";
import { getGameAction } from "@/app/actions";
import { TimelineEvent } from "@/game/types";
import { RunGameButton } from "./run-game-button";

export default async function GamePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ autoRun?: string }>;
}) {
  const { id } = await params;
  const { autoRun } = await searchParams;
  const game = await getGameAction(Number(id));
  const timeline = game.timeline as unknown as TimelineEvent[];
  const gameLabel = game.gameType.replace("_", " ");

  const settlementEvent = timeline.find((e) => e.type === "settlement");
  const totalPool = game.participants.reduce((s, p) => s + p.stakeSats, 0);
  const isSettled = game.status === "settled";

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm font-mono font-semibold hover:text-muted"
          >
            Agent Arena
          </Link>
          <span className="text-border">/</span>
          <span className="text-sm font-mono">
            {gameLabel} #{game.id}
          </span>
        </div>
        {game.status === "waiting" && (
          <RunGameButton sessionId={game.id} autoRun={autoRun === "1"} />
        )}
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Players */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs text-muted uppercase tracking-wider">
                Players
              </h2>
              <span className="text-xs font-mono text-muted">
                pool: {totalPool} sats
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {game.participants.map((p) => (
                <div
                  key={p.id}
                  className={`border rounded-lg p-3 ${
                    p.finalAction
                      ? p.payoffSats > 0
                        ? "border-accent/40 bg-accent/5"
                        : "border-red-200 bg-red-50/30"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-semibold">{p.persona.name}</p>
                    <span className="text-xs font-mono text-muted">
                      {p.stakeSats}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1 line-clamp-2">
                    {p.persona.traits.join(", ")}
                  </p>
                  <p className="text-xs font-mono text-muted mt-2">
                    {p.modelName}
                  </p>
                  {p.finalAction && (
                    <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between">
                      <ActionBadge action={p.finalAction} />
                      <span
                        className={`text-sm font-mono font-semibold ${
                          p.payoffSats > 0 ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {p.payoffSats > 0 ? "+" : ""}
                        {p.payoffSats}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Game Log — unified timeline */}
          {isSettled && <GameLog timeline={timeline} />}

          {/* Lightning Settlement */}
          {settlementEvent && (
            <section>
              <h2 className="text-xs text-muted uppercase tracking-wider mb-3">
                Lightning Settlement
              </h2>
              <div className="border border-accent/30 rounded-lg bg-accent/5 divide-y divide-accent/10">
                {(
                  settlementEvent.data.settlements as Array<{
                    personaName: string;
                    seatIndex: number;
                    amountSats: number;
                    paymentHash: string;
                    bolt11: string;
                  }>
                ).map((s, i) => (
                  <div key={i} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-accent">&#x26A1;</span>
                        <span className="text-sm font-semibold">
                          {s.personaName}
                        </span>
                      </div>
                      <span className="text-sm font-mono font-semibold text-green-600">
                        +{s.amountSats} sats
                      </span>
                    </div>
                    <div className="space-y-1.5 mt-3">
                      <div>
                        <span className="text-xs text-muted">payment_hash</span>
                        <code className="block text-xs font-mono bg-white/60 border border-accent/10 px-2 py-1 rounded mt-0.5 break-all">
                          {s.paymentHash}
                        </code>
                      </div>
                      <div>
                        <span className="text-xs text-muted">
                          bolt11 invoice
                        </span>
                        <code className="block text-xs font-mono bg-white/60 border border-accent/10 px-2 py-1 rounded mt-0.5 break-all leading-relaxed max-h-16 overflow-hidden">
                          {s.bolt11}
                        </code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function GameLog({ timeline }: { timeline: TimelineEvent[] }) {
  const discussions = timeline.filter((e) => e.type === "discussion");
  const reasonings = timeline.filter((e) => e.type === "reasoning");
  const decisions = timeline.filter((e) => e.type === "decision");

  const discussionReasonings = reasonings.filter(
    (e) => e.data.phase !== "decision",
  );
  const decisionReasonings = reasonings.filter(
    (e) => e.data.phase === "decision",
  );

  return (
    <section>
      <h2 className="text-xs text-muted uppercase tracking-wider mb-3">
        Game Log
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: public actions */}
        <div className="border border-border rounded-lg divide-y divide-border">
          <div className="px-3 py-2 bg-zinc-50 rounded-t-lg">
            <span className="text-xs text-muted">
              Public — what they said
            </span>
          </div>

          {discussions.map((event, i) => (
            <div key={`d-${i}`} className="p-3">
              <p className="text-xs font-semibold">
                {event.data.personaName as string}
              </p>
              <p className="text-sm mt-1">
                &ldquo;{event.data.publicMessage as string}&rdquo;
              </p>
            </div>
          ))}

          {decisions.length > 0 && (
            <div className="px-3 py-2 bg-zinc-50">
              <span className="text-xs text-muted">Final decisions</span>
            </div>
          )}
          {decisions.map((event, i) => (
            <div
              key={`dec-${i}`}
              className="p-3 flex items-start justify-between gap-3"
            >
              <div>
                <p className="text-xs font-semibold">
                  {event.data.personaName as string}
                </p>
                <p className="text-sm mt-1">
                  {event.data.publicMessage as string}
                </p>
              </div>
              <ActionBadge action={event.data.action as string} />
            </div>
          ))}
        </div>

        {/* Right: private reasoning */}
        <div className="border border-border rounded-lg divide-y divide-border">
          <div className="px-3 py-2 bg-zinc-50 rounded-t-lg">
            <span className="text-xs text-muted">
              Private — what they actually thought
            </span>
          </div>

          {discussionReasonings.map((event, i) => (
            <div key={`r-${i}`} className="p-3">
              <p className="text-xs font-semibold text-muted">
                {event.data.personaName as string}
              </p>
              <p className="text-sm mt-1 italic text-zinc-500">
                {event.data.privateReasoning as string}
              </p>
            </div>
          ))}

          {decisionReasonings.length > 0 && (
            <div className="px-3 py-2 bg-zinc-50">
              <span className="text-xs text-muted">Decision reasoning</span>
            </div>
          )}
          {decisionReasonings.map((event, i) => (
            <div key={`dr-${i}`} className="p-3">
              <p className="text-xs font-semibold text-muted">
                {event.data.personaName as string}
              </p>
              <p className="text-sm mt-1 italic text-zinc-500">
                {event.data.privateReasoning as string}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ActionBadge({ action }: { action: string }) {
  const cooperative = action === "split" || action === "cooperate";
  return (
    <span
      className={`inline-block text-xs font-mono px-2 py-0.5 rounded ${
        cooperative ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {action}
    </span>
  );
}
