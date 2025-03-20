import { create } from 'zustand';
import useSprintStore from './sprintStore';

type TriviaQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
};

interface TriviaState {
  allQuestions: TriviaQuestion[];
  currentQuestions: TriviaQuestion[];
  currentQuestionIndex: number;
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
  nextQuestion: () => void;
  setSelectedOption: (optionIndex: number) => void;
}

const TOTAL_QUESTIONS = 1;

// 100 trivia questions about fun facts
const triviaQuestions: TriviaQuestion[] = [
  {
    id: 1,
    question: "What color is a flamingo when it's born?",
    options: ['Pink', 'Gray', 'White', 'Orange'],
    correctAnswer: 1, // Gray
  },
  {
    id: 2,
    question: "What is the only food that doesn't spoil?",
    options: ['Dried beans', 'Honey', 'Pemmican', 'Salt'],
    correctAnswer: 1, // Honey
  },
  // Add 98 more questions here
  {
    id: 3,
    question: 'Which planet has the shortest day?',
    options: ['Mercury', 'Venus', 'Jupiter', 'Neptune'],
    correctAnswer: 2, // Jupiter
  },
  {
    id: 4,
    question: 'How many hearts does an octopus have?',
    options: ['1', '2', '3', '4'],
    correctAnswer: 2, // 3
  },
  {
    id: 5,
    question: "What percentage of the Earth's surface is covered by the ocean?",
    options: ['51%', '61%', '71%', '81%'],
    correctAnswer: 2, // 71%
  },
  // ... and so on until 100 questions
  {
    id: 100,
    question: "What is the only mammal that can't jump?",
    options: ['Elephant', 'Sloth', 'Hippo', 'Rhino'],
    correctAnswer: 0, // Elephant
  },
];

const { setTrigger, setPassed: setPassedSprint } = useSprintStore.getState();

const useTriviaStore = create<TriviaState>((set, get) => ({
  allQuestions: triviaQuestions,
  currentQuestions: [],
  currentQuestionIndex: 0,
  score: 0,
  passed: false,
  gameActive: false,
  finished: false,
  selectedOption: null,
  showFeedback: false,
  isCorrect: false,
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
      currentQuestionIndex: 0,
      currentQuestions: [],
      finished: false,
      selectedOption: null,
      showFeedback: false,
      isCorrect: null,
    });
  },
  selectRandomQuestions: () => {
    const allQuestions = [...get().allQuestions];
    const randomQuestions: TriviaQuestion[] = [];

    // Select 5 random questions
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      const randomIndex = Math.floor(Math.random() * allQuestions.length);
      randomQuestions.push(allQuestions[randomIndex]);
      allQuestions.splice(randomIndex, 1);
    }

    set({ currentQuestions: randomQuestions });
  },
  nextQuestion: () => {
    const currentIndex = get().currentQuestionIndex;
    const nextIndex = currentIndex + 1;
    set({ currentQuestionIndex: nextIndex });
  },
  setSelectedOption: (optionIndex: number) => {
    console.log('🚀 ~ optionIndex:', optionIndex);
    const currentQuestion = triviaQuestions[optionIndex];
    console.log('🚀 ~ currentQuestion:', currentQuestion);

    set({
      selectedOption: optionIndex,
      isCorrect: optionIndex === currentQuestion.correctAnswer,
      showFeedback: true,
    });
  },
  setShowFeedback: (show: boolean) => set({ showFeedback: show }),
}));

export default useTriviaStore;
