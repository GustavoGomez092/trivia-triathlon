import { EventType } from '@/types/Game';
import { ref, set, get, update } from 'firebase/database';
import { database } from './firebase-config';
import { UserScore } from "@/firebase/hooks/useTopUsersForEvent.ts";

export interface ScoreData {
  finishTime: number;
  distanceTraveled: number;
}

export async function addScoreToEvent(
  event: EventType,
  action: 'set'| 'update',
  user: Pick<UserScore, "email" | "userName" | "uid">,
  scoreData: ScoreData,
): Promise<void> {
  const scoreRef = ref(database, `events/${event}/scores/${user.uid}`);

  try {
    const actionFn = action === 'set' ? set : update;
    await actionFn(scoreRef, {
      ...scoreData,
      ...user
    });
    console.log(`Score set for ${event} for user ${user.uid}`);
  } catch (error) {
    console.error(`Error setting score for ${event} for user ${user.uid}:`, error);
  }
}

export async function getEventScore(event: EventType, uid: string): Promise<ScoreData | null> {
    const scoresRef = ref(database, `events/${event}/scores/${uid}`);
    const snapshot = await get(scoresRef);
    return snapshot.exists() ? snapshot.val() : null;
}