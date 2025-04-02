import { useEffect, useState } from 'react';
import { GameType, eventGamesMap, CURRENT_EVENT } from '@/types/Game';
import { GameSlot } from './gameSlot';
import useEventStore from '@/stores/eventStore';

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
  const [lastGame, setLastGame] = useState<GameType | undefined>();

  const { trigger, started, finished } = useEventStore();

  const randomize = () => {
    const availableGames = eventGamesMap[CURRENT_EVENT];
    let randomGame;
    do {
      randomGame = availableGames[Math.floor(Math.random() * availableGames.length)] as GameType;
    } while (randomGame === lastGame);

    const randomSeed = Math.floor(Math.random() * 1000);
    setSeed(randomSeed);
    setCurrentGame(randomGame);
    setLastGame(randomGame);
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

  return (
    <div className="flex min-h-full w-[800px]">
      <GameSlot currentGame={currentGame} seed={seed} event={CURRENT_EVENT} />
    </div>
  );
}
