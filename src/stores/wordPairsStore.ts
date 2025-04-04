import { create } from 'zustand';
import useEventStore from './eventStore';

const { setTrigger, setPassed: setPassedWordPairs, speedIncrease, speedDecrease } = useEventStore.getState();

// Swimming-related words for the game
// Correct spellings and their common mistakes
const correctWords = [
    'BACKSTROKE',
    'BUTTERFLY',
    'FREESTYLE',
    'BREASTSTROKE',
    'PULLOUT',
    'STREAMLINE',
    'KICKBOARD',
    'DOLPHIN',
    'PROPULSION',
    'BILATERAL',
    'ROTATION',
    'RECOVERY'
];

const incorrectWords = [
    'BACKSSTROKE',   // Common double-s mistake
    'BUTTERFLIE',    // Common ie/y confusion
    'FREESTILE',     // Style/stile confusion
    'BREATHSTROKE',  // Common confusion with 'breath'
    'PULL-OUT',      // Hyphenation difference
    'KICKBORD',      // Common misspelling
    'DOLFIN',        // Ph vs f confusion
    'PROPULTION',    // Missing 's'
    'BILATTERAL',    // Common double-t mistake
    'ROTASION',      // Common 't' vs 's' confusion
    'RECOVARY'       // Common a/e confusion
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
    leftWord: correctWords[0],  // Initialize with first word
    rightWord: correctWords[0],  // Initialize as a match
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

            // Show game result for 2 seconds, then reset and trigger next game
            setTimeout(() => {
                get().reset();
                get().generateNewPair();
                setTrigger(Math.floor(Math.random() * 1000) + 1000);
            }, 1000);
        }
    },

    reset: () => {
        // Generate a new pair first
        const correctWord = correctWords[Math.floor(Math.random() * correctWords.length)];

        set({
            started: false,
            finished: false,
            passed: false,
            score: 0,
            timeLeft: 25,
            leftWord: correctWord,
            rightWord: correctWord, // Start with a matching pair
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
        // First, decide if we want a matching pair (50% chance)
        const isMatch = Math.random() < 0.5;

        // Pick a random correct word
        const correctWord = correctWords[Math.floor(Math.random() * correctWords.length)];

        if (isMatch) {
            // For matches, use the same correct word twice
            set({ leftWord: correctWord, rightWord: correctWord });
        } else {
            // For non-matches, use a correct word and its corresponding incorrect version
            const correctIndex = correctWords.indexOf(correctWord);
            const incorrectWord = incorrectWords[correctIndex];

            // Randomly decide which side gets the correct word
            const leftFirst = Math.random() < 0.5;
            set({
                leftWord: leftFirst ? correctWord : incorrectWord,
                rightWord: leftFirst ? incorrectWord : correctWord
            });
        }
    },
}));

export default useWordPairsStore;
