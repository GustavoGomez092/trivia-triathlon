import { GameType, EventType } from '@/types/Game';
import WhackAKey from './whackAKey';
import TargetShooting from './targetShooting';
import TriviaGame from './triviaGame';
import PatternRecognition from './patternRecognition';
import SequenceMemoryGame from './sequenceMemoryGame';
import IconMemory from './iconMemory';

export interface GameComponentProps {
  seed: number;
  event: EventType;
}

export interface GameSlotProps extends GameComponentProps {
  currentGame: GameType;
}

const gameComponentMap: Record<
  GameType,
  React.ComponentType<GameComponentProps> | undefined | null
> = {
  whackAKey: WhackAKey,
  targetShooting: TargetShooting,
  triviaGame: TriviaGame,
  patternRecognition: PatternRecognition,
  sequenceMemoryGame: SequenceMemoryGame,
  iconMemory: IconMemory,
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
