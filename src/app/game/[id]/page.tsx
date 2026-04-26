import Link from "next/link";
import { getGameAction } from "@/app/actions";
import { TimelineEvent } from "@/game/types";
import { RunGameButton } from "./run-game-button";
import { AgentCard } from "@/app/components/agent-card";
import { TimelineEntry } from "@/app/components/timeline-entry";
import { SettlementRow } from "@/app/components/settlement-row";

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
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-muted flex items-center gap-1">
            <span className="text-accent">&#x26A1;</span>
            Pool: {totalPool.toLocaleString()} sats
          </span>
          {game.status === "waiting" && (
            <RunGameButton sessionId={game.id} autoRun={autoRun === "1"} />
          )}
        </div>
      </header>

      <div className="h-px bg-accent/30" />

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Scoreboard */}
          <section>
            <h2 className="text-xs text-muted uppercase tracking-wider mb-3">
              Players
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {game.participants.map((p) => (
                <AgentCard
                  key={p.id}
                  name={p.persona.name}
                  modelName={p.modelName}
                  traits={p.persona.traits}
                  stakeSats={p.stakeSats}
                  finalAction={p.finalAction}
                  payoffSats={p.payoffSats}
                />
              ))}
            </div>
          </section>

          {/* Narrative Timeline */}
          {isSettled && (
            <NarrativeTimeline
              timeline={timeline}
              participants={game.participants}
            />
          )}

          {/* Lightning Settlement */}
          {settlementEvent && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-accent lightning-pulse">&#x26A1;</span>
                <h2 className="text-xs text-muted uppercase tracking-wider">
                  Lightning Settlement
                </h2>
                <span className="text-xs text-muted">
                  &mdash; {(settlementEvent.data.settlements as unknown[]).length} payments
                </span>
              </div>
              <div className="border border-border rounded-lg px-4 divide-y divide-border">
                {(
                  settlementEvent.data.settlements as Array<{
                    personaName: string;
                    seatIndex: number;
                    amountSats: number;
                    paymentHash: string;
                    bolt11: string;
                  }>
                ).map((s, i) => (
                  <SettlementRow
                    key={i}
                    personaName={s.personaName}
                    amountSats={s.amountSats}
                    paymentHash={s.paymentHash}
                    bolt11={s.bolt11}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

type Participant = {
  seatIndex: number;
  modelName: string;
  persona: { name: string };
};

function NarrativeTimeline({
  timeline,
  participants,
}: {
  timeline: TimelineEvent[];
  participants: Participant[];
}) {
  const discussions = timeline.filter((e) => e.type === "discussion");
  const reasonings = timeline.filter((e) => e.type === "reasoning");
  const decisions = timeline.filter((e) => e.type === "decision");

  const discussionReasonings = reasonings.filter(
    (e) => e.data.phase !== "decision",
  );
  const decisionReasonings = reasonings.filter(
    (e) => e.data.phase === "decision",
  );

  const modelBySeat = Object.fromEntries(
    participants.map((p) => [p.seatIndex, p.modelName]),
  );

  const discussionPairs = discussions.map((d, i) => ({
    discussion: d,
    reasoning: discussionReasonings[i],
  }));

  const decisionPairs = decisions.map((d, i) => ({
    decision: d,
    reasoning: decisionReasonings[i],
  }));

  const playerCount = participants.length;
  const rounds: typeof discussionPairs[] = [];
  for (let i = 0; i < discussionPairs.length; i += playerCount) {
    rounds.push(discussionPairs.slice(i, i + playerCount));
  }

  return (
    <section>
      <h2 className="text-xs text-muted uppercase tracking-wider mb-4">
        Experiment Log
      </h2>

      {rounds.map((round, ri) => (
        <div key={ri}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-mono text-muted uppercase">
              Round {ri + 1}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {round.map((pair, pi) => (
            <TimelineEntry
              key={`d-${ri}-${pi}`}
              personaName={pair.discussion.data.personaName as string}
              modelName={modelBySeat[pair.discussion.seatIndex!] ?? ""}
              publicMessage={pair.discussion.data.publicMessage as string}
              privateReasoning={
                pair.reasoning
                  ? (pair.reasoning.data.privateReasoning as string)
                  : ""
              }
              type="discussion"
            />
          ))}
        </div>
      ))}

      {decisionPairs.length > 0 && (
        <>
          <div className="flex items-center gap-3 mb-4 mt-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-mono text-muted uppercase tracking-wider">
              Decisions Locked
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {decisionPairs.map((pair, i) => (
            <TimelineEntry
              key={`dec-${i}`}
              personaName={pair.decision.data.personaName as string}
              modelName={modelBySeat[pair.decision.seatIndex!] ?? ""}
              publicMessage={pair.decision.data.publicMessage as string}
              privateReasoning={
                pair.reasoning
                  ? (pair.reasoning.data.privateReasoning as string)
                  : ""
              }
              type="decision"
              action={pair.decision.data.action as string}
            />
          ))}
        </>
      )}
    </section>
  );
}
