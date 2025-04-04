import { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useFindTheBallStore from '@/stores/findTheBallStore';
import useEventStore from '@/stores/eventStore';
import { cn } from '@/lib/utils';

const SHUFFLE_BASE_SPEED = 500; // Shuffle base speed in ms. Lower = faster shuffle.
const SHOW_BALL_DURATION = 1500; // Duration to show the ball before shuffling
const TIME_LIMIT = 5; // Time limit in seconds

const FindTheBall: FC = () => {
  const {
    ballPosition,
    finished,
    passed,
    gameActive,
    timeLeft,
    setGameActive,
    setTimeLeft,
    setPassed,
    reset,
    shuffleCups,
  } = useFindTheBallStore();

  const { speedIncrease, speedDecrease } = useEventStore();

  const [visualOrder, setVisualOrder] = useState([0, 1, 2]);
  const [selectedVisualIndex, setSelectedVisualIndex] = useState<number | null>(
    null,
  );
  const [showBall, setShowBall] = useState(true);
  const [shuffleSpeed, setShuffleSpeed] = useState(SHUFFLE_BASE_SPEED);
  const [isShuffling, setIsShuffling] = useState(true);
  const [disableCups, setDisableCups] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Start game and setup shuffle
  useEffect(() => {
    setGameActive(true);
    setTimeLeft(TIME_LIMIT);
    setSelectedVisualIndex(null);
    setShowBall(true);
    setIsShuffling(true);
    setDisableCups(false);
    shuffleCups();

    // Show ball for 2 seconds before shuffling
    const delayBeforeShuffle = setTimeout(() => {
      setShowBall(false);
      setDisableCups(true);

      let count = 0;
      const maxShuffles = 10;
      const interval = setInterval(() => {
        const newOrder = [...visualOrder];
        for (let i = newOrder.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
        }
        setVisualOrder(newOrder);
        count++;
        if (count >= maxShuffles) {
          clearInterval(interval);
          setIsShuffling(false);
        }
      }, shuffleSpeed);

      // Decrease shuffle duration to increase difficulty
      setShuffleSpeed((prev) => Math.max(200, prev - 50));
    }, SHOW_BALL_DURATION); // ← change delay here if you want ball to show longer or shorter

    return () => {
      clearTimeout(delayBeforeShuffle);
      setGameActive(false);
    };
  }, []);

  // Countdown after shuffle ends
  useEffect(() => {
    if (!gameActive || finished || isShuffling) return;

    const timer = setInterval(() => {
      if (timeLeft <= 1) {
        clearInterval(timer);
        handleCupClick(null); // No selection = fail
        setTimeLeft(0);
      } else {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameActive, finished, isShuffling]);

  // Show feedback message after a short delay
  useEffect(() => {
    if (!finished) return;

    const timer = setTimeout(() => {
      setShowFeedback(true);
    }, SHOW_BALL_DURATION); // ← show cups + ball for 2s, then show result

    return () => clearTimeout(timer);
  }, [finished]);

  // Auto-restart after showing feedback
  useEffect(() => {
    if (!showFeedback) return;

    const timer = setTimeout(() => {
      reset();
      setSelectedVisualIndex(null);
      setShowBall(true);
      setIsShuffling(true);
      setDisableCups(false);
      setShowFeedback(false);
      shuffleCups();
    }, 1000);

    return () => clearTimeout(timer);
  }, [showFeedback, reset]);

  const handleCupClick = (index: number | null) => {
    if (finished || index === null || isShuffling) {
      setPassed(false);
      speedDecrease();
      return;
    }

    setSelectedVisualIndex(index);

    const cupClicked = visualOrder[index];
    const correct = cupClicked === ballPosition;

    if (correct) {
      setPassed(true);
      speedIncrease();
    } else {
      setPassed(false);
      speedDecrease();
    }
  };

  // Display final result message
  if (finished && showFeedback) {
    return (
      <div className="nes-container is-rounded flex min-h-full w-full flex-col items-center justify-center bg-gray-200 p-8">
        <h1 className="mb-4 text-2xl font-bold">Find the ball</h1>
        <div className="flex flex-col items-center justify-center">
          <h1
            className={cn(
              'text-center text-4xl font-bold',
              passed ? 'text-green-500' : 'text-red-500',
            )}
          >
            {passed ? 'You passed!' : 'Better luck next time!'}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="nes-container is-rounded relative z-50 min-h-full w-full bg-gray-200 p-6">
      <h1 className="mb-4 text-center text-2xl font-bold">Find the ball</h1>

      <div className="mb-4 text-center">
        <span
          className={cn(
            'font-semibold',
            timeLeft <= 3 && 'text-red-500',
            isShuffling && 'opacity-0',
          )}
        >
          Time left: {timeLeft}s
        </span>
      </div>

      <motion.div layout className="relative flex justify-center gap-8">
        {visualOrder.map((cup, i) => {
          const isCorrect = cup === ballPosition;
          const isSelected = i === selectedVisualIndex;

          return (
            <motion.button
              key={cup}
              layout
              onClick={() => handleCupClick(i)}
              className={cn(
                'nes-btn clip-trapezoid relative flex !h-48 !w-40 flex-col items-center justify-center !border-x-0 !border-b-8 !border-t-0  !bg-red-800 text-xl transition-opacity duration-200 hover:!bg-red-900',
                finished && isCorrect && '!bg-green-700 hover:!bg-green-700',
                finished &&
                  isSelected &&
                  !isCorrect &&
                  '!bg-red-950 hover:!bg-red-950',
                isShuffling
                  ? 'pointer-events-none cursor-default'
                  : 'pointer-events-auto',
                disableCups && isShuffling && 'opacity-80',
              )}
            >
              {((showBall && isCorrect) || (finished && isCorrect)) && (
                <div className="50 absolute bottom-0.5 left-[calc(50%-20px)] h-10 w-10 rounded-full bg-white" />
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};

export default FindTheBall;
