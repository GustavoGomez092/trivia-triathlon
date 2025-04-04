import { FC, useEffect, useState, useRef } from 'react';
import useQuickMathReflexStore from '@/stores/quickMathReflexStore';
import { cn } from '@/lib/utils';

const TIME_LIMIT = 5;
const MAX_LIVES = 3;

const QuickMathReflex: FC = () => {
  const {
    expression,
    finished,
    generateExpression,
    level,
    lives,
    passed,
    reset,
    targetLevel,
    validateAnswer,
  } = useQuickMathReflexStore();

  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [showFeedback, setShowFeedback] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    generateExpression();
    setTimeLeft(TIME_LIMIT);
  }, [generateExpression]);

  useEffect(() => {
    if (!finished && !showFeedback) {
      setTimeLeft(TIME_LIMIT);
    }
  }, [expression, finished, showFeedback]);

  useEffect(() => {
    if (finished || showFeedback) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          validateAnswer(null);
          return TIME_LIMIT;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [finished, showFeedback, expression, validateAnswer]);

  useEffect(() => {
    if (!finished) return;
    const timer = setTimeout(() => setShowFeedback(true), 1000);
    return () => clearTimeout(timer);
  }, [finished]);

  useEffect(() => {
    if (!showFeedback) return;
    const timer = setTimeout(() => {
      reset();
      setShowFeedback(false);
      setTimeLeft(TIME_LIMIT);
    }, 2000);
    return () => clearTimeout(timer);
  }, [showFeedback, reset]);

  if (finished && showFeedback) {
    return (
      <div className="nes-container is-rounded flex min-h-full w-full flex-col items-center justify-center bg-gray-200 p-8">
        <h1 className="mb-4 text-2xl font-bold">Quick Math Reflex</h1>
        <h1
          className={cn(
            'text-center text-4xl font-bold',
            passed ? 'text-green-500' : 'text-red-500',
          )}
        >
          {passed ? 'You passed!' : 'Better luck next time!'}
        </h1>
      </div>
    );
  }

  return (
    <div className="nes-container is-rounded relative z-50 min-h-full w-full bg-gray-200 p-6">
      <div className="relative flex min-h-full w-full flex-col gap-1 p-2">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            {[...Array(MAX_LIVES)].map((_, i) => (
              <i
                key={i}
                className={`nes-icon heart ${i < lives ? '' : 'is-empty'}`}
                style={{
                  transform: 'scale(2)',
                  transformOrigin: 'center',
                  marginTop: '4px',
                }}
              />
            ))}
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600">Level:</span>
              <span className="text-lg font-bold text-blue-500">
                {Math.min(level, targetLevel)}/{targetLevel}
              </span>
            </div>
            <div className="flex min-h-[24px] items-center gap-1">
              <span className="text-sm text-gray-600">Time:</span>
              <span
                className={`text-lg font-bold ${
                  timeLeft <= 1 ? 'text-red-500' : 'text-blue-500'
                }`}
              >
                {timeLeft}s
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <h2 className="mb-4 text-3xl font-bold">{expression}</h2>
          <div className="flex justify-center gap-6">
            <button
              onClick={() => validateAnswer(true)}
              className="nes-btn is-success pointer-events-auto px-6 py-2 text-lg"
            >
              Correct
            </button>
            <button
              onClick={() => validateAnswer(false)}
              className="nes-btn is-error pointer-events-auto px-6 py-2 text-lg"
            >
              Incorrect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickMathReflex;
