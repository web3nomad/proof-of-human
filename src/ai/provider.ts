import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { createAzure } from "@ai-sdk/azure";
import { createVertex } from "@ai-sdk/google-vertex";

const bedrock = createAmazonBedrock({
  region: process.env.AWS_BEDROCK_REGION,
  accessKeyId: process.env.AWS_BEDROCK_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_BEDROCK_SECRET_ACCESS_KEY,
});

const azure = createAzure({
  resourceName: process.env.AZURE_EASTUS2_RESOURCE_NAME,
  apiKey: process.env.AZURE_EASTUS2_API_KEY,
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
  | "gpt-5.4"
  | "claude-sonnet-4-5"
  | "gemini-3.1-pro";

export function llm(modelName: ModelName) {
  switch (modelName) {
    case "gpt-5.4":
      return azure("gpt-5.4");
    case "claude-sonnet-4-5":
      return bedrock("global.anthropic.claude-sonnet-4-5-20250929-v1:0");
    case "gemini-3.1-pro":
      return vertex("gemini-3.1-pro-preview");
  }
}

const MODEL_POOL: ModelName[] = [
  "gpt-5.4",
  "claude-sonnet-4-5",
  "gemini-3.1-pro",
];

export function randomModel(): ModelName {
  return MODEL_POOL[Math.floor(Math.random() * MODEL_POOL.length)];
}
