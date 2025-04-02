import { create } from 'zustand';
import useEventStore from './eventStore';

const { setTrigger, setPassed: setPassedSprint } = useEventStore.getState();

export interface TargetShootingStore {
  score: number;
  passed: boolean;
  speed: number;
  showTarget: boolean;
  gameActive: boolean;
  reset: () => void;
  setPassed: (val: boolean) => void;
  increaseScore: () => void;
  setShowTarget: (val: boolean) => void;
  setGameActive: (val: boolean) => void;
  increaseSpeed: () => void;
  decreaseSpeed: () => void;
}

const useTargetShootingStore = create<TargetShootingStore>((set) => ({
  passed: false,
  score: 0,
  showTarget: true,
  gameActive: true,
  speed: 1,
  setPassed: (val: boolean) => {
    set({ passed: val });
    setPassedSprint(val);
  },
  increaseScore: () => {
    set((state) => ({ score: state.score + 1 }));
  },
  reset: () =>
    set(() => {
      setTrigger(Math.floor(Math.random() * 1000) + 1000);
      return {
        score: 0,
        passed: false,
        speed: 1,
        showTarget: true,
        gameActive: true,
      };
    }),
  setShowTarget: (val: boolean) => set({ showTarget: val }),
  setGameActive: (val: boolean) => set({ gameActive: val }),
  increaseSpeed: () =>
    set((state) => ({ speed: state.speed >= 5 ? 5 : state.speed + 1 })),
  decreaseSpeed: () =>
    set((state) => ({ speed: state.speed <= 1 ? 1 : state.speed - 1 })),
}));

export default useTargetShootingStore;
