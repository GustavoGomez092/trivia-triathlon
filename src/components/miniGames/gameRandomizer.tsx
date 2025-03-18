import useSprintStore from '@/stores/sprintStore';
import { useEffect, useState } from 'react';
import { games, GameType } from '@/types/Game';
import { GameSlot } from './gameSlot';

function StatusContainer({ message }: { message: string }) {
  return (
    <div className="ready-set nes-container max-w-96 w-full bg-white text-center">
      <h1 className="text-3xl">{message}</h1>
    </div>
  );
}

export default function GameRandomizer() {
  const [currentGame, setCurrentGame] = useState<GameType | undefined>();
  const [seed, setSeed] = useState<number>(0);

  const { trigger, started, finished } = useSprintStore();

  const randomize = () => {
    const randomGame = games[Math.floor(Math.random() * games.length)];
    const randomSeed = Math.floor(Math.random() * 1000);
    setSeed(randomSeed);
    setCurrentGame(randomGame);
  };

  useEffect(() => {
    randomize();
  }, [trigger]);

  useEffect(() => {
    randomize();
  }, []);

  if (!started) {
    return <StatusContainer message="Get Ready, Set..!" />;
  }

  if (finished) {
    return <StatusContainer message="Finished!" />;
  }

  if (!currentGame) {
    return <StatusContainer message="Loading game..." />;
  }

  return <GameSlot currentGame={currentGame} seed={seed} />;
}
