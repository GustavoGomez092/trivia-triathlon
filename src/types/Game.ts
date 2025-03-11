import { Event } from "./Event";

export interface Game {
  events: Event[];
  currentEvent: Event;
}