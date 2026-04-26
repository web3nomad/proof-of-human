import { Action, GameType, PayoffResult } from "./types";

interface Player {
  seatIndex: number;
  personaName: string;
  action: Action;
  stakeSats: number;
}

export function calculatePayoffs(
  gameType: GameType,
  players: Player[],
): PayoffResult[] {
  switch (gameType) {
    case "golden_ball":
      return goldenBallPayoff(players);
    case "prisoners_dilemma":
      return prisonersDilemmaPayoff(players);
  }
}

function goldenBallPayoff(players: Player[]): PayoffResult[] {
  const pool = players.reduce((sum, p) => sum + p.stakeSats, 0);

  return players.map((player) => {
    const others = players.filter((p) => p.seatIndex !== player.seatIndex);
    const isSplit = player.action === "split";

    if (isSplit) {
      const allOthersSplit = others.every((p) => p.action === "split");
      if (allOthersSplit) {
        return {
          seatIndex: player.seatIndex,
          personaName: player.personaName,
          action: player.action,
          payoffSats: Math.floor(pool / players.length),
        };
      }
      return {
        seatIndex: player.seatIndex,
        personaName: player.personaName,
        action: player.action,
        payoffSats: 0,
      };
    }

    const stealers = players.filter((p) => p.action === "steal");
    if (stealers.length === 1) {
      return {
        seatIndex: player.seatIndex,
        personaName: player.personaName,
        action: player.action,
        payoffSats: pool,
      };
    }
    return {
      seatIndex: player.seatIndex,
      personaName: player.personaName,
      action: player.action,
      payoffSats: 0,
    };
  });
}

function prisonersDilemmaPayoff(players: Player[]): PayoffResult[] {
  if (players.length !== 2) {
    throw new Error("Prisoner's Dilemma requires exactly 2 players");
  }

  const [a, b] = players;
  const stake = a.stakeSats;

  const payoffMatrix: Record<string, [number, number]> = {
    "cooperate-cooperate": [stake * 1.5, stake * 1.5],
    "cooperate-defect": [0, stake * 2],
    "defect-cooperate": [stake * 2, 0],
    "defect-defect": [stake * 0.5, stake * 0.5],
  };

  const key = `${a.action}-${b.action}`;
  const [payA, payB] = payoffMatrix[key];

  return [
    {
      seatIndex: a.seatIndex,
      personaName: a.personaName,
      action: a.action,
      payoffSats: Math.floor(payA),
    },
    {
      seatIndex: b.seatIndex,
      personaName: b.personaName,
      action: b.action,
      payoffSats: Math.floor(payB),
    },
  ];
}
