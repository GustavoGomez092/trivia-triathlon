import { create } from 'zustand';
import useEventStore from './eventStore';

const { setTrigger, setPassed: setPassedColorMatch, speedIncrease } = useEventStore.getState();

export type ColorType = 'RED' | 'BLUE' | 'GREEN' | 'YELLOW';

export interface ColorWord {
    word: ColorType;
    color: ColorType;
}

interface ColorMatchState {
    started: boolean;
    finished: boolean;
    passed: boolean;
    timeLeft: number;
    combo: number;
    correctMatches: number;
    currentWord: ColorWord | null;
    lastResponseTime: number;
    processingKeyPress: boolean; // Add this to track if we're processing a keypress

    targetMatches: number;
    gameTime: number;

    start: () => void;
    finish: (passed?: boolean) => void;
    reset: () => void;
    setPassed: (passed: boolean) => void;
    setTimeLeft: (time: number) => void;
    generateNewWord: () => void;
    handleKeyPress: (key: string) => void;
}

const COLORS: ColorType[] = ['RED', 'BLUE', 'GREEN', 'YELLOW'];
const ARROW_MAP: Record<string, ColorType> = {
    'ArrowLeft': 'RED',
    'ArrowUp': 'BLUE',
    'ArrowRight': 'GREEN',
    'ArrowDown': 'YELLOW'
};

const useColorMatchStore = create<ColorMatchState>((set, get) => ({
    started: false,
    finished: false,
    passed: false,
    timeLeft: 30,
    combo: 0,
    mistakes: 0,
    correctMatches: 0,
    currentWord: null,
    lastResponseTime: 0,
    processingKeyPress: false,

    targetMatches: 15,

    gameTime: 30,

    start: () => {
        const state = get();
        if (!state.started && !state.finished) {
            set({
                started: true,
                finished: false,
                passed: false,
                timeLeft: state.gameTime,
                combo: 0,
                correctMatches: 0,
                currentWord: null,
                lastResponseTime: Date.now(),
                processingKeyPress: false
            });
            get().generateNewWord();
        }
    },

    finish: (passed: boolean = false) => {
        const state = get();
        if (state.started && !state.finished) {
            set({ finished: true, passed });
            setPassedColorMatch(passed);
            // Show game over screen for 1 seconds
            setTimeout(() => {
                setTrigger(Math.floor(Math.random() * 1000) + 1000);
            }, 1000);
        }
    },

    reset: () => {
        // Only reset the game state without triggering a new game
        const state = get();
        set({
            started: false,
            finished: false,
            passed: false,
            timeLeft: state.gameTime,
            combo: 0,
            correctMatches: 0,
            // Don't clear the current word on reset to keep it visible on game over screen
            lastResponseTime: Date.now(),
            processingKeyPress: false
        });
    },

    setPassed: (passed) => {
        set({ passed });
        setPassedColorMatch(passed);
    },

    setTimeLeft: (time) => set({ timeLeft: time }),

    generateNewWord: () => {
        const word = COLORS[Math.floor(Math.random() * COLORS.length)];
        let color;
        do {
            color = COLORS[Math.floor(Math.random() * COLORS.length)];
        } while (color === word); // Ensure word and color are different

        set({
            currentWord: { word, color },
            lastResponseTime: Date.now()
        });
    },

    handleKeyPress: (key) => {
        const state = get();
        if (!state.started || state.finished || !state.currentWord || state.processingKeyPress) return;

        // Set processing flag to prevent rapid keypresses
        set({ processingKeyPress: true });

        const expectedColor = state.currentWord.color;
        const pressedColor = ARROW_MAP[key];

        if (!pressedColor) {
            set({ processingKeyPress: false });
            return; // Invalid key
        }

        const responseTime = (Date.now() - state.lastResponseTime) / 1000;
        let pointsEarned = 100;

        if (pressedColor === expectedColor) {
            // Add speed bonus
            if (responseTime < 0.5) pointsEarned += 50;
            else if (responseTime < 1) pointsEarned += 25;
            else if (responseTime < 1.5) pointsEarned += 10;

            // Add combo multiplier
            const newCombo = state.combo + 1;
            if (newCombo >= 5) pointsEarned *= 2;
            else if (newCombo >= 3) pointsEarned *= 1.5;

            set({
                combo: newCombo,
                correctMatches: state.correctMatches + 1
            });

            if (state.correctMatches + 1 >= state.targetMatches) {
                // Call finish instead of manually setting state to ensure proper game transition
                set({ processingKeyPress: false });
                speedIncrease();
                // Use finish function to handle game completion and trigger next game
                get().finish(true);
                return;
            }
        } else {
            // Apply 2 second penalty for mistakes
            set({
                combo: 0,
                timeLeft: Math.max(1, state.timeLeft - 2) // Ensure time doesn't go below 1 second
            });
        }

        state.generateNewWord();

        // Release the processing flag after a short delay
        setTimeout(() => {
            set({ processingKeyPress: false });
        }, 150); // 150ms delay between keypresses to prevent too-rapid inputs
    }
}));

export default useColorMatchStore;
