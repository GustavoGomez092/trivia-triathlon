import { create } from 'zustand';
import useSprintStore from './sprintStore';
import triviaQuestions from '@/data/triviaQuestions.json';

type TriviaQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
};

interface TriviaState {
  currentQuestion: TriviaQuestion | null;
  score: number;
  passed: boolean;
  gameActive: boolean;
  finished: boolean;
  selectedOption: number | null;
  showFeedback: boolean;
  isCorrect: boolean | null;
  finish: () => void;
  setGameActive: (active: boolean) => void;
  setPassed: (passed: boolean) => void;
  increaseScore: () => void;
  reset: () => void;
  selectRandomQuestions: () => void;
  setSelectedOption: (optionIndex: number) => void;
}

const { setTrigger, setPassed: setPassedSprint } = useSprintStore.getState();

const useTriviaStore = create<TriviaState>((set, get) => ({
  currentQuestion: null,
  currentQuestionIndex: null,
  score: 0,
  passed: false,
  gameActive: false,
  finished: false,
  selectedOption: null,
  showFeedback: false,
  isCorrect: null,
  finish: () => set({ finished: true }),
  setGameActive: (active) => set({ gameActive: active }),
  setPassed: (passed) => {
    set({ passed });
    setPassedSprint(passed);
  },
  increaseScore: () => set((state) => ({ score: state.score + 1 })),
  reset: () => {
    setTrigger(Math.floor(Math.random() * 1000) + 1000);
    set({
      score: 0,
      passed: false,
      currentQuestion: null,
      finished: false,
      selectedOption: null,
      showFeedback: false,
      isCorrect: null,
    });
  },
  selectRandomQuestions: () => {
    const randomIndex = Math.floor(Math.random() * triviaQuestions.length);

    set({ currentQuestion: triviaQuestions[randomIndex] });
  },
  setSelectedOption: (optionIndex: number) => {
    const currentQuestion = get().currentQuestion;

    if (!currentQuestion) return;

    set({
      selectedOption: optionIndex,
      isCorrect: optionIndex === currentQuestion.correctAnswer,
      showFeedback: true,
    });
  },
  setShowFeedback: (show: boolean) => set({ showFeedback: show }),
}));

export default useTriviaStore;
