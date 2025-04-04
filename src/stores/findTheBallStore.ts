import { create } from 'zustand';
import useEventStore from './eventStore';

const { setTrigger, setPassed: setPassedGlobal } = useEventStore.getState();

interface CupGameState {
  ballPosition: number;
  selectedCup: number | null;
  gameActive: boolean;
  finished: boolean;
  passed: boolean;
  timeLeft: number;

  setGameActive: (active: boolean) => void;
  setTimeLeft: (seconds: number) => void;
  setPassed: (passed: boolean) => void;
  shuffleCups: () => void;
  reset: () => void;
}

const useFindTheBallStore = create<CupGameState>((set) => ({
  ballPosition: Math.floor(Math.random() * 3),
  selectedCup: null,
  gameActive: false,
  finished: false,
  passed: false,
  timeLeft: 5,

  setGameActive: (active) => set({ gameActive: active }),
  setTimeLeft: (seconds) => set({ timeLeft: seconds }),

  setPassed: (passed) => {
    set({ passed, finished: true });
    setPassedGlobal(passed);
  },

  shuffleCups: () => {
    set({
      ballPosition: Math.floor(Math.random() * 3),
    });
  },

  reset: () => {
    setTrigger(Math.floor(Math.random() * 1000) + 1000);
    set({
      ballPosition: Math.floor(Math.random() * 3),
      selectedCup: null,
      gameActive: true,
      finished: false,
      passed: false,
      timeLeft: 5,
    });
  },
}));

export default useFindTheBallStore;
