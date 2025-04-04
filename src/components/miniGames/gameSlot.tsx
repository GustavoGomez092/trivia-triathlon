import { GameType, EventType } from '@/types/Game';
import FindTheBall from './findTheBall';
import IconMemory from './iconMemory';
import PatternRecognition from './patternRecognition';
import SequenceMemoryGame from './sequenceMemoryGame';
import TargetShooting from './targetShooting';
import TriviaGame from './triviaGame';
import WhackAKey from './whackAKey';
import DontClickTheBomb from './dontClickTheBomb';
import QuickMathReflex from './quickMathReflex';

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

  findTheBall: FindTheBall,
  dontClickBomb: DontClickTheBomb,
  quickMathReflex: QuickMathReflex,
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
