import { Event } from './Event';

export interface Game {
  events: Event[];
  currentEvent: Event;
}

export const swimmingGames = [
  'patternRecognition',
  'sequenceMemoryGame',
  'iconMemory',

  'findTheBall',
  'dontClickBomb',
] as const;
export const sprintGames = [
  'whackAKey',
  'targetShooting',
  'triviaGame',
] as const;
export const cyclingGames = ['findTheBall', 'dontClickBomb'] as const;

export type SprintGameType = (typeof sprintGames)[number];
export type SwimmingGameType = (typeof swimmingGames)[number];
export type CyclingGameType = (typeof cyclingGames)[number];
export type GameType = SprintGameType | SwimmingGameType | CyclingGameType;

export const events = ['sprint', 'swimming', 'cycling'] as const;
export type EventType = (typeof events)[number];

export const eventGamesMap: Record<EventType, readonly string[]> = {
  sprint: sprintGames,
  swimming: swimmingGames,
  cycling: cyclingGames,
} as const;

export const CURRENT_EVENT = 'swimming';
