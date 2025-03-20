import { EventType } from '@/types/Game';
import { get, ref, set } from 'firebase/database';
import { database } from './firebase-config';
import { getSanitizedEmail } from '@/lib/utils';

export interface ScoreData {
  finishTime: number;
  distanceTraveled: number;
}

export async function addScoreToEvent(
  event: EventType,
  email: string,
  scoreData: ScoreData,
): Promise<void> {
  const sanitizedEmail = getSanitizedEmail(email);
  const scoreRef = ref(database, `events/${event}/scores/${sanitizedEmail}`);

  try {
    await set(scoreRef, scoreData);
    console.log(`Score set for ${event} for user ${email}`);
  } catch (error) {
    console.error(`Error setting score for ${event} for user ${email}:`, error);
  }
}

export async function isEventStarted(event: EventType): Promise<boolean> {
  const eventRef = ref(database, `events/${event}/started`);

  try {
    const snapshot = await get(eventRef);
    return snapshot.exists() ? Boolean(snapshot.val()) : false;
  } catch (error) {
    console.error(`Error checking if event ${event} has started:`, error);
    return false;
  }
}
