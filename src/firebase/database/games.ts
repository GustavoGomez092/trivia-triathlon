import { GameType } from '@/types/Game';
import { ref, set } from 'firebase/database';
import { database } from './firebase-config';

export interface ScoreData {
  passed: boolean;
  finishTime: number;
  distanceTraveled?: number;
}

export async function addScoreToGame(
  game: GameType,
  email: string,
  scoreData: ScoreData,
): Promise<void> {
  const sanitizedEmail = email.replace(/\./g, '_');
  const scoreRef = ref(database, `games/${game}/scores/${sanitizedEmail}`);

  try {
    await set(scoreRef, scoreData);
    console.log(`Score set for ${game} for user ${email}`);
  } catch (error) {
    console.error(`Error setting score for ${game} for user ${email}:`, error);
  }
}
