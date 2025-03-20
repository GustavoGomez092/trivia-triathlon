import { useList } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { EventType } from '@/types/Game';
import { database } from '../database/firebase-config';
import { ScoreData } from '../database/games';

export interface UserScore {
  email: string;
  userName: string;
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
        const data = snap.val();
        const { userName, ...scoreData } = data;
        return {
          email: snap.key ?? '',
          userName,
          score: scoreData as ScoreData,
        };
      })
    .sort((a, b) => a.score.finishTime - b.score.finishTime)
    .sort((a, b) => b.score.distanceTraveled - a.score.distanceTraveled);

  return { scores, loading, error };
}
