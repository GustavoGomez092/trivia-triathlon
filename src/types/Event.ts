import { Challenge } from "./Challenge";
import { Player } from "./Player";
import { Score } from "./Score";

export interface Event {
  id: string;
  name: string;
  participants: Player[];
  scores: Score[];
  challenges: Challenge[];
}