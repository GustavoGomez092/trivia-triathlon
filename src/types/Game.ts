import { Event } from './Event';

export interface Game {
  events: Event[];
  currentEvent: Event;
}

export const games = ['whackAKey'] as const;

export type GameType = (typeof games)[number];
