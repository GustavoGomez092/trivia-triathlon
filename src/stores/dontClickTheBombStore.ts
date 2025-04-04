import { create } from 'zustand';
import useEventStore from './eventStore';

const { setTrigger, setPassed: setPassedGlobal } = useEventStore.getState();

const NUM_ITEMS = 12;
const BOMB_PROBABILITY = 0.25;

interface DontClickBombState {
  items: string[];
  selected: number[];
  finished: boolean;
  passed: boolean;
  setPassed: (passed: boolean) => void;
  reset: () => void;
  selectItem: (index: number) => void;
  generateItems: () => void;
}

const useDontClickBombStore = create<DontClickBombState>((set, get) => ({
  items: [],
  selected: [],
  finished: false,
  passed: false,

  setPassed: (passed) => {
    set({ passed, finished: true });
    setPassedGlobal(passed);
  },

  selectItem: (index) => {
    const { items, selected, finished } = get();
    if (finished || selected.includes(index)) return;

    const newSelected = [...selected, index];
    const clicked = items[index];

    if (clicked === '💣') {
      get().setPassed(false);
    } else {
      set({ selected: newSelected });

      // Check if all non-bombs are selected
      const safeIndexes = items
        .map((item, idx) => (item !== '💣' ? idx : null))
        .filter((x) => x !== null) as number[];

      if (safeIndexes.every((idx) => newSelected.includes(idx))) {
        get().setPassed(true);
      }
    }
  },

  generateItems: () => {
    const items = Array.from({ length: NUM_ITEMS }, () =>
      Math.random() < BOMB_PROBABILITY ? '💣' : '🔵',
    );
    set({ items });
  },

  reset: () => {
    setTrigger(Math.floor(Math.random() * 1000) + 1000);
    set({
      items: [],
      selected: [],
      finished: false,
      passed: false,
    });
    get().generateItems();
  },
}));

export default useDontClickBombStore;
