import { create } from 'zustand';

interface PatternRecognitionState {
  userPattern: boolean[];
  targetPattern: boolean[];
  gameActive: boolean;
  finished: boolean;
  passed: boolean;
  showFeedback: boolean;
  setGameActive: (active: boolean) => void;
  setPassed: (passed: boolean) => void;
  setUserPattern: (pattern: boolean[]) => void;
  generateNewPattern: () => void;
  toggleCell: (index: number) => void;
  checkPattern: () => void;
  reset: () => void;
}

const usePatternRecognitionStore = create<PatternRecognitionState>(
  (set, get) => ({
    userPattern: Array(15).fill(false),
    targetPattern: Array(15).fill(false),
    gameActive: false,
    finished: false,
    passed: false,
    showFeedback: false,

    setGameActive: (active) => set({ gameActive: active }),
    setPassed: (passed) => set({ passed }),

    setUserPattern: (pattern) => set({ userPattern: pattern }),

    generateNewPattern: () => {
      const newPattern = Array(15)
        .fill(false)
        .map(() => Math.random() > 0.5);
      set({ targetPattern: newPattern });
    },

    toggleCell: (index) => {
      const { userPattern } = get();
      const newPattern = [...userPattern];
      newPattern[index] = !newPattern[index];
      set({ userPattern: newPattern });
    },

    checkPattern: () => {
      const { userPattern, targetPattern } = get();
      const isCorrect = userPattern.every(
        (cell, index) => cell === targetPattern[index],
      );

      set({
        finished: true,
        passed: isCorrect,
        showFeedback: true,
      });
    },

    reset: () => {
      set({
        userPattern: Array(15).fill(false),
        finished: false,
        showFeedback: false,
      });
    },
  }),
);

export default usePatternRecognitionStore;
