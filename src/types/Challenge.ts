export enum ChallengeType {
  BUTTON_SMASH = "BUTTON_SMASH",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  WHACK_A_MOLE = "WHACK_A_MOLE",
}

export interface Challenge {
  id: string;
  name: string;
  type: ChallengeType;
  description: string;
  points: number;
  completed: boolean;
}