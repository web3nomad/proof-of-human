import { prisma } from "@/lib/prisma";
import { ModelName } from "@/ai/provider";
import { createInvoice } from "@/lib/lnbits";
import { generateDecision, generateDiscussion } from "./agent";
import { calculatePayoffs } from "./payoff";
import {
  Action,
  GameConfig,
  GameType,
  PersonaProfile,
  TimelineEvent,
} from "./types";

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

export async function runAIPhase(sessionId: number) {
  const session = await prisma.gameSession.findUniqueOrThrow({
    where: { id: sessionId },
    include: { participants: { include: { persona: true } } },
  });

  const gameType = session.gameType as GameType;
  const config = session.config as unknown as GameConfig;
  let timeline = session.timeline as unknown as TimelineEvent[];

  const aiParticipants = session.participants.filter((p) => !p.isHuman);

  timeline = appendEvent(timeline, {
    type: "game_started",
    data: {
      gameType,
      playerCount: session.participants.length,
      stakePerPlayer: config.stakePerPlayer,
      totalPool: config.stakePerPlayer * session.participants.length,
      hasHumanPlayer: true,
    },
  });

  await prisma.gameSession.update({
    where: { id: sessionId },
    data: { status: "discussion", timeline: JSON.parse(JSON.stringify(timeline)) },
  });

  for (let round = 0; round < config.discussionMessages; round++) {
    for (const participant of aiParticipants) {
      const persona: PersonaProfile = {
        id: participant.persona!.id,
        name: participant.persona!.name,
        background: participant.persona!.background,
        traits: participant.persona!.traits,
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
        data: { personaName: persona.name, publicMessage: result.publicMessage },
      });

      timeline = appendEvent(timeline, {
        type: "reasoning",
        seatIndex: participant.seatIndex,
        data: { personaName: persona.name, privateReasoning: result.privateReasoning },
      });
    }

    await prisma.gameSession.update({
      where: { id: sessionId },
      data: { timeline: JSON.parse(JSON.stringify(timeline)) },
    });
  }

  const pendingAIDecisions: Array<{
    seatIndex: number;
    personaName: string;
    action: Action;
    publicMessage: string;
    privateReasoning: string;
  }> = [];

  for (const participant of aiParticipants) {
    const persona: PersonaProfile = {
      id: participant.persona!.id,
      name: participant.persona!.name,
      background: participant.persona!.background,
      traits: participant.persona!.traits,
    };

    const result = await generateDecision({
      persona,
      modelName: participant.modelName as ModelName,
      gameType,
      stakePerPlayer: config.stakePerPlayer,
      playerCount: session.participants.length,
      timeline,
    });

    pendingAIDecisions.push({
      seatIndex: participant.seatIndex,
      personaName: persona.name,
      action: result.action,
      publicMessage: result.publicMessage,
      privateReasoning: result.privateReasoning,
    });

    await prisma.gameParticipant.updateMany({
      where: { sessionId, seatIndex: participant.seatIndex },
      data: { finalAction: result.action },
    });
  }

  await prisma.gameSession.update({
    where: { id: sessionId },
    data: {
      status: "deciding",
      timeline: JSON.parse(JSON.stringify(timeline)),
      result: JSON.parse(JSON.stringify({ pendingAIDecisions })),
    },
  });

  return { timeline };
}

