export type GameType = "golden_ball" | "prisoners_dilemma";

export type GameStatus = "waiting" | "discussion" | "deciding" | "settled";

export type Action = "split" | "steal" | "cooperate" | "defect";

export interface TimelineEvent {
  type: "game_started" | "discussion" | "reasoning" | "decision" | "payoff" | "settlement" | "behavioral_insight";
  timestamp: string;
  seatIndex?: number;
  data: Record<string, unknown>;
}

export interface PersonaProfile {
  id: number;
  name: string;
  background: string;
  traits: string[];
}

export interface GameConfig {
  stakePerPlayer: number;
  rounds: number;
  discussionMessages: number;
  participationFee?: number;
  hasHumanPlayer?: boolean;
}

export interface PayoffResult {
  seatIndex: number;
  personaName: string;
  action: Action;
  payoffSats: number;
}

export const DEFAULT_CONFIG: Record<GameType, GameConfig> = {
  golden_ball: {
    stakePerPlayer: 1000,
    rounds: 1,
    discussionMessages: 2,
  },
  prisoners_dilemma: {
    stakePerPlayer: 500,
    rounds: 3,
    discussionMessages: 1,
  },
};
