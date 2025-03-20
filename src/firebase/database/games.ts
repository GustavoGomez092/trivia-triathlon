import { EventType } from '@/types/Game';
import { ref, set } from 'firebase/database';
import { database } from './firebase-config';

export interface ScoreData {
  finishTime: number;
  distanceTraveled: number;
}

export async function addScoreToEvent(
  event: EventType,
  email: string,
  scoreData: ScoreData,
): Promise<void> {
  const sanitizedEmail = email.replace(/\./g, '_');
  const scoreRef = ref(database, `events/${event}/scores/${sanitizedEmail}`);

  try {
    await set(scoreRef, scoreData);
    console.log(`Score set for ${event} for user ${email}`);
  } catch (error) {
    console.error(`Error setting score for ${event} for user ${email}:`, error);
  }
}