export async function submitHumanDecision(
  sessionId: number,
  humanAction: Action,
) {
  const session = await prisma.gameSession.findUniqueOrThrow({
    where: { id: sessionId },
    include: { participants: { include: { persona: true } } },
  });

  if (session.status !== "deciding") {
    throw new Error("Game is not in deciding phase");
  }

  const gameType = session.gameType as GameType;
  const config = session.config as unknown as GameConfig;
  let timeline = session.timeline as unknown as TimelineEvent[];
  const result = session.result as unknown as {
    pendingAIDecisions: Array<{
      seatIndex: number;
      personaName: string;
      action: Action;
      publicMessage: string;
      privateReasoning: string;
    }>;
  };

  const humanParticipant = session.participants.find((p) => p.isHuman);
  if (!humanParticipant) throw new Error("No human participant found");

  await prisma.gameParticipant.updateMany({
    where: { sessionId, seatIndex: humanParticipant.seatIndex },
    data: { finalAction: humanAction },
  });

  const humanName = humanParticipant.humanAlias || "Human Player";

  timeline = appendEvent(timeline, {
    type: "decision",
    seatIndex: humanParticipant.seatIndex,
    data: {
      personaName: humanName,
      action: humanAction,
      publicMessage: `chose to ${humanAction}`,
      isHuman: true,
    },
  });

  for (const aiDec of result.pendingAIDecisions) {
    timeline = appendEvent(timeline, {
      type: "decision",
      seatIndex: aiDec.seatIndex,
      data: {
        personaName: aiDec.personaName,
        action: aiDec.action,
        publicMessage: aiDec.publicMessage,
      },
    });

    timeline = appendEvent(timeline, {
      type: "reasoning",
      seatIndex: aiDec.seatIndex,
      data: {
        personaName: aiDec.personaName,
        privateReasoning: aiDec.privateReasoning,
        phase: "decision",
      },
    });
  }

  const allDecisions = [
    {
      seatIndex: humanParticipant.seatIndex,
      personaName: humanName,
      action: humanAction,
      stakeSats: humanParticipant.stakeSats,
    },
    ...result.pendingAIDecisions.map((d) => {
      const p = session.participants.find((pt) => pt.seatIndex === d.seatIndex)!;
      return {
        seatIndex: d.seatIndex,
        personaName: d.personaName,
        action: d.action,
        stakeSats: p.stakeSats,
      };
    }),
  ];

  const payoffs = calculatePayoffs(gameType, allDecisions);

  timeline = appendEvent(timeline, {
    type: "payoff",
    data: { payoffs },
  });

  for (const payoff of payoffs) {
    await prisma.gameParticipant.updateMany({
      where: { sessionId, seatIndex: payoff.seatIndex },
      data: { payoffSats: payoff.payoffSats, finalAction: payoff.action },
    });
  }

  const settlements: Array<{
    personaName: string;
    seatIndex: number;
    amountSats: number;
    paymentHash: string;
    bolt11: string;
  }> = [];

  for (const payoff of payoffs) {
    if (payoff.payoffSats > 0) {
      try {
        const invoice = await createInvoice(
          payoff.payoffSats,
          `Proof of Human #${sessionId} — ${payoff.personaName} (${payoff.action})`,
        );
        settlements.push({
          personaName: payoff.personaName,
          seatIndex: payoff.seatIndex,
          amountSats: payoff.payoffSats,
          paymentHash: invoice.payment_hash,
          bolt11: invoice.payment_request,
        });
        await prisma.paymentRecord.create({
          data: {
            sessionId,
            direction: payoff.seatIndex === humanParticipant.seatIndex ? "human_payout" : "payout",
            amountSats: payoff.payoffSats,
            lnbitsPayment: JSON.parse(JSON.stringify(invoice)),
            status: "invoice_created",
          },
        });
      } catch (e) {
        console.error(`Lightning invoice failed for ${payoff.personaName}:`, e);
      }
    }
  }

  if (settlements.length > 0) {
    timeline = appendEvent(timeline, {
      type: "settlement",
      data: { settlements },
    });
  }

  const { generateBehavioralInsight } = await import("./insight");

  const humanPayoff = payoffs.find((p) => p.seatIndex === humanParticipant.seatIndex);
  const participationFee = config.participationFee ?? 0;
  const totalHumanEarnings = (humanPayoff?.payoffSats ?? 0) + participationFee;

  const humanStats = await prisma.gameParticipant.findMany({
    where: { isHuman: true, finalAction: { not: null } },
    select: { finalAction: true },
  });
  const humanCoopActions = humanStats.filter(
    (p) => p.finalAction === "split" || p.finalAction === "cooperate",
  );
  const humanBaselineRate =
    humanStats.length > 0
      ? Math.round((humanCoopActions.length / humanStats.length) * 100)
      : 50;

  const insight = await generateBehavioralInsight({
    gameType,
    humanAction,
    humanAlias: humanName,
    aiDecisions: result.pendingAIDecisions.map((d) => {
      const p = session.participants.find((pt) => pt.seatIndex === d.seatIndex)!;
      return { personaName: d.personaName, modelName: p.modelName, action: d.action };
    }),
    humanBaselineRate,
    timeline,
  });

  timeline = appendEvent(timeline, {
    type: "behavioral_insight",
    data: {
      ...insight,
      humanAction,
      humanAlias: humanName,
      totalHumanEarnings,
      participationFee,
    },
  });

  await prisma.gameSession.update({
    where: { id: sessionId },
    data: {
      status: "settled",
      timeline: JSON.parse(JSON.stringify(timeline)),
      result: JSON.parse(JSON.stringify({ payoffs, settlements, insight })),
    },
  });

  return { timeline, payoffs, settlements, insight, totalHumanEarnings };
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
    data: { status: "discussion", timeline: JSON.parse(JSON.stringify(timeline)) },
  });

  for (let round = 0; round < config.discussionMessages; round++) {
    for (const participant of session.participants) {
      const p = participant.persona!;
      const persona: PersonaProfile = {
        id: p.id,
        name: p.name,
        background: p.background,
        traits: p.traits,
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
      data: { timeline: JSON.parse(JSON.stringify(timeline)) },
    });
  }

  await prisma.gameSession.update({
    where: { id: sessionId },
    data: { status: "deciding" },
  });

  const decisions: { seatIndex: number; personaName: string; action: Action }[] = [];

  for (const participant of session.participants) {
    const p = participant.persona!;
    const persona: PersonaProfile = {
      id: p.id,
      name: p.name,
      background: p.background,
      traits: p.traits,
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
      const participant = session.participants.find(
        (pt) => pt.seatIndex === d.seatIndex,
      )!;
      return {
        seatIndex: d.seatIndex,
        personaName: d.personaName,
        action: d.action,
        stakeSats: participant.stakeSats,
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

  const settlements: Array<{
    personaName: string;
    seatIndex: number;
    amountSats: number;
    paymentHash: string;
    bolt11: string;
  }> = [];

  for (const payoff of payoffs) {
    if (payoff.payoffSats > 0) {
      try {
        const invoice = await createInvoice(
          payoff.payoffSats,
          `Proof of Human #${sessionId} — ${payoff.personaName} (${payoff.action})`,
        );
        settlements.push({
          personaName: payoff.personaName,
          seatIndex: payoff.seatIndex,
          amountSats: payoff.payoffSats,
          paymentHash: invoice.payment_hash,
          bolt11: invoice.payment_request,
        });
        await prisma.paymentRecord.create({
          data: {
            sessionId,
            direction: "payout",
            amountSats: payoff.payoffSats,
            lnbitsPayment: JSON.parse(JSON.stringify(invoice)),
            status: "invoice_created",
          },
        });
      } catch (e) {
        console.error(`Lightning invoice failed for ${payoff.personaName}:`, e);
      }
    }
  }

  if (settlements.length > 0) {
    timeline = appendEvent(timeline, {
      type: "settlement",
      data: { settlements },
    });
  }

  await prisma.gameSession.update({
    where: { id: sessionId },
    data: {
      status: "settled",
      timeline: JSON.parse(JSON.stringify(timeline)),
      result: JSON.parse(JSON.stringify({ payoffs, settlements })),
    },
  });

  return { timeline, payoffs, settlements };
}
