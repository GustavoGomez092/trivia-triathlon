import { create } from 'zustand';
import useEventStore from './eventStore';

const { setTrigger, setPassed: setPassedWordPairs, speedIncrease, speedDecrease } = useEventStore.getState();

// Swimming-related words for the game
// Similar word pairs to make the game more challenging
const words = [
    'BACKSTROKE', 'BACKSSTROKE',  // Common double-s mistake
    'BUTTERFLY', 'BUTTERFLIE',    // Common ie/y confusion
    'FREESTYLE', 'FREESTILE',     // Style/stile confusion
    'BREASTSTROKE', 'BREATHSTROKE', // Common confusion with 'breath'
    'PULLOUT', 'PULL-OUT',        // Hyphenation difference
    'STREAMLINE', 'STREAMLINED',  // Base vs modified form
    'KICKBOARD', 'KICKBORD',      // Common misspelling
    'DOLPHIN', 'DOLFIN',          // Ph vs f confusion
    'PROPULSION', 'PROPULTION',   // Missing 's'
    'BILATERAL', 'BILATTERAL',    // Common double-t mistake
    'ROTATION', 'ROTASION',       // Common 't' vs 's' confusion
    'RECOVERY', 'RECOVARY'        // Common a/e confusion
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

            // If passed with all 3 lives, increase speed twice
            if (passed && state.lives === 3) {
                speedIncrease();
                speedIncrease();
            }
            // If passed with some lives lost, increase speed once
            else if (passed) {
                speedIncrease();
            }
            // If failed, decrease speed
            else {
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
            // Update score on correct answer
            const newScore = state.score + 1;
            set({ score: newScore });

            if (newScore >= state.targetScore) {
                get().finish(true);
                return;
            }
        } else {
            // Wrong answer loses a life
            const newLives = state.lives - 1;
            set({ lives: newLives });

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
