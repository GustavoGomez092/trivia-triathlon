import { GameType } from '@/types/Game';
import WhackAKey from './whackAKey';

export interface GameComponentProps {
  seed: number;
}

export interface GameSlotProps extends GameComponentProps {
  currentGame: GameType;
}

const gameComponentMap: Record<
  GameType,
  React.ComponentType<GameComponentProps> | undefined
> = {
  whackAKey: WhackAKey,
};

export function GameSlot({
  currentGame,
  ...otherProps
}: Readonly<GameSlotProps>): JSX.Element | null {
  const GameComponent = gameComponentMap[currentGame];
  if (GameComponent) {
    return <GameComponent key={otherProps.seed} {...otherProps} />;
  }

  console.error(`No component found for game: ${currentGame}`);
  return null;
}
