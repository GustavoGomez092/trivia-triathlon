import React, { useEffect, FC } from 'react';
import useEventStore from '@/stores/eventStore';
import useIconMemoryStore, { IconName } from '@/stores/iconMemoryStore';
import { cn } from '@/lib/utils';
import {
  Home,
  User,
  Settings,
  Bell,
  Star,
  Heart,
  Moon,
  Sun,
  Wind,
  CloudLightning,
  Umbrella,
  Coffee,
  Pizza,
  IceCream,
  Cake,
  Cookie,
  Apple,
  Banana,
  Grape,
  Carrot,
} from 'lucide-react';

const iconMap: Record<IconName, React.ElementType> = {
  home: Home,
  user: User,
  settings: Settings,
  bell: Bell,
  star: Star,
  heart: Heart,
  moon: Moon,
  sun: Sun,
  wind: Wind,
  'cloud-lightning': CloudLightning,
  umbrella: Umbrella,
  coffee: Coffee,
  pizza: Pizza,
  'ice-cream': IceCream,
  cake: Cake,
  cookie: Cookie,
  apple: Apple,
  banana: Banana,
  grape: Grape,
  carrot: Carrot,
};

const IconMemory: FC = () => {
  const { speedIncrease, speedDecrease } = useEventStore();
  const {
    cards,
    gameActive,
    finished,
    passed,
    timeLeft,
    setTimeLeft,
    setFinished,
    setPassed,
    initializeGame,
    handleCardClick,
    reset,
  } = useIconMemoryStore();

  // Initialize game
  useEffect(() => {
    initializeGame();

    return () => {
      reset();
    };
  }, [initializeGame, reset]);

  // Check if game is complete
  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isMatched)) {
      setFinished(true);
      setPassed(true);
      speedIncrease();

      setTimeout(() => {
        reset();
        initializeGame();
      }, 1000);
    }
  }, [cards, speedIncrease, setFinished, setPassed, reset, initializeGame]);

  // Timer
  useEffect(() => {
    if (!gameActive || finished) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          clearInterval(timerId);
          speedDecrease();
          setPassed(false);
          setFinished(true);

          setTimeout(() => {
            reset();
            initializeGame();
          }, 1000);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [
    gameActive,
    finished,
    speedDecrease,
    setTimeLeft,
    setPassed,
    setFinished,
    reset,
    initializeGame,
  ]);

  if (finished && passed) {
    return (
      <div className="nes-container is-rounded flex min-h-full w-full flex-col items-center justify-center bg-gray-200 p-8">
        <h1 className="mb-4 text-2xl font-bold">Icon Memory</h1>
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
        <h1 className="mb-4 text-2xl font-bold">Icon Memory</h1>
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
      <div className="relative flex min-h-full w-full flex-col justify-evenly gap-6 px-4 text-center">
        <div className="flex items-center justify-center">
          <div className="text-nowrap text-2xl font-bold">Icon Memory</div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <p className="font-semibold">
            Time left:{' '}
            <span className={cn(timeLeft <= 5 && 'text-red-500')}>
              {timeLeft}s
            </span>
          </p>
          <div className={`grid grid-cols-6 gap-2`}>
            {cards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => handleCardClick(card.id)}
                className={cn(
                  'nes-btn pointer-events-auto !h-[4rem] !w-[4rem] p-0 transition-all duration-300',
                  {
                    'is-warning': !card.isFlipped && !card.isMatched,
                    'is-success': card.isMatched && card.isFlipped,
                    'is-primary hover:opacity-80':
                      card.isFlipped && !card.isMatched,
                  },
                )}
                disabled={card.isFlipped || card.isMatched}
              >
                {(card.isFlipped || card.isMatched) && (
                  <div className="flex items-center justify-center">
                    {React.createElement(
                      iconMap[card.icon as keyof typeof iconMap],
                      { size: 32 },
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconMemory;
