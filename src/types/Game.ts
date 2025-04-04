import { Event } from './Event';

export interface Game {
  events: Event[];
  currentEvent: Event;
}

export const swimmingGames = [
  'patternRecognition',
  'sequenceMemoryGame',
  'iconMemory',
  'colorMatch',
  'wordPairs',
] as const;
export const sprintGames = [
  'whackAKey',
  'targetShooting',
  'triviaGame',
] as const;
export const shootingGames = ['targetShooting'] as const;

export type SprintGameType = (typeof sprintGames)[number];
export type SwimmingGameType = (typeof swimmingGames)[number];
export type ShootingGameType = (typeof shootingGames)[number];
export type GameType = SprintGameType | SwimmingGameType | ShootingGameType;

export const events = ['sprint', 'swimming', 'shooting'] as const;
export type EventType = (typeof events)[number];

export const eventGamesMap: Record<EventType, readonly string[]> = {
  sprint: sprintGames,
  swimming: swimmingGames,
  shooting: shootingGames,
} as const;

export const CURRENT_EVENT = 'swimming';
