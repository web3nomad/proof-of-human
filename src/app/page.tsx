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
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold">Agent Arena</h1>
          <p className="text-sm text-muted">The eval layer for the agent economy</p>
        </div>
        <NewGameButton />
      </header>

      <main className="flex-1 px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {stats.totalGames > 0 && (
            <section className="grid grid-cols-3 gap-4">
              <StatCard label="Games Played" value={stats.totalGames} />
              <StatCard label="Total Decisions" value={stats.totalDecisions} />
              <StatCard
                label="Cooperation Rate"
                value={`${stats.cooperationRate}%`}
              />
            </section>
          )}

          {stats.modelStats.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold mb-3">By Model</h2>
              <div className="grid grid-cols-3 gap-4">
                {stats.modelStats.map((m) => (
                  <div
                    key={m.model}
                    className="border border-border rounded-lg p-4"
                  >
                    <p className="text-xs text-muted font-mono">{m.model}</p>
                    <p className="text-lg font-semibold mt-1">
                      {m.cooperationRate}%
                    </p>
                    <p className="text-xs text-muted">
                      cooperation ({m.total} decisions)
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-sm font-semibold mb-3">Recent Games</h2>
            {games.length === 0 ? (
              <p className="text-sm text-muted">
                No games yet. Create one to get started.
              </p>
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
                          {game.participants.map((p) => p.persona.name).join(", ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={game.status} />
                        <span className="text-xs text-muted">
                          #{game.id}
                        </span>
                      </div>
                    </div>
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
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="border border-border rounded-lg p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    waiting: "bg-zinc-100 text-zinc-600",
    discussion: "bg-yellow-50 text-yellow-700",
    deciding: "bg-blue-50 text-blue-700",
    settled: "bg-green-50 text-green-700",
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded ${styles[status] || "bg-zinc-100"}`}
    >
      {status}
    </span>
  );
}
