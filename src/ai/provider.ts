import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export type ModelName =
  | "gpt-4o"
  | "gpt-4.1-mini"
  | "claude-sonnet-4"
  | "claude-haiku-4-5"
  | "gemini-2.5-flash";

export function llm(modelName: ModelName) {
  switch (modelName) {
    case "gpt-4o":
      return openai("gpt-4o");
    case "gpt-4.1-mini":
      return openai("gpt-4.1-mini");
    case "claude-sonnet-4":
      return anthropic("claude-sonnet-4-20250514");
    case "claude-haiku-4-5":
      return anthropic("claude-haiku-4-5-20251001");
    case "gemini-2.5-flash":
      return google("gemini-2.5-flash");
  }
}

const MODEL_POOL: ModelName[] = [
  "gpt-4.1-mini",
  "claude-haiku-4-5",
  "gemini-2.5-flash",
];

export function randomModel(): ModelName {
  return MODEL_POOL[Math.floor(Math.random() * MODEL_POOL.length)];
}
