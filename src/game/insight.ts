import { generateObject } from "ai";
import { z } from "zod";
import { llm } from "@/ai/provider";
import { Action, GameType, TimelineEvent } from "./types";

interface InsightContext {
  gameType: GameType;
  humanAction: Action;
  humanAlias: string;
  aiDecisions: { personaName: string; modelName: string; action: Action }[];
  humanBaselineRate: number;
  timeline: TimelineEvent[];
}

export async function generateBehavioralInsight(ctx: InsightContext) {
  const gameLabel = ctx.gameType.replace("_", " ");
  const cooperativeAction = ctx.gameType === "golden_ball" ? "split" : "cooperate";
  const humanCooperated = ctx.humanAction === cooperativeAction;

  const aiSummary = ctx.aiDecisions
    .map((d) => `${d.personaName} (${d.modelName}): ${d.action}`)
    .join("\n");

  const aiCoopCount = ctx.aiDecisions.filter(
    (d) => d.action === cooperativeAction,
  ).length;
  const aiCoopRate = Math.round((aiCoopCount / ctx.aiDecisions.length) * 100);

  const { object } = await generateObject({
    model: llm("gpt-5.4"),
    schema: z.object({
      insight: z
        .string()
        .describe("2-3 sentence analysis comparing human vs AI behavior in this game"),
      calibrationScore: z
        .number()
        .min(0)
        .max(100)
        .describe("How well AI agents predicted/matched human behavior (100 = perfect match)"),
      patterns: z
        .array(z.string())
        .describe("2-3 behavioral patterns observed"),
    }),
    prompt: `You are analyzing a ${gameLabel} game between a human player and AI agents.

Human player "${ctx.humanAlias}" chose: ${ctx.humanAction}
AI agent decisions:
${aiSummary}

Human cooperation rate across all games: ${ctx.humanBaselineRate}%
AI cooperation rate in this game: ${aiCoopRate}%

The human ${humanCooperated ? "cooperated" : "defected"} while ${aiCoopCount}/${ctx.aiDecisions.length} AI agents cooperated.

Analyze what this reveals about:
1. The gap between human and AI economic behavior
2. How AI agents should calibrate their strategies based on human data
3. Whether AI models are over-cooperative, under-cooperative, or well-calibrated

Be specific and data-driven. This analysis helps AI developers understand how their models behave in economic contexts compared to real humans.`,
  });

  return object;
}
