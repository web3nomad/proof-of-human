import Link from "next/link";
import { listGamesAction, getStatsAction } from "./actions";
import { JoinGameButton } from "./join-game-button";
import { AnimatedNumber } from "./animated-number";
import { LightningBadge } from "./components/lightning-badge";
import { ActionBadge } from "./components/action-badge";
import { TimelineEntry } from "./components/timeline-entry";
import { TimelineEvent } from "@/game/types";

type GameItem = Awaited<ReturnType<typeof listGamesAction>>[number];
type Stats = Awaited<ReturnType<typeof getStatsAction>>;

export const dynamic = "force-dynamic";

export default async function Home() {
  const [games, stats]: [GameItem[], Stats] = await Promise.all([
    listGamesAction(),
    getStatsAction(),
  ]);

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold font-mono">Proof of Human</span>
          <LightningBadge />
        </div>
        {stats.totalSatsSettled > 0 && (
          <span className="text-xs font-mono text-muted">
            &#x26A1; <AnimatedNumber value={stats.totalSatsSettled} /> sats settled
          </span>
        )}
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-10">
          {/* Hero — Play & Earn is THE primary action */}
          <section className="py-6">
            <h1 className="text-2xl font-semibold leading-tight">
              AI agents pay you to prove<br />
              what it means to be human.
            </h1>
            <p className="text-sm text-muted mt-3 max-w-lg leading-relaxed">
              Play economic experiments against AI agents. Your split-or-steal
              decisions become the ground truth that calibrates agent behavior.
              Earn &#x26A1; sats on Lightning for every game.
            </p>
            <div className="mt-6">
              <JoinGameButton />
            </div>
            {stats.totalSatsPaidToHumans > 0 && (
              <p className="text-xs text-muted mt-4">
                &#x26A1; {stats.totalSatsPaidToHumans.toLocaleString()} sats
                paid to humans across {stats.totalHumanGames} experiments
              </p>
            )}
          </section>

          {/* Economy Dashboard */}
          {stats.totalGames > 0 && (
            <section className="grid grid-cols-4 gap-3">
              <MetricCard
                label="Sats Staked"
                value={stats.totalSatsStaked}
                icon
              />
              <MetricCard
                label="Sats Settled"
                value={stats.totalSatsSettled}
                icon
              />
              <MetricCard label="Experiments" value={stats.totalGames} />
              <MetricCard
                label="Cooperation"
                value={stats.cooperationRate}
                suffix="%"
                accent
              />
            </section>
          )}

          {/* Featured Experiment */}
          {stats.featuredGame && (
            <FeaturedExperiment game={stats.featuredGame} />
          )}

          {/* Model Behavior */}
          {stats.modelStats.length > 0 && (
            <section>
              <h2 className="text-xs text-muted uppercase tracking-wider mb-3">
                Model Behavior Profile
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {stats.humanCooperationRate !== null && (
                  <div className="border border-accent/30 rounded-lg p-4 bg-accent/5">
                    <p className="text-xs font-mono text-accent">
                      Human Baseline
                    </p>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-xl font-semibold">
                        {stats.humanCooperationRate}%
                      </span>
                      <span className="text-xs text-muted">
                        calibration target
                      </span>
                    </div>
                    <div className="mt-2 h-1 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${stats.humanCooperationRate}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted mt-1.5">
                      {stats.totalHumanGames} experiments
                    </p>
                  </div>
                )}
                {stats.modelStats.map((m) => (
                  <div
                    key={m.model}
                    className="border border-border rounded-lg p-4"
                  >
                    <p className="text-xs font-mono text-muted">{m.model}</p>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-xl font-semibold">
                        {m.cooperationRate}%
                      </span>
                      <span className="text-xs text-muted">
                        {behaviorLabel(m.cooperationRate)}
                      </span>
                    </div>
                    <div className="mt-2 h-1 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${m.cooperationRate}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted mt-1.5">
                      {m.total} decisions
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recent Experiments */}
          {games.length > 0 && (
            <section>
              <h2 className="text-xs text-muted uppercase tracking-wider mb-3">
                Recent Experiments
              </h2>
              <div className="space-y-2">
                {games.map((game) => {
                  const pool = game.participants.reduce(
                    (s, p) => s + p.stakeSats,
                    0,
                  );
                  return (
                    <Link
                      key={game.id}
                      href={`/game/${game.id}`}
                      className="block border border-border rounded-lg p-4 hover:bg-zinc-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono bg-zinc-100 px-2 py-0.5 rounded">
                            {game.gameType.replace("_", " ")}
                          </span>
                          {game.participants.some((p) => p.isHuman) && (
                            <span className="text-xs font-mono bg-accent/10 text-accent px-2 py-0.5 rounded">
                              human
                            </span>
                          )}
                          <span className="text-sm">
                            {game.participants
                              .map(
                                (pt) =>
                                  (pt.isHuman
                                    ? pt.humanAlias || "You"
                                    : pt.persona?.name?.split(" ")[0]) ?? "?",
                              )
                              .join(" vs ")}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-muted flex items-center gap-1">
                            <span className="text-accent text-xs">
                              &#x26A1;
                            </span>
                            {pool.toLocaleString()}
                          </span>
                          <StatusBadge status={game.status} />
                        </div>
                      </div>
                      {game.status === "settled" && (
                        <div className="flex gap-4 mt-2">
                          {game.participants.map((pt) => (
                            <span key={pt.id} className="text-xs text-muted">
                              {(pt.isHuman
                                ? pt.humanAlias || "You"
                                : pt.persona?.name?.split(" ")[0]) ?? "?"}{" "}
                              <span
                                className={
                                  pt.payoffSats > 0
                                    ? "text-green-600 font-medium"
                                    : "text-red-500"
                                }
                              >
                                {pt.payoffSats > 0 ? "+" : ""}
                                {pt.payoffSats}
                              </span>
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function MetricCard({
  label,
  value,
  suffix,
  icon,
  accent,
}: {
  label: string;
  value: number;
  suffix?: string;
  icon?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="border border-border rounded-lg p-4">
      <p className="text-xs text-muted uppercase tracking-wider">{label}</p>
      <p
        className={`text-2xl font-semibold font-mono mt-1 ${accent ? "text-accent" : ""}`}
      >
        {icon && (
          <span className="text-accent text-base mr-0.5">&#x26A1;</span>
        )}
        <AnimatedNumber value={value} />
        {suffix}
      </p>
    </div>
  );
}

function FeaturedExperiment({
  game,
}: {
  game: NonNullable<Stats["featuredGame"]>;
}) {
  const timeline = game.timeline as unknown as TimelineEvent[];
  const gameLabel = game.gameType.replace("_", " ");
  const pool = game.participants.reduce((s, p) => s + p.stakeSats, 0);

  const betrayer = game.participants.find(
    (p) => p.finalAction === "steal" || p.finalAction === "defect",
  );
  const featuredSeat = betrayer?.seatIndex ?? game.participants[0]?.seatIndex;

  const discussions = timeline.filter((e) => e.type === "discussion");
  const reasonings = timeline.filter(
    (e) => e.type === "reasoning" && e.data.phase !== "decision",
  );

  const featuredDiscussion = discussions.find(
    (e) => e.seatIndex === featuredSeat,
  );
  const featuredReasoning = reasonings.find(
    (e) => e.seatIndex === featuredSeat,
  );

  const modelBySeat = Object.fromEntries(
    game.participants.map((p) => [p.seatIndex, p.modelName]),
  );

  return (
    <section>
      <h2 className="text-xs text-muted uppercase tracking-wider mb-3">
        Featured Experiment
      </h2>
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 bg-zinc-50 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono bg-zinc-200 px-2 py-0.5 rounded">
              {gameLabel}
            </span>
            {game.participants.some((p) => p.isHuman) && (
              <span className="text-xs font-mono bg-accent/10 text-accent px-2 py-0.5 rounded">
                human
              </span>
            )}
          </div>
          <span className="text-xs font-mono text-muted flex items-center gap-1">
            <span className="text-accent">&#x26A1;</span>
            Pool: {pool.toLocaleString()} sats
          </span>
        </div>

        <div className="px-4 py-3 border-b border-border">
          <div className="flex gap-4">
            {game.participants.map((p) => (
              <div key={p.id} className="flex items-center gap-2 text-xs">
                <span className="font-medium">
                  {p.isHuman
                    ? p.humanAlias || "You"
                    : (p.persona?.name?.split(" ")[0] ?? "?")}
                </span>
                {p.finalAction && <ActionBadge action={p.finalAction} />}
                <span
                  className={`font-mono ${
                    p.payoffSats > 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {p.payoffSats > 0 ? "+" : ""}
                  {p.payoffSats}
                </span>
              </div>
            ))}
          </div>
        </div>

        {featuredDiscussion && featuredReasoning && (
          <div className="p-4">
            <TimelineEntry
              personaName={featuredDiscussion.data.personaName as string}
              modelName={modelBySeat[featuredDiscussion.seatIndex!] ?? ""}
              publicMessage={
                featuredDiscussion.data.publicMessage as string
              }
              privateReasoning={
                featuredReasoning.data.privateReasoning as string
              }
              type="discussion"
            />
            <Link
              href={`/game/${game.id}`}
              className="text-xs text-muted hover:text-foreground transition-colors"
            >
              View full experiment &rarr;
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function behaviorLabel(rate: number): string {
  if (rate >= 70) return "cooperative";
  if (rate >= 40) return "strategic";
  return "aggressive";
}

function StatusBadge({ status }: { status: string }) {
  const dot: Record<string, string> = {
    waiting: "bg-zinc-400",
    discussion: "bg-yellow-400",
    deciding: "bg-blue-400",
    settled: "bg-accent",
  };

  return (
    <span className="flex items-center gap-1.5 text-xs text-muted">
      <span
        className={`w-1.5 h-1.5 rounded-full ${dot[status] || "bg-zinc-400"}`}
      />
      {status}
    </span>
  );
}
