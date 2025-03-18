import { useList } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { GameType } from '@/types/Game';
import { database } from '../database/firebase-config';
import { ScoreData } from '../database/games';

export interface UserScore {
  email: string;
  score: ScoreData;
}

export function useTopUsersForGame(game?: GameType) {
  if (!game) {
    return { scores: [], loading: false, error: null };
  }

  console.log(game);
  const scoresRef = ref(database, `games/${game}/scores`);
  const [snapshots, loading, error] = useList(scoresRef);

  const scores: UserScore[] = (snapshots ?? [])
    .map((snap) => ({
      email: snap.key || '',
      score: snap.val() as ScoreData,
    }))
    .sort((a, b) => b.score.finishTime - a.score.finishTime);

  return { scores, loading, error };
}
