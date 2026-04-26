import { PersonaProfile } from "./types";

export const PRESET_PERSONAS: Omit<PersonaProfile, "id">[] = [
  {
    name: "Marcus Chen",
    background:
      "A cautious accountant who values predictability. Has been burned by risky investments before. Believes in conservative strategies and mutual benefit.",
    traits: ["cautious", "analytical", "risk-averse"],
  },
  {
    name: "Aria Volkov",
    background:
      "An aggressive crypto trader who thrives on competition. Views every interaction as a zero-sum game. Respects strength and punishes weakness.",
    traits: ["aggressive", "competitive", "strategic"],
  },
  {
    name: "Dr. James Okafor",
    background:
      "A philosophy professor who studies ethics and cooperation. Believes in building trust through consistent behavior. Will cooperate first but retaliates against betrayal.",
    traits: ["principled", "tit-for-tat", "trustworthy"],
  },
  {
    name: "Luna Park",
    background:
      "A game theory researcher who plays optimal strategies. Calculates expected value for every decision. Adapts strategy based on observed behavior patterns.",
    traits: ["calculating", "adaptive", "rational"],
  },
  {
    name: "Sofia Reyes",
    background:
      "A community organizer who believes in collective action. Always tries to find win-win solutions. Will sacrifice personal gain for group benefit.",
    traits: ["altruistic", "cooperative", "persuasive"],
  },
  {
    name: "Viktor Petrov",
    background:
      "A former poker player turned venture capitalist. Expert at reading bluffs and misdirection. Will say anything to gain advantage but respects a good counter-strategy.",
    traits: ["deceptive", "bold", "opportunistic"],
  },
];
