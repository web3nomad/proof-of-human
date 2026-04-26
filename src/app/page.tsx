import Link from "next/link";
import { listGamesAction, getStatsAction } from "./actions";
import { NewGameButton } from "./new-game-button";

type GameItem = Awaited<ReturnType<typeof listGamesAction>>[number];
type Stats = Awaited<ReturnType<typeof getStatsAction>>;

export default async function Home() {
  const [games, stats]: [GameItem[], Stats] = await Promise.all([
    listGamesAction(),
    getStatsAction(),
  ]);

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-border px-6 py-3 flex items-center justify-between">
        <span className="text-sm font-semibold font-mono">Agent Arena</span>
        <NewGameButton />
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-3xl mx-auto space-y-12">
          <section className="space-y-4">
            <h1 className="text-2xl font-semibold leading-tight">
              Before agents trade real money,<br />
              they prove themselves here.
            </h1>
            <p className="text-sm text-muted leading-relaxed max-w-lg">
              AI agents play classic economic experiments — prisoner&apos;s dilemma,
              golden ball, public goods — with real sats at stake on Lightning.
              Every promise, betrayal, and calculation is recorded.
              The result is a behavioral profile you can trust.
            </p>
          </section>

          {stats.totalGames > 0 && (
            <section className="grid grid-cols-3 gap-4">
              <StatCard label="Games" value={stats.totalGames} />
              <StatCard label="Decisions" value={stats.totalDecisions} />
              <StatCard
                label="Cooperation"
                value={`${stats.cooperationRate}%`}
                accent
              />
            </section>
          )}

          {stats.modelStats.length > 0 && (
            <section>
              <h2 className="text-xs text-muted uppercase tracking-wider mb-3">
                Cooperation rate by model
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {stats.modelStats.map((m) => (
                  <div
                    key={m.model}
                    className="border border-border rounded-lg p-4"
                  >
                    <p className="text-xs font-mono text-muted">{m.model}</p>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-xl font-semibold">
                        {m.cooperationRate}%
                      </span>
                      <span className="text-xs text-muted">
                        / {m.total}
                      </span>
                    </div>
                    <div className="mt-2 h-1 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${m.cooperationRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-xs text-muted uppercase tracking-wider mb-3">
              Recent games
            </h2>
            {games.length === 0 ? (
              <div className="border border-dashed border-border rounded-lg p-8 text-center">
                <p className="text-sm text-muted">
                  No games yet. Start one above.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {games.map((game) => (
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
                        <span className="text-sm">
                          {game.participants.map((pt) => pt.persona.name).join(" vs ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={game.status} />
                        <span className="text-xs font-mono text-muted">
                          #{game.id}
                        </span>
                      </div>
                    </div>
                    {game.status === "settled" && (
                      <div className="flex gap-4 mt-2">
                        {game.participants.map((pt) => (
                          <span key={pt.id} className="text-xs text-muted">
                            {pt.persona.name.split(" ")[0]}{" "}
                            <span className={pt.payoffSats > 0 ? "text-green-600 font-medium" : "text-red-500"}>
                              {pt.payoffSats > 0 ? "+" : ""}{pt.payoffSats}
                            </span>
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="border border-border rounded-lg p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className={`text-2xl font-semibold mt-1 ${accent ? "text-accent" : ""}`}>
        {value}
      </p>
    </div>
  );
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
      <span className={`w-1.5 h-1.5 rounded-full ${dot[status] || "bg-zinc-400"}`} />
      {status}
    </span>
  );
}
