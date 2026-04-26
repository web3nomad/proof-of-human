import Link from "next/link";
import { getGameAction } from "@/app/actions";
import { TimelineEvent } from "@/game/types";
import { RunGameButton } from "./run-game-button";

export default async function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = await getGameAction(Number(id));
  const timeline = game.timeline as unknown as TimelineEvent[];

  const publicEvents = timeline.filter(
    (e) => e.type === "discussion" || e.type === "decision" || e.type === "game_started",
  );
  const privateEvents = timeline.filter((e) => e.type === "reasoning");
  const payoffEvent = timeline.find((e) => e.type === "payoff");

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-muted hover:text-foreground">
            &larr; Arena
          </Link>
          <span className="text-border">/</span>
          <span className="text-sm font-mono bg-zinc-100 px-2 py-0.5 rounded">
            {game.gameType.replace("_", " ")}
          </span>
          <span className="text-sm text-muted">#{game.id}</span>
        </div>
        {game.status === "waiting" && <RunGameButton sessionId={game.id} />}
      </header>

      <div className="flex-1 flex flex-col px-6 py-6">
        <div className="max-w-5xl mx-auto w-full space-y-6">
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {game.participants.map((p) => (
              <div key={p.id} className="border border-border rounded-lg p-3">
                <p className="text-sm font-semibold">{p.persona.name}</p>
                <p className="text-xs text-muted mt-1 line-clamp-2">
                  {p.persona.background}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-mono text-muted">
                    {p.modelName}
                  </span>
                  <span className="text-xs font-mono">
                    {p.stakeSats} sats
                  </span>
                </div>
                {p.finalAction && (
                  <div className="mt-2 flex items-center justify-between">
                    <ActionBadge action={p.finalAction} />
                    <span className={`text-sm font-semibold ${p.payoffSats > 0 ? "text-green-600" : "text-red-500"}`}>
                      {p.payoffSats > 0 ? "+" : ""}{p.payoffSats} sats
                    </span>
                  </div>
                )}
              </div>
            ))}
          </section>

          {timeline.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section>
                <h2 className="text-sm font-semibold mb-3">Public Discussion</h2>
                <div className="border border-border rounded-lg divide-y divide-border">
                  {publicEvents.map((event, i) => (
                    <PublicEventRow key={i} event={event} />
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-sm font-semibold mb-3">Private Reasoning</h2>
                <div className="border border-border rounded-lg divide-y divide-border">
                  {privateEvents.map((event, i) => (
                    <div key={i} className="p-3">
                      <p className="text-xs font-semibold text-muted">
                        {event.data.personaName as string}
                        {event.data.phase === "decision" && (
                          <span className="ml-1 text-blue-600">(decision)</span>
                        )}
                      </p>
                      <p className="text-sm mt-1 italic text-zinc-600">
                        {event.data.privateReasoning as string}
                      </p>
                    </div>
                  ))}
                  {privateEvents.length === 0 && (
                    <div className="p-3 text-sm text-muted">
                      Reasoning traces will appear here after the game runs.
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}

          {payoffEvent && (
            <section>
              <h2 className="text-sm font-semibold mb-3">Settlement</h2>
              <div className="border border-border rounded-lg p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {(payoffEvent.data.payoffs as Array<{
                    personaName: string;
                    action: string;
                    payoffSats: number;
                  }>).map((p, i) => (
                    <div key={i} className="text-center">
                      <p className="text-sm font-semibold">{p.personaName}</p>
                      <ActionBadge action={p.action} />
                      <p className={`text-lg font-semibold mt-1 ${p.payoffSats > 0 ? "text-green-600" : "text-red-500"}`}>
                        {p.payoffSats > 0 ? "+" : ""}{p.payoffSats} sats
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function PublicEventRow({ event }: { event: TimelineEvent }) {
  if (event.type === "game_started") {
    return (
      <div className="p-3 bg-zinc-50">
        <p className="text-xs text-muted">
          Game started &middot; {event.data.playerCount as number} players &middot;{" "}
          {event.data.totalPool as number} sats pool
        </p>
      </div>
    );
  }

  if (event.type === "decision") {
    return (
      <div className="p-3 bg-blue-50/50">
        <p className="text-xs font-semibold">
          {event.data.personaName as string}
          <ActionBadge action={event.data.action as string} />
        </p>
        <p className="text-sm mt-1">{event.data.publicMessage as string}</p>
      </div>
    );
  }

  return (
    <div className="p-3">
      <p className="text-xs font-semibold">{event.data.personaName as string}</p>
      <p className="text-sm mt-1">&ldquo;{event.data.publicMessage as string}&rdquo;</p>
    </div>
  );
}

function ActionBadge({ action }: { action: string }) {
  const cooperative = action === "split" || action === "cooperate";
  return (
    <span
      className={`inline-block text-xs px-2 py-0.5 rounded ml-2 ${cooperative ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
    >
      {action}
    </span>
  );
}
