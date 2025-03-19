import useSprintStore from '@/stores/sprintStore';
import { useEffect, useState } from 'react';
import { games, GameType } from '@/types/Game';
import { GameSlot } from './gameSlot';
import { addScoreToGame } from '@/firebase/database/games';
import { useCurrentUser } from '@/firebase/hooks/useCurrentUser';

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
  const { user } = useCurrentUser();

  const { trigger, started, finished, finishTime, distanceTraveled, passed } =
    useSprintStore();

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

  useEffect(() => {
    if (currentGame && finished && user) {
      addScoreToGame(currentGame, user.email, {
        finishTime,
        distanceTraveled,
        passed,
      });
      // TODO We need to reset the game and randomize a new one
      // I see that this can be done by resetting the game, ideas in how to reset the game from here?
    }
  }, [finished, currentGame, finishTime, distanceTraveled, passed, user]);

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
