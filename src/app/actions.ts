"use server";

import { prisma } from "@/lib/prisma";
import { randomModel } from "@/ai/provider";
import { PRESET_PERSONAS } from "@/game/personas";
import { DEFAULT_CONFIG, GameType, Action } from "@/game/types";
import { runGame, runAIPhase, submitHumanDecision } from "@/game/engine";
import { payInvoice } from "@/lib/lnbits";

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

export async function createHumanGameAction(
  gameType: GameType,
  humanAlias?: string,
) {
  const baseConfig = DEFAULT_CONFIG[gameType];
  const gameConfig = {
    ...baseConfig,
    hasHumanPlayer: true,
    participationFee: 100,
  };

  const aiCount = gameType === "golden_ball" ? 3 : 1;

  const shuffled = [...PRESET_PERSONAS]
    .sort(() => Math.random() - 0.5)
    .slice(0, aiCount);

  const session = await prisma.gameSession.create({
    data: {
      gameType,
      status: "waiting",
      config: JSON.parse(JSON.stringify(gameConfig)),
      timeline: [],
    },
  });

  await prisma.gameParticipant.create({
    data: {
      sessionId: session.id,
      seatIndex: 0,
      modelName: "human",
      stakeSats: gameConfig.stakePerPlayer,
      isHuman: true,
      humanAlias: humanAlias || "You",
    },
  });

  for (let i = 0; i < shuffled.length; i++) {
    const p = shuffled[i];
    let persona = await prisma.persona.findFirst({ where: { name: p.name } });
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
        seatIndex: i + 1,
        modelName: randomModel(),
        stakeSats: gameConfig.stakePerPlayer,
      },
    });
  }

  await runAIPhase(session.id);

  return session.id;
}

export async function submitDecisionAction(sessionId: number, action: Action) {
  const result = await submitHumanDecision(sessionId, action);
  return result;
}

export async function claimEarningsAction(sessionId: number, bolt11: string) {
  const humanParticipant = await prisma.gameParticipant.findFirst({
    where: { sessionId, isHuman: true },
  });
  if (!humanParticipant) throw new Error("No human participant");

  const existingClaim = await prisma.paymentRecord.findFirst({
    where: { sessionId, direction: "human_claim", status: "paid" },
  });
  if (existingClaim) throw new Error("Earnings already claimed");

  const config = (
    await prisma.gameSession.findUniqueOrThrow({ where: { id: sessionId } })
  ).config as unknown as { participationFee?: number };

  const totalEarnings =
    humanParticipant.payoffSats + (config.participationFee ?? 0);

  if (totalEarnings <= 0) throw new Error("No earnings to claim");

  try {
    const payment = await payInvoice(bolt11);
    await prisma.paymentRecord.create({
      data: {
        sessionId,
        direction: "human_claim",
        amountSats: totalEarnings,
        lnbitsPayment: JSON.parse(JSON.stringify(payment)),
        status: "paid",
      },
    });
    return { success: true, paymentHash: payment.payment_hash };
  } catch (e) {
    console.error("Failed to pay human:", e);
    return { success: false, error: "Payment failed" };
  }
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

  const humanParticipants = await prisma.gameParticipant.findMany({
    where: {
      isHuman: true,
      finalAction: { not: null },
      session: { status: "settled" },
    },
    select: { finalAction: true },
  });
  const humanCooperators = humanParticipants.filter(
    (p) => p.finalAction && cooperationActions.includes(p.finalAction),
  );
  const humanCooperationRate =
    humanParticipants.length > 0
      ? Math.round((humanCooperators.length / humanParticipants.length) * 100)
      : null;

  const totalHumanGames = await prisma.gameSession.count({
    where: {
      status: "settled",
      participants: { some: { isHuman: true } },
    },
  });

  const humanPayments = await prisma.paymentRecord.aggregate({
    where: { direction: { in: ["human_payout", "human_claim"] } },
    _sum: { amountSats: true },
  });
  const totalSatsPaidToHumans = humanPayments._sum.amountSats ?? 0;

  return {
    totalGames,
    cooperationRate,
    totalDecisions: participants.length,
    totalSatsStaked,
    totalSatsSettled,
    modelStats,
    featuredGame,
    humanCooperationRate,
    totalHumanGames,
    totalSatsPaidToHumans,
  };
}
