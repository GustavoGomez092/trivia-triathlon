import { TOTAL_DISTANCE } from '@/lib/utils';
import { Player } from '@/types/Player';
import { create } from 'zustand';

export interface EventStore {
  started: boolean;
  time: number;
  passed: boolean;
  player: Player | null;
  speed: number;
  finished: boolean;
  finishTime: number;
  distanceTraveled: number;
  totalDistance: number;
  trigger: number;
  start: () => void;
  finish: () => void;
  reset: () => void;
  speedIncrease: () => void;
  speedDecrease: () => void;
  setPassed: (val: boolean) => void;
  setTime: (time: number) => void;
  setPlayer: (player: Player) => void;
  setDistanceTraveled: (distance: number) => void;
  setTrigger: (trigger: number) => void;
}

const useEventStore = create<EventStore>((set) => ({
  started: false,
  time: 0,
  passed: false,
  player: null,
  speed: 100,
  finished: false,
  finishTime: 0,
  distanceTraveled: 0,
  totalDistance: TOTAL_DISTANCE,
  trigger: Math.floor(Math.random() * 1000) + 1000,
  setPassed: (val) => set({ passed: val }),
  start: () => set({ started: true }),
  finish: () => set((state) => ({ finished: true, finishTime: state.time })),
  reset: () => set({ started: false, finished: false, time: 0, finishTime: 0 }),
  speedIncrease: () =>
    set((state) => ({
      speed: state.speed < 150 ? state.speed + 25 : state.speed,
    })),
  speedDecrease: () =>
    set((state) => ({
      speed: state.speed > 50 ? state.speed - 25 : state.speed,
    })),
  setTime: (time) => set({ time }),
  setDistanceTraveled: (distance) => set({ distanceTraveled: distance }),
  setPlayer: (player: Player) => set({ player }),
  setTrigger: (trigger) => set({ trigger }),
}));

export default useEventStore;
