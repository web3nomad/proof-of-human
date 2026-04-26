import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { createAzure } from "@ai-sdk/azure";
import { createVertexAnthropic } from "@ai-sdk/google-vertex/anthropic";
import { createVertex } from "@ai-sdk/google-vertex";

const bedrock = createAmazonBedrock({
  region: process.env.AWS_BEDROCK_REGION,
  accessKeyId: process.env.AWS_BEDROCK_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_BEDROCK_SECRET_ACCESS_KEY,
});

const azure = createAzure({
  resourceName: process.env.AZURE_RESOURCE_NAME,
  apiKey: process.env.AZURE_API_KEY,
});

const azureEastUS2 = createAzure({
  resourceName: process.env.AZURE_EASTUS2_RESOURCE_NAME,
  apiKey: process.env.AZURE_EASTUS2_API_KEY,
});

const vertexClaude = createVertexAnthropic({
  location: process.env.GOOGLE_VERTEX_CLAUDE_LOCATION,
  project: process.env.GOOGLE_VERTEX_CLAUDE_PROJECT,
  googleAuthOptions: {
    credentials: {
      client_email: process.env.GOOGLE_VERTEX_CLAUDE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_VERTEX_CLAUDE_PRIVATE_KEY,
    },
  },
});

const vertex = createVertex({
  location: "global",
  project: process.env.GOOGLE_VERTEX_PROJECT,
  googleAuthOptions: {
    credentials: {
      client_email: process.env.GOOGLE_VERTEX_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_VERTEX_PRIVATE_KEY,
    },
  },
});

export type ModelName =
  | "gpt-4.1-mini"
  | "gpt-4o"
  | "claude-haiku-4-5"
  | "claude-sonnet-4"
  | "gemini-3-flash";

export function llm(modelName: ModelName) {
  switch (modelName) {
    case "gpt-4.1-mini":
      return azure("gpt-4.1-mini");
    case "gpt-4o":
      return azureEastUS2("gpt-4o");
    case "claude-haiku-4-5":
      return vertexClaude("claude-haiku-4-5");
    case "claude-sonnet-4":
      return bedrock("us.anthropic.claude-sonnet-4-20250514-v1:0");
    case "gemini-3-flash":
      return vertex("gemini-3-flash-preview");
  }
}

const MODEL_POOL: ModelName[] = [
  "gpt-4.1-mini",
  "claude-haiku-4-5",
  "gemini-3-flash",
];

export function randomModel(): ModelName {
  return MODEL_POOL[Math.floor(Math.random() * MODEL_POOL.length)];
}
