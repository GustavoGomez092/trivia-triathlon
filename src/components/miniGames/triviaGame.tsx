import { useEffect, useState, FC } from 'react';
import useTriviaStore from '@/stores/triviaStore';
import useSprintStore from '@/stores/sprintStore';

const TriviaGame: FC = () => {
  const {
    currentQuestion,
    passed,
    gameActive,
    finished,
    isCorrect,
    showFeedback,
    selectedOption,
    finish,
    reset,
    setPassed,
    setGameActive,
    selectRandomQuestions,
    setSelectedOption,
  } = useTriviaStore();

  const { speedIncrease, speedDecrease } = useSprintStore();

  // Timer state (in seconds)
  const [timeLeft, setTimeLeft] = useState(10);

  // Start game and load questions when component mounts
  useEffect(() => {
    setGameActive(true);
    selectRandomQuestions();

    return () => {
      setGameActive(false);
    };
  }, [selectRandomQuestions, setGameActive]);

  // When an answer is submitted, adjust speed accordingly.
  useEffect(() => {
    if (isCorrect === null) return;

    if (isCorrect) {
      speedIncrease();
      setPassed(true);
    } else {
      speedDecrease();
      setPassed(false);
    }
  }, [isCorrect, speedIncrease, speedDecrease, setPassed]);

  // When the game finishes, reset after 1 second.
  useEffect(() => {
    if (finished) {
      setTimeout(() => {
        reset();
      }, 1000);
    }
  }, [finished, reset]);

  // Timer effect: reset timer on each new question.
  useEffect(() => {
    // Only run timer if game is active, a question exists, and game isn't finished.
    if (!gameActive || finished || currentQuestion === null) return;

    // Reset timer for this question.
    setTimeLeft(10);

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          // Time expired: mark as incorrect, decrease speed, and finish the current question.
          speedDecrease();
          setPassed(false);
          finish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [gameActive, finished, currentQuestion, setPassed, finish, speedDecrease]);

  const handleOptionSelect = (optionIndex: number) => {
    if (!gameActive) return;

    setSelectedOption(optionIndex);
    finish();
  };

  if (finished && passed) {
    return (
      <div className="nes-container is-rounded flex min-h-full w-full flex-col items-center justify-center bg-gray-200 p-8">
        <h1 className="mb-4 text-2xl font-bold">Trivia Challenge</h1>
        <div className="flex flex-col items-center justify-center bg-gray-200 lg:flex-row">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-center text-4xl font-bold text-green-500">
              You passed!
            </h1>
          </div>
        </div>
      </div>
    );
  }

  if (finished && !passed) {
    return (
      <div className="nes-container is-rounded flex min-h-full w-full flex-col items-center justify-center bg-gray-200 p-8">
        <h1 className="mb-4 text-2xl font-bold">Trivia Challenge</h1>
        <div className="flex flex-col items-center justify-center bg-gray-200 lg:flex-row">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-center text-4xl font-bold text-red-500">
              Better luck next time!
            </h1>
          </div>
        </div>
      </div>
    );
  }

  if (currentQuestion === null) {
    return (
      <div className="nes-container is-rounded flex min-h-full w-full flex-col items-center justify-center bg-gray-200 p-8">
        <h1 className="mb-4 text-2xl font-bold">Trivia Challenge</h1>
        <div className="flex flex-col items-center justify-center bg-gray-200 lg:flex-row">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-center text-4xl font-bold ">
              Loading questions
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nes-container is-rounded relative z-50 min-h-full w-full overflow-hidden bg-gray-200">
      {/* Vertical Layout */}
      <div className="relative flex min-h-full w-full flex-col justify-between gap-3 px-4 text-center">
        {/* Game title and timer */}
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">Trivia Challenge</div>
          <div className="font-mono text-xl">Time left: {timeLeft}s</div>
        </div>

        {/* Question */}
        <div className="flex w-full items-center justify-center rounded-lg bg-white px-4 py-2 shadow-md">
          <h2 className="!mb-0 font-semibold">{currentQuestion.question}</h2>
        </div>

        {/* Options */}
        <div className="grid w-full gap-x-4 gap-y-2 md:grid-cols-2">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              type="button"
              className={`nes-btn pointer-events-auto ${
                showFeedback && selectedOption === index
                  ? isCorrect
                    ? 'is-success'
                    : 'is-error'
                  : ''
              } w-full p-4 text-left ${
                selectedOption === index ? 'is-primary' : ''
              }`}
              onClick={() => handleOptionSelect(index)}
              disabled={showFeedback}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TriviaGame;
