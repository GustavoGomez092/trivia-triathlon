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

    targetMatches: 15,

    gameTime: 30,

    start: () => {
        set({
            started: true,
            timeLeft: 30,
            combo: 0,
            correctMatches: 0,
            currentWord: null,
            lastResponseTime: Date.now()
        });
        get().generateNewWord();
    },

    finish: (passed: boolean = false) => {
        set({ finished: true, passed });
        setPassedColorMatch(passed);
    },

    reset: () => {
        setTrigger(Math.floor(Math.random() * 1000) + 1000);
        set({
            started: false,
            finished: false,
            passed: false,
            timeLeft: 30,
            combo: 0,
            correctMatches: 0,
            currentWord: null
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
        if (!state.started || state.finished || !state.currentWord) return;

        const expectedColor = state.currentWord.color;
        const pressedColor = ARROW_MAP[key];

        if (!pressedColor) return; // Invalid key

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
                set({ finished: true, passed: true });
                setPassedColorMatch(true);
                speedIncrease();
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
    }
}));

export default useColorMatchStore;
