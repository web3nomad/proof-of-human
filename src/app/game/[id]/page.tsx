import Link from "next/link";
import { getGameAction } from "@/app/actions";
import { GameConfig, GameType, TimelineEvent } from "@/game/types";
import { RunGameButton } from "./run-game-button";
import { HumanDecisionForm } from "./human-decision-form";
import { ClaimEarnings } from "./claim-earnings";
import { AgentCard } from "@/app/components/agent-card";
import { TimelineEntry } from "@/app/components/timeline-entry";
import { SettlementRow } from "@/app/components/settlement-row";
import { InsightCard } from "@/app/components/insight-card";

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
  const config = game.config as unknown as GameConfig;

  const settlementEvent = timeline.find((e) => e.type === "settlement");
  const insightEvent = timeline.find((e) => e.type === "behavioral_insight");
  const totalPool = game.participants.reduce((s, p) => s + p.stakeSats, 0);
  const isSettled = game.status === "settled";
  const isDeciding = game.status === "deciding";
  const humanParticipant = game.participants.find((p) => p.isHuman);
  const isHumanGame = !!humanParticipant;

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm font-mono font-semibold hover:text-muted"
          >
            Proof of Human
          </Link>
          <span className="text-border">/</span>
          <span className="text-sm font-mono">
            {gameLabel} #{game.id}
          </span>
          {isHumanGame && (
            <span className="text-xs font-mono bg-accent/10 text-accent px-2 py-0.5 rounded">
              human
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-muted flex items-center gap-1">
            <span className="text-accent">&#x26A1;</span>
            Pool: {totalPool.toLocaleString()} sats
          </span>
          {game.status === "waiting" && !isHumanGame && (
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
                  name={p.isHuman ? (p.humanAlias || "You") : (p.persona?.name ?? "Unknown")}
                  modelName={p.modelName}
                  traits={p.isHuman ? [] : (p.persona?.traits ?? [])}
                  stakeSats={p.stakeSats}
                  finalAction={isDeciding && !p.isHuman ? null : p.finalAction}
                  payoffSats={isDeciding ? 0 : p.payoffSats}
                  isHuman={p.isHuman}
                />
              ))}
            </div>
          </section>

          {/* Discussion timeline (visible during deciding phase for human games) */}
          {isDeciding && isHumanGame && (
            <DiscussionTimeline
              timeline={timeline}
              participants={game.participants}
            />
          )}

          {/* Human Decision Form */}
          {isDeciding && isHumanGame && (
            <HumanDecisionForm
              sessionId={game.id}
              gameType={game.gameType as GameType}
              stakePerPlayer={config.stakePerPlayer}
              playerCount={game.participants.length}
            />
          )}

          {/* Full Narrative Timeline (after settlement) */}
          {isSettled && (
            <NarrativeTimeline
              timeline={timeline}
              participants={game.participants}
            />
          )}

          {/* Behavioral Insight (human games only) */}
          {isSettled && insightEvent && (
            <InsightCard
              insight={insightEvent.data.insight as string}
              calibrationScore={insightEvent.data.calibrationScore as number}
              patterns={insightEvent.data.patterns as string[]}
              humanAction={insightEvent.data.humanAction as string}
              humanAlias={insightEvent.data.humanAlias as string}
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

          {/* Claim Earnings (human games only) */}
          {isSettled && isHumanGame && humanParticipant && (
            <ClaimEarnings
              sessionId={game.id}
              totalEarnings={humanParticipant.payoffSats + (config.participationFee ?? 0)}
              participationFee={config.participationFee ?? 0}
              gameWinnings={humanParticipant.payoffSats}
            />
          )}
        </div>
      </div>
    </div>
  );
}

type Participant = {
  seatIndex: number;
  modelName: string;
  isHuman: boolean;
  humanAlias: string | null;
  persona: { name: string } | null;
};

function DiscussionTimeline({
  timeline,
  participants,
}: {
  timeline: TimelineEvent[];
  participants: Participant[];
}) {
  const discussions = timeline.filter((e) => e.type === "discussion");
  const reasonings = timeline.filter(
    (e) => e.type === "reasoning" && e.data.phase !== "decision",
  );

  const modelBySeat = Object.fromEntries(
    participants.map((p) => [p.seatIndex, p.modelName]),
  );

  const pairs = discussions.map((d, i) => ({
    discussion: d,
    reasoning: reasonings[i],
  }));

  const aiCount = participants.filter((p) => !p.isHuman).length;
  const rounds: typeof pairs[] = [];
  for (let i = 0; i < pairs.length; i += aiCount) {
    rounds.push(pairs.slice(i, i + aiCount));
  }

  return (
    <section>
      <h2 className="text-xs text-muted uppercase tracking-wider mb-4">
        AI Agents are discussing...
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
    </section>
  );
}

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

  const humanSeatSet = new Set(
    participants.filter((p) => p.isHuman).map((p) => p.seatIndex),
  );

  const discussionPairs = discussions.map((d, i) => ({
    discussion: d,
    reasoning: discussionReasonings[i],
  }));

  const decisionPairs = decisions.map((d) => {
    const matchingReasoning = decisionReasonings.find(
      (r) => r.seatIndex === d.seatIndex,
    );
    return { decision: d, reasoning: matchingReasoning };
  });

  const aiParticipantCount = participants.filter((p) => !p.isHuman).length;
  const rounds: typeof discussionPairs[] = [];
  for (let i = 0; i < discussionPairs.length; i += aiParticipantCount) {
    rounds.push(discussionPairs.slice(i, i + aiParticipantCount));
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

          {decisionPairs.map((pair, i) => {
            const isHumanEntry = humanSeatSet.has(pair.decision.seatIndex!);
            return (
              <TimelineEntry
                key={`dec-${i}`}
                personaName={pair.decision.data.personaName as string}
                modelName={
                  isHumanEntry
                    ? "human"
                    : (modelBySeat[pair.decision.seatIndex!] ?? "")
                }
                publicMessage={pair.decision.data.publicMessage as string}
                privateReasoning={
                  isHumanEntry
                    ? ""
                    : pair.reasoning
                      ? (pair.reasoning.data.privateReasoning as string)
                      : ""
                }
                type="decision"
                action={pair.decision.data.action as string}
                isHuman={isHumanEntry}
              />
            );
          })}
        </>
      )}
    </section>
  );
}
