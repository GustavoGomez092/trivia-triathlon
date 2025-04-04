import { create } from 'zustand';
import useEventStore from './eventStore';

const {
  setTrigger,
  setPassed: setPassedGlobal,
  speedIncrease,
  speedDecrease,
} = useEventStore.getState();

interface QuickMathReflexState {
  levelLabel?: string;
  expression: string;
  isCorrect: boolean;
  finished: boolean;
  passed: boolean;
  level: number;
  targetLevel: number;
  lives: number;
  generateExpression: () => void;
  validateAnswer: (answer: boolean | null) => void;
  reset: () => void;
  setFinished: () => void;
}

const generateRandomExpression = (
  level: number,
): { expr: string; correct: boolean } => {
  let expectedResult: number;
  const useMult = level >= 2;
  const useDiv = level >= 3;
  const ops = ['+', '-']
    .concat(useMult ? ['*'] : [])
    .concat(useDiv ? ['/'] : []);

  const getOperand = () => Math.floor(Math.random() * 20 + 1); // 1–20
  const getRandomOp = () => ops[Math.floor(Math.random() * ops.length)];

  const parts: (number | string)[] = [];
  const steps = level < 3 ? 1 : 2;

  for (let i = 0; i <= steps; i++) {
    parts.push(getOperand());
    if (i < steps) parts.push(getRandomOp());
  }

  const expressionStr = parts.join(' ');
  let result: number;
  let correct = true;

  try {
    expectedResult = Math.round(eval(expressionStr));
    console.log('[QuickMath] Evaluated:', expressionStr, '=', expectedResult);
    result = expectedResult;

    if (!isFinite(result)) {
      console.error('[QuickMath] Invalid result from:', expressionStr);
      throw new Error('Invalid result');
    }

    if (!Number.isInteger(result)) {
      console.warn('[QuickMath] Skipping non-integer result:', expressionStr);
      return generateRandomExpression(level);
    }

    if (result > 100) {
      console.warn('[QuickMath] Skipping result > 100:', expressionStr);
      return generateRandomExpression(level);
    }

    // Introduce incorrect answer 40% of the time
    if (Math.random() < 0.4) {
      const tweak = Math.random() < 0.5 ? 1 : -1;
      const newResult = result + tweak;
      if (
        Math.abs(newResult) <= 100 &&
        Number.isInteger(newResult) &&
        newResult !== expectedResult
      ) {
        result = newResult;
        correct = false;
      }
    }

    return {
      expr: `${expressionStr} = ${result}`,
      correct,
    };
  } catch {
    console.warn(
      '[QuickMath] Fallback triggered for expression:',
      expressionStr,
    );
    return {
      expr: '10 + 5 = 15',
      correct: true,
    };
  }
};

const useQuickMathReflexStore = create<QuickMathReflexState>((set, get) => ({
  expression: '',
  isCorrect: true,
  finished: false,
  passed: false,
  level: 1,
  targetLevel: 3,
  lives: 3,

  generateExpression: () => {
    const { level } = get();
    const { expr, correct } = generateRandomExpression(level);
    const levelLabel = level === 1 ? 'Easy' : level === 2 ? 'Medium' : 'Hard';
    set({ expression: expr, isCorrect: correct, levelLabel });
  },

  validateAnswer: (answer: boolean | null) => {
    const { isCorrect, level, targetLevel, lives } = get();

    const passed = answer !== null && answer === isCorrect;
    const newLives = passed ? lives : lives - 1;
    const nextLevel = passed ? level + 1 : level;

    const hasWon = passed && nextLevel > targetLevel;
    const outOfLives = newLives <= 0;

    if (hasWon || outOfLives) {
      if (hasWon) speedIncrease();
      else if (outOfLives) speedDecrease();

      set({
        finished: true,
        passed: hasWon,
        lives: newLives,
        level: nextLevel,
      });

      setPassedGlobal(hasWon);
      return;
    }

    set({
      lives: newLives,
      level: nextLevel,
    });
    get().generateExpression();
  },

  reset: () => {
    setTrigger(Math.floor(Math.random() * 1000) + 1000);
    const { expr, correct } = generateRandomExpression(1);
    set({
      expression: expr,
      levelLabel: 'Easy',
      isCorrect: correct,
      finished: false,
      passed: false,
      level: 1,
      targetLevel: 3,
      lives: 3,
    });
  },

  setFinished: () => {
    set({ finished: true });
  },
}));

export default useQuickMathReflexStore;
