import { FC, useEffect, useState } from 'react';
import useDontClickTheBombStore from '@/stores/dontClickTheBombStore';
import useEventStore from '@/stores/eventStore';
import { cn } from '@/lib/utils';

const TIME_LIMIT = 6; // seconds

const DontClickTheBomb: FC = () => {
  const {
    items,
    selected,
    finished,
    passed,
    setPassed,
    reset,
    selectItem,
    generateItems,
  } = useDontClickTheBombStore();

  const { speedIncrease, speedDecrease } = useEventStore();
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    generateItems();
    setTimeLeft(TIME_LIMIT);
  }, [generateItems]);

  useEffect(() => {
    if (finished) {
      const timer = setTimeout(() => {
        setShowFeedback(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [finished]);

  useEffect(() => {
    if (!finished) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setPassed(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [finished, setPassed]);

  useEffect(() => {
    if (!finished) return;
    const timer = setTimeout(() => {
      if (passed) speedIncrease();
      else speedDecrease();
      reset();
      setShowFeedback(false);
      setTimeLeft(TIME_LIMIT);
    }, 2000);
    return () => clearTimeout(timer);
  }, [finished, passed, reset, speedIncrease, speedDecrease]);

  if (finished && showFeedback) {
    return (
      <div className="nes-container is-rounded flex min-h-full w-full flex-col items-center justify-center bg-gray-200 p-8">
        <h1 className="mb-4 text-2xl font-bold">Don't Click the Bomb</h1>
        <h1
          className={cn(
            'text-center text-4xl font-bold',
            passed ? 'text-green-500' : 'text-red-500',
          )}
        >
          {passed ? 'You passed!' : 'Boom! You hit a bomb!'}
        </h1>
      </div>
    );
  }

  return (
    <div className="nes-container is-rounded relative z-50 min-h-full w-full bg-gray-200 p-6">
      <h1 className="mb-4 text-center text-2xl font-bold">
        Don't Click the Bomb
      </h1>

      <div className="mb-4 text-center">
        <span className={cn('font-semibold', timeLeft <= 1 && 'text-red-500')}>
          Time left: {timeLeft}s
        </span>
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-4 gap-4">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => selectItem(idx)}
              className={cn(
                'nes-btn pointer-events-auto flex h-20 w-20 items-center justify-center text-2xl',
                selected.includes(idx) && item === '💣' && 'is-error',
                selected.includes(idx) && item !== '💣' && 'is-success',
                finished && !selected.includes(idx) && '!opacity-50',
              )}
              disabled={finished}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DontClickTheBomb;
