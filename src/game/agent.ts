import { generateObject } from "ai";
import { z } from "zod";
import { llm, ModelName } from "@/ai/provider";
import { Action, GameType, PersonaProfile, TimelineEvent } from "./types";

interface AgentContext {
  persona: PersonaProfile;
  modelName: ModelName;
  gameType: GameType;
  stakePerPlayer: number;
  playerCount: number;
  timeline: TimelineEvent[];
}

interface DiscussionResult {
  publicMessage: string;
  privateReasoning: string;
}

interface DecisionResult {
  action: Action;
  publicMessage: string;
  privateReasoning: string;
}

export async function generateDiscussion(
  ctx: AgentContext,
): Promise<DiscussionResult> {
  const actionChoices =
    ctx.gameType === "golden_ball" ? "split or steal" : "cooperate or defect";
  const pool = ctx.stakePerPlayer * ctx.playerCount;

  const history = ctx.timeline
    .filter((e) => e.type === "discussion")
    .map(
      (e) =>
        `${e.data.personaName}: "${e.data.publicMessage}"`,
    )
    .join("\n");

  const { object } = await generateObject({
    model: llm(ctx.modelName),
    schema: z.object({
      publicMessage: z
        .string()
        .describe("What you say publicly to other players (max 2 sentences)"),
      privateReasoning: z
        .string()
        .describe(
          "Your private strategic thinking (not visible to other players)",
        ),
    }),
    prompt: `You are ${ctx.persona.name}. ${ctx.persona.background}

You are playing a ${ctx.gameType.replace("_", " ")} game.
Each player has staked ${ctx.stakePerPlayer} sats. Total pool: ${pool} sats.
Players will choose to ${actionChoices}.
There are ${ctx.playerCount} players.

${history ? `Discussion so far:\n${history}\n` : ""}

Speak in character. Your public message should reflect your personality and strategy.
Your private reasoning should reveal your actual strategic thinking.
Keep both brief — 1-2 sentences each.`,
  });

  return object;
}

export async function generateDecision(
  ctx: AgentContext,
): Promise<DecisionResult> {
  const validActions =
    ctx.gameType === "golden_ball"
      ? (["split", "steal"] as const)
      : (["cooperate", "defect"] as const);
  const pool = ctx.stakePerPlayer * ctx.playerCount;

  const history = ctx.timeline
    .filter((e) => e.type === "discussion" || e.type === "decision")
    .map((e) => {
      if (e.type === "discussion") {
        return `${e.data.personaName}: "${e.data.publicMessage}"`;
      }
      return `${e.data.personaName} decided: ${e.data.action}`;
    })
    .join("\n");

  const { object } = await generateObject({
    model: llm(ctx.modelName),
    schema: z.object({
      action: z.enum(validActions).describe("Your final decision"),
      publicMessage: z
        .string()
        .describe("Brief statement about your decision (1 sentence)"),
      privateReasoning: z
        .string()
        .describe(
          "Your private reasoning for this decision (not visible to others)",
        ),
    }),
    prompt: `You are ${ctx.persona.name}. ${ctx.persona.background}
Your traits: ${ctx.persona.traits.join(", ")}

You are playing a ${ctx.gameType.replace("_", " ")} game.
Stake per player: ${ctx.stakePerPlayer} sats. Total pool: ${pool} sats.
There are ${ctx.playerCount} players.

${ctx.gameType === "golden_ball" ? `Rules: If all players split, the pool is divided equally. If one player steals and all others split, the stealer takes everything. If multiple players steal, nobody gets anything.` : `Rules: Mutual cooperation yields 1.5x stake each. If one defects and the other cooperates, the defector gets 2x and the cooperator gets nothing. Mutual defection yields 0.5x each.`}

${history ? `Game history:\n${history}\n` : ""}

Make your final decision. Stay in character.`,
  });

  return object;
}
