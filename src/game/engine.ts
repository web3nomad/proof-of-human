import { prisma } from "@/lib/prisma";
import { randomModel, ModelName } from "@/ai/provider";
import { generateDecision, generateDiscussion } from "./agent";
import { calculatePayoffs } from "./payoff";
import { PRESET_PERSONAS } from "./personas";
import {
  Action,
  DEFAULT_CONFIG,
  GameConfig,
  GameType,
  PersonaProfile,
  TimelineEvent,
} from "./types";

export async function createGame(
  gameType: GameType,
  playerCount: number = 4,
  config?: Partial<GameConfig>,
) {
  const gameConfig = { ...DEFAULT_CONFIG[gameType], ...config };

  const shuffled = [...PRESET_PERSONAS]
    .sort(() => Math.random() - 0.5)
    .slice(0, playerCount);

  const session = await prisma.gameSession.create({
    data: {
      gameType,
      status: "waiting",
      config: gameConfig as Record<string, unknown>,
      timeline: [],
    },
  });

  const participants = await Promise.all(
    shuffled.map(async (p, i) => {
      const persona = await prisma.persona.upsert({
        where: { id: 0 },
        update: {},
        create: {
          name: p.name,
          background: p.background,
          traits: p.traits,
          modelFamily: "random",
        },
      });

      return prisma.gameParticipant.create({
        data: {
          sessionId: session.id,
          personaId: persona.id,
          seatIndex: i,
          modelName: randomModel(),
          stakeSats: gameConfig.stakePerPlayer,
        },
        include: { persona: true },
      });
    }),
  );

  return { session, participants };
}

function appendEvent(
  existing: unknown[],
  event: Omit<TimelineEvent, "timestamp">,
): TimelineEvent[] {
  const full: TimelineEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };
  return [...(existing as TimelineEvent[]), full];
}

export async function runGame(sessionId: number) {
  const session = await prisma.gameSession.findUniqueOrThrow({
    where: { id: sessionId },
    include: { participants: { include: { persona: true } } },
  });

  const gameType = session.gameType as GameType;
  const config = session.config as unknown as GameConfig;
  let timeline = session.timeline as unknown as TimelineEvent[];

  timeline = appendEvent(timeline, {
    type: "game_started",
    data: {
      gameType,
      playerCount: session.participants.length,
      stakePerPlayer: config.stakePerPlayer,
      totalPool: config.stakePerPlayer * session.participants.length,
    },
  });

  await prisma.gameSession.update({
    where: { id: sessionId },
    data: { status: "discussion", timeline: timeline as unknown as Record<string, unknown>[] },
  });

  for (let round = 0; round < config.discussionMessages; round++) {
    for (const participant of session.participants) {
      const persona: PersonaProfile = {
        id: participant.persona.id,
        name: participant.persona.name,
        background: participant.persona.background,
        traits: participant.persona.traits,
      };

      const result = await generateDiscussion({
        persona,
        modelName: participant.modelName as ModelName,
        gameType,
        stakePerPlayer: config.stakePerPlayer,
        playerCount: session.participants.length,
        timeline,
      });

      timeline = appendEvent(timeline, {
        type: "discussion",
        seatIndex: participant.seatIndex,
        data: {
          personaName: persona.name,
          publicMessage: result.publicMessage,
        },
      });

      timeline = appendEvent(timeline, {
        type: "reasoning",
        seatIndex: participant.seatIndex,
        data: {
          personaName: persona.name,
          privateReasoning: result.privateReasoning,
        },
      });
    }

    await prisma.gameSession.update({
      where: { id: sessionId },
      data: { timeline: timeline as unknown as Record<string, unknown>[] },
    });
  }

  await prisma.gameSession.update({
    where: { id: sessionId },
    data: { status: "deciding" },
  });

  const decisions: { seatIndex: number; personaName: string; action: Action }[] = [];

  for (const participant of session.participants) {
    const persona: PersonaProfile = {
      id: participant.persona.id,
      name: participant.persona.name,
      background: participant.persona.background,
      traits: participant.persona.traits,
    };

    const result = await generateDecision({
      persona,
      modelName: participant.modelName as ModelName,
      gameType,
      stakePerPlayer: config.stakePerPlayer,
      playerCount: session.participants.length,
      timeline,
    });

    decisions.push({
      seatIndex: participant.seatIndex,
      personaName: persona.name,
      action: result.action,
    });

    timeline = appendEvent(timeline, {
      type: "decision",
      seatIndex: participant.seatIndex,
      data: {
        personaName: persona.name,
        action: result.action,
        publicMessage: result.publicMessage,
      },
    });

    timeline = appendEvent(timeline, {
      type: "reasoning",
      seatIndex: participant.seatIndex,
      data: {
        personaName: persona.name,
        privateReasoning: result.privateReasoning,
        phase: "decision",
      },
    });
  }

  const payoffs = calculatePayoffs(
    gameType,
    decisions.map((d) => {
      const p = session.participants.find(
        (p) => p.seatIndex === d.seatIndex,
      )!;
      return {
        seatIndex: d.seatIndex,
        personaName: d.personaName,
        action: d.action,
        stakeSats: p.stakeSats,
      };
    }),
  );

  timeline = appendEvent(timeline, {
    type: "payoff",
    data: { payoffs },
  });

  for (const payoff of payoffs) {
    await prisma.gameParticipant.updateMany({
      where: { sessionId, seatIndex: payoff.seatIndex },
      data: {
        payoffSats: payoff.payoffSats,
        finalAction: payoff.action,
      },
    });
  }

  await prisma.gameSession.update({
    where: { id: sessionId },
    data: {
      status: "settled",
      timeline: timeline as unknown as Record<string, unknown>[],
      result: { payoffs } as unknown as Record<string, unknown>,
    },
  });

  return { timeline, payoffs };
}
