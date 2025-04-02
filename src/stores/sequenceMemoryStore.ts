import { create } from 'zustand';

interface SequenceMemoryState {
    sequence: string[];
    playerSequence: string[];
    isShowingSequence: boolean;
    gameActive: boolean;
    finished: boolean;
    passed: boolean;
    level: number;
    targetLevel: number;
    lives: number;
    start: () => void;
    addToPlayerSequence: (color: string) => void;
    showSequence: () => void;
    setPassed: (value: boolean) => void;
    finish: () => void;
}

const COLORS = ['red', 'blue', 'green', 'yellow'];
const TARGET_LEVEL = 3;
const INITIAL_SEQUENCE_LENGTH = 3;
const MAX_LIVES = 3;

const generateSequence = (length: number): string[] => {
    const sequence: string[] = [];
    let lastColor = '';

    for (let i = 0; i < length; i++) {
        const availableColors = COLORS.filter(c => c !== lastColor);
        const randomIndex = Math.floor(Math.random() * availableColors.length);
        const newColor = availableColors[randomIndex];

        sequence.push(newColor);
        lastColor = newColor;
    }

    return sequence;
};

const useSequenceMemoryStore = create<SequenceMemoryState>((set) => ({
    // Initial state
    sequence: [],
    playerSequence: [],
    isShowingSequence: false,
    gameActive: false,
    finished: false,
    passed: false,
    level: 1,
    targetLevel: TARGET_LEVEL,
    lives: MAX_LIVES,

    // Actions
    start: () => {
        const sequence = generateSequence(INITIAL_SEQUENCE_LENGTH);
        set({
            sequence,
            playerSequence: [],
            isShowingSequence: true,
            gameActive: true,
            finished: false,
            passed: false,
            level: 1,
            lives: MAX_LIVES,
        });
    },

    addToPlayerSequence: (color: string) => {
        set(state => {
            const newPlayerSequence = [...state.playerSequence, color];

            // Wrong color selected
            if (color !== state.sequence[state.playerSequence.length]) {
                const newLives = state.lives - 1;

                // Game over if no lives left
                if (newLives <= 0) {
                    set({ finished: true, passed: false });
                    return {
                        playerSequence: newPlayerSequence,
                        gameActive: false,
                        lives: 0,
                    };
                }

                // Try again with same length
                setTimeout(() => {
                    const sequence = generateSequence(state.sequence.length);
                    set({
                        sequence,
                        playerSequence: [],
                        isShowingSequence: true,
                        gameActive: true,
                        finished: false,
                        passed: false,
                        level: state.level,
                        lives: newLives,
                    });
                }, 1000);

                return {
                    playerSequence: newPlayerSequence,
                    gameActive: false,
                    lives: newLives,
                };
            }

            // Sequence completed
            if (newPlayerSequence.length === state.sequence.length) {
                // Game completed
                if (state.level === TARGET_LEVEL) {
                    set({ passed: true });
                    set({ finished: true });
                    return {
                        playerSequence: newPlayerSequence,
                        gameActive: false,
                    };
                }

                // Level up
                const newLength = state.sequence.length + 2;
                const newSequence = generateSequence(newLength);
                return {
                    sequence: newSequence,
                    playerSequence: [],
                    isShowingSequence: true,
                    level: state.level + 1,
                };
            }

            // Continue sequence
            return { playerSequence: newPlayerSequence };
        });
    },

    showSequence: () => {
        set({ isShowingSequence: false });
    },

    setPassed: (value: boolean) => {
        set({ passed: value, finished: true });
    },

    finish: () => {
        set({ finished: true });
    },
}));

export default useSequenceMemoryStore;