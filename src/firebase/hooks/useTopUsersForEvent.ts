import { useList } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { EventType } from '@/types/Game';
import { database } from '../database/firebase-config';
import { ScoreData } from '../database/games';

interface RawScore {
    email: string;
    userName: string;
    uid: string;
    finishTime: number;
    distanceTraveled: number;
}

export interface UserScore {
  email: string;
  userName: string;
  uid: string;
  score: ScoreData;
}

export function useTopUsersForEvent(event?: EventType) {
  if (!event) {
    return { scores: [], loading: false, error: null };
  }

  const scoresRef = ref(database, `events/${event}/scores`);
  const [snapshots, loading, error] = useList(scoresRef);

  const scores: UserScore[] = (snapshots ?? [])
      .map((snap) => {
        const data: RawScore = snap.val();
        const { userName, email, finishTime, distanceTraveled } = data;
        return {
            uid: snap.key ?? '',
            email: email ?? '',
            userName,
            score: {
                finishTime,
                distanceTraveled,
            },
        };
      })
      .sort((a, b) => a.score.finishTime - b.score.finishTime)
      .sort((a, b) => b.score.distanceTraveled - a.score.distanceTraveled);

  return { scores, loading, error };
}
