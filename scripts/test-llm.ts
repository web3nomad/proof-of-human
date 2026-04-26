import "dotenv/config";
import { generateText } from "ai";
import { llm, ModelName } from "../src/ai/provider";

const models: ModelName[] = [
  "gpt-4.1-mini",
  "claude-haiku-4-5",
  "gemini-3-flash",
];

async function testModel(modelName: ModelName) {
  const start = Date.now();
  try {
    const { text } = await generateText({
      model: llm(modelName),
      prompt: "Say 'hello' and nothing else.",
      maxTokens: 10,
    });
    const ms = Date.now() - start;
    console.log(`✓ ${modelName} (${ms}ms): ${text.trim()}`);
  } catch (e) {
    const ms = Date.now() - start;
    const msg = e instanceof Error ? e.message : String(e);
    console.log(`✗ ${modelName} (${ms}ms): ${msg.slice(0, 120)}`);
  }
}

async function main() {
  console.log("Testing LLM providers...\n");
  for (const model of models) {
    await testModel(model);
  }
  console.log("\nDone.");
}

main();
