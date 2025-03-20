import { Event } from './Event';

export interface Game {
  events: Event[];
  currentEvent: Event;
}

export const games = ['whackAKey', 'targetShooting', 'triviaGame'] as const;

export type GameType = (typeof games)[number];

export const events = ['sprint', 'swimming', 'shooting'] as const;

export type EventType = (typeof events)[number];
