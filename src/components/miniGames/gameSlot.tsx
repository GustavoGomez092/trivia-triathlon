import { GameType } from '@/types/Game';
import WhackAKey from './whackAKey';

interface GameSlotProps {
  currentGame: GameType;
  seed: number;
}

const gameComponentMap: Record<GameType, React.ComponentType | undefined> = {
  whackAKey: WhackAKey,
};

export function GameSlot({
  currentGame,
  seed,
}: Readonly<GameSlotProps>): JSX.Element | null {
  const GameComponent = gameComponentMap[currentGame];

  if (GameComponent) {
    return <GameComponent key={seed} />;
  }

  console.error(`No component found for game: ${currentGame}`);
  return null;
}
