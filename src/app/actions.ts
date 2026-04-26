"use server";

import { prisma } from "@/lib/prisma";
import { randomModel } from "@/ai/provider";
import { PRESET_PERSONAS } from "@/game/personas";
import { DEFAULT_CONFIG, GameType, GameConfig } from "@/game/types";
import { runGame } from "@/game/engine";

export async function createGameAction(
  gameType: GameType,
  playerCount: number = 4,
) {
  const gameConfig = DEFAULT_CONFIG[gameType];

  const shuffled = [...PRESET_PERSONAS]
    .sort(() => Math.random() - 0.5)
    .slice(0, playerCount);

  const session = await prisma.gameSession.create({
    data: {
      gameType,
      status: "waiting",
      config: JSON.parse(JSON.stringify(gameConfig)),
      timeline: [],
    },
  });

  for (let i = 0; i < shuffled.length; i++) {
    const p = shuffled[i];
    let persona = await prisma.persona.findFirst({
      where: { name: p.name },
    });
    if (!persona) {
      persona = await prisma.persona.create({
        data: {
          name: p.name,
          background: p.background,
          traits: p.traits,
          modelFamily: "random",
        },
      });
    }

    await prisma.gameParticipant.create({
      data: {
        sessionId: session.id,
        personaId: persona.id,
        seatIndex: i,
        modelName: randomModel(),
        stakeSats: gameConfig.stakePerPlayer,
      },
    });
  }

  return session.id;
}

export async function runGameAction(sessionId: number) {
  const result = await runGame(sessionId);
  return result;
}

export async function getGameAction(sessionId: number) {
  const session = await prisma.gameSession.findUniqueOrThrow({
    where: { id: sessionId },
    include: {
      participants: {
        include: { persona: true },
        orderBy: { seatIndex: "asc" },
      },
    },
  });
  return session;
}

export async function listGamesAction() {
  const sessions = await prisma.gameSession.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      participants: {
        include: { persona: true },
        orderBy: { seatIndex: "asc" },
      },
    },
  });
  return sessions;
}

export async function getStatsAction() {
  const totalGames = await prisma.gameSession.count({
    where: { status: "settled" },
  });

  const participants = await prisma.gameParticipant.findMany({
    where: {
      session: { status: "settled" },
      finalAction: { not: null },
    },
    select: { finalAction: true, modelName: true, stakeSats: true },
  });

  const cooperationActions = ["split", "cooperate"];
  const cooperators = participants.filter(
    (p) => p.finalAction && cooperationActions.includes(p.finalAction),
  );
  const cooperationRate =
    participants.length > 0
      ? Math.round((cooperators.length / participants.length) * 100)
      : 0;

  const totalSatsStaked = participants.reduce((sum, p) => sum + p.stakeSats, 0);

  const paymentAgg = await prisma.paymentRecord.aggregate({
    _sum: { amountSats: true },
  });
  const totalSatsSettled = paymentAgg._sum.amountSats ?? 0;

  const byModel: Record<string, { total: number; cooperative: number }> = {};
  for (const participant of participants) {
    if (!byModel[participant.modelName]) {
      byModel[participant.modelName] = { total: 0, cooperative: 0 };
    }
    byModel[participant.modelName].total++;
    if (participant.finalAction && cooperationActions.includes(participant.finalAction)) {
      byModel[participant.modelName].cooperative++;
    }
  }

  const modelStats = Object.entries(byModel).map(([model, stats]) => ({
    model,
    total: stats.total,
    cooperationRate: Math.round((stats.cooperative / stats.total) * 100),
  }));

  const featuredGame = await prisma.gameSession.findFirst({
    where: {
      status: "settled",
      participants: {
        some: { finalAction: { in: ["steal", "defect"] } },
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      participants: {
        include: { persona: true },
        orderBy: { seatIndex: "asc" },
      },
    },
  }) ?? await prisma.gameSession.findFirst({
    where: { status: "settled" },
    orderBy: { createdAt: "desc" },
    include: {
      participants: {
        include: { persona: true },
        orderBy: { seatIndex: "asc" },
      },
    },
  });

  return {
    totalGames,
    cooperationRate,
    totalDecisions: participants.length,
    totalSatsStaked,
    totalSatsSettled,
    modelStats,
    featuredGame,
  };
}
