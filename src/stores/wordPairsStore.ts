import { create } from 'zustand';
import useEventStore from './eventStore';

const { setTrigger, setPassed: setPassedWordPairs, speedIncrease, speedDecrease } = useEventStore.getState();

// Swimming-related words for the game
// Similar word pairs to make the game more challenging
const words = [
    'FREESTYLE', 'FRONTCRAWL',   // Same stroke, different names
    'BUTTERFLY', 'FLYSTROKE',     // Similar names
    'BREASTSTROKE', 'BREASTROKE', // Common misspelling
    'MEDLEY', 'MELODY',           // Look similar
    'SPRINT', 'SPIRIT',           // One letter difference
    'DOLPHIN', 'DOLPHINE',        // Tricky ending
    'TRIATHLON', 'TETRATHLON',    // Similar concept
    'ENDURANCE', 'ENDURANSE',     // Common misspelling
    'TECHNIQUE', 'TECNIQUE'       // Missing 'h'
];

interface WordPairsState {
    started: boolean;
    finished: boolean;
    passed: boolean;
    score: number;
    timeLeft: number;
    leftWord: string;
    rightWord: string;
    gameTime: number;
    targetScore: number;
    lives: number;
    maxLives: number;


    // Actions
    start: () => void;
    finish: (passed?: boolean) => void;
    reset: () => void;
    setTimeLeft: (time: number) => void;
    handleAnswer: (isMatch: boolean) => void;
    generateNewPair: () => void;
}

const useWordPairsStore = create<WordPairsState>((set, get) => ({
    // State
    started: false,
    finished: false,
    passed: false,
    score: 0,
    timeLeft: 25,
    leftWord: '',
    rightWord: '',
    gameTime: 25,
    targetScore: 5,
    lives: 3,
    maxLives: 3,


    // Actions
    start: () => {
        const state = get();
        if (!state.started && !state.finished) {
            set({
                started: true,
                finished: false,
                passed: false,
                score: 0,
                timeLeft: state.gameTime,
                lives: state.maxLives,

            });
            get().generateNewPair();
        }
    },

    finish: (passed = false) => {
        const state = get();
        if (state.started && !state.finished) {
            set({ finished: true, passed });
            setPassedWordPairs(passed);
            if (passed) {
                speedIncrease();
            } else {
                speedDecrease();
            }
            setTimeout(() => {
                setTrigger(Math.floor(Math.random() * 1000) + 1000);
            }, 1000);
        }
    },

    reset: () => {
        setTrigger(Math.floor(Math.random() * 1000) + 1000);
        set({
            started: false,
            finished: false,
            passed: false,
            score: 0,
            timeLeft: 25,
            leftWord: '',
            rightWord: '',
            lives: 3,
        });
    },

    setTimeLeft: (time: number) => {
        const state = get();
        if (time <= 0) {
            set({ timeLeft: 0 });
            get().finish(state.score >= state.targetScore && state.lives > 0);
        } else {
            set({ timeLeft: time });
        }
    },

    handleAnswer: (isMatch: boolean) => {
        const state = get();
        if (!state.started || state.finished) return;

        const actualMatch = state.leftWord === state.rightWord;
        const correct = isMatch === actualMatch;

        if (correct) {
            // Update score and occasionally increase speed on correct answer
            const newScore = state.score + 1;
            set({ score: newScore });

            // Increase speed every 2 correct answers
            if (newScore % 2 === 0) {
                speedIncrease();
            }

            if (newScore >= state.targetScore) {
                get().finish(true);
                return;
            }
        } else {
            // Wrong answer loses a life and occasionally decreases speed
            const newLives = state.lives - 1;
            set({ lives: newLives });

            // Only decrease speed on first and second mistakes
            if (newLives >= 1) {
                speedDecrease();
            }

            // Game over if no lives left
            if (newLives <= 0) {
                get().finish(false);
                return;
            }
        }

        // Generate new pair for next round
        get().generateNewPair();
    },

    generateNewPair: () => {
        const word1 = words[Math.floor(Math.random() * words.length)];
        // 50% chance of matching pair
        const word2 = Math.random() < 0.5
            ? word1
            : words[Math.floor(Math.random() * words.length)];

        set({ leftWord: word1, rightWord: word2 });
    },
}));

export default useWordPairsStore;
