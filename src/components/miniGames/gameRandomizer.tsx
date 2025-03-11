import useSprintStore from '@/stores/sprintStore';
import { useEffect, useState } from 'react';
import WhackAKey from './whackAKey';

export default function GameRandomizer() {
  const [currentGame, setCurrentGame] = useState<string>('');
  const [seed, setSeed] = useState<number>(0);
  const gamesArray = ['whackAKey'];
  const { trigger, started, finished } = useSprintStore();

  const randomize = () => {
    const randomGame =
      gamesArray[Math.floor(Math.random() * gamesArray.length)];
    const randomSeed = Math.floor(Math.random() * 1000);
    setSeed(randomSeed);
    setCurrentGame(randomGame);
  };

  const gameSlot = () => {
    switch (currentGame) {
      case 'whackAKey':
        return <WhackAKey key={seed} />;
      default:
        return <WhackAKey />;
    }
  };

  useEffect(() => {
    randomize();
  }, [trigger]);

  useEffect(() => {
    randomize();
  }, []);

  return (
    <>
      {!started ? (
        <div className="ready-set nes-container max-w-96 w-full bg-white text-center">
          <h1 className="text-3xl">Get Ready, Set..!</h1>
        </div>
      ) : finished ? (
        <div className="ready-set nes-container max-w-96 w-full bg-white text-center">
          <h1 className="text-3xl">Finished!</h1>
        </div>
      ) : (
        gameSlot()
      )}
    </>
  );
}
