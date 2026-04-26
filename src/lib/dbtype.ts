import type { GameConfig, TimelineEvent, PayoffResult } from "@/game/types";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace PrismaJson {
    type GameSessionConfig = GameConfig;
    type GameSessionTimeline = TimelineEvent;
    type GameSessionResult = { payoffs: PayoffResult[] };
    type LnbitsPaymentData = {
      payment_hash: string;
      payment_request?: string;
      checking_id?: string;
    };
  }
}

export {};
