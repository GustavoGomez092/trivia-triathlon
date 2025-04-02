import { useEffect, FC, useState } from 'react';
import usePatternRecognitionStore from '@/stores/patternRecognitionStore';
import useEventStore from '@/stores/eventStore';

const PatternRecognition: FC = () => {
  const {
    userPattern,
    targetPattern,
    gameActive,
    finished,
    passed,
    showFeedback,
    setGameActive,
    generateNewPattern,
    toggleCell,
    checkPattern,
    reset,
    setPassed,
  } = usePatternRecognitionStore();

  const { speedIncrease, speedDecrease } = useEventStore();
  const [timeLeft, setTimeLeft] = useState(10);

  // Iniciar juego y generar patrón cuando el componente se monta
  useEffect(() => {
    setGameActive(true);
    generateNewPattern();
    setTimeLeft(10);

    return () => {
      setGameActive(false);
    };
  }, [setGameActive, generateNewPattern]);

  // Timer effect
  useEffect(() => {
    if (!gameActive || finished || showFeedback) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          speedDecrease();
          setPassed(false);
          checkPattern();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [
    gameActive,
    finished,
    showFeedback,
    speedDecrease,
    setPassed,
    checkPattern,
  ]);

  // Cuando el juego termina, reiniciar después de 1 segundo
  useEffect(() => {
    if (finished) {
      if (passed) {
        speedIncrease();
      } else {
        speedDecrease();
      }
      setPassed(passed);

      setTimeout(() => {
        reset();
        generateNewPattern();
        setTimeLeft(10);
      }, 1000);
    }
  }, [
    finished,
    passed,
    reset,
    generateNewPattern,
    speedIncrease,
    speedDecrease,
    setPassed,
  ]);

  const handleCellClick = (index: number) => {
    console.log('🚀 ~ handleCellClick ~ index:', index);
    if (!gameActive || showFeedback) return;
    toggleCell(index);
  };

  const handleCheck = () => {
    if (!gameActive || showFeedback) return;
    checkPattern();
  };

  if (finished && passed) {
    return (
      <div className="nes-container is-rounded flex min-h-full w-full flex-col items-center justify-center bg-gray-200 p-8">
        <h1 className="mb-4 text-2xl font-bold">Pattern Recognition</h1>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-center text-4xl font-bold text-green-500">
            You passed!
          </h1>
        </div>
      </div>
    );
  }

  if (finished && !passed) {
    return (
      <div className="nes-container is-rounded flex min-h-full w-full flex-col items-center justify-center bg-gray-200 p-8">
        <h1 className="mb-4 text-2xl font-bold">Pattern Recognition</h1>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-center text-4xl font-bold text-red-500">
            Better luck next time!
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="nes-container is-rounded relative z-50 min-h-full w-full overflow-hidden bg-gray-200">
      <div className="relative flex min-h-full w-full flex-col justify-between gap-6 px-4 text-center">
        {/* Título, puntuación y temporizador */}
        <div className="flex items-center justify-center">
          <div className="text-nowrap text-2xl font-bold">
            Pattern Recognition
          </div>
        </div>

        <div className="z-50 grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-nowrap font-semibold">Your pattern</h3>
            <div className="grid grid-cols-5 gap-2 rounded bg-gray-300 p-2">
              {userPattern.map((isActive, index) => (
                <button
                  key={`user-${index}`}
                  type="button"
                  onClick={() => handleCellClick(index)}
                  className={`nes-btn pointer-events-auto !h-[2rem] !w-[2rem] p-0 ${
                    isActive ? 'is-success' : 'is-warning'
                  } ${showFeedback ? 'opacity-50' : 'hover:opacity-80'}`}
                  disabled={showFeedback}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <h3 className="text-nowrap font-semibold">Target pattern</h3>
            <div className="grid grid-cols-5 gap-2 rounded bg-gray-300 p-2">
              {targetPattern.map((isActive, index) => (
                <button
                  key={`target-${index}`}
                  type="button"
                  className={`nes-btn !h-[2rem] !w-[2rem] p-0 ${
                    isActive ? 'is-success' : 'is-warning'
                  }`}
                  disabled
                />
              ))}
            </div>
          </div>

          <div className="flex min-h-full flex-col items-center justify-between gap-2 pb-10">
            <div className="text-lg">Time left: {timeLeft}s</div>
            <button
              type="button"
              onClick={handleCheck}
              className="nes-btn is-primary pointer-events-auto mx-auto w-auto hover:opacity-80"
              disabled={showFeedback}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternRecognition;
