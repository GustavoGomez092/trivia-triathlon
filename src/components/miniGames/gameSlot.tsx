import { GameType } from '@/types/Game';
import WhackAKey from './whackAKey';
import TargetShooting from './targetShooting';
import TriviaGame from './triviaGame';

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
  targetShooting: TargetShooting,
  triviaGame: TriviaGame,
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
