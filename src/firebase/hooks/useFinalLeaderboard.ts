import { useTopUsersForEvent } from '@/firebase/hooks/useTopUsersForEvent';
import leaderboard from '@/data/results.json';
import { useMemo } from 'react';

export interface Player {
  name: string;
  place: 1 | 2 | 3;
  totalPoints: number;
}

function getPointsForPlace(place: number): number {
  if (place === 1) return 15;
  if (place === 2) return 12;
  if (place === 3) return 10;
  if (place >= 4 && place <= 6) return 8;
  if (place >= 7 && place <= 10) return 6;
  return 4;
}

export const useFinalLeaderboard = () => {
  const { scores, loading } = useTopUsersForEvent('cycling');

  const topPlayers = useMemo(() => {
    if (loading || !scores) return [];

    const cyclingPoints: Record<string, number> = {};
    scores.forEach((score, index) => {
      const place = index + 1;
      cyclingPoints[score.email] = getPointsForPlace(place);
    });

    const merged = leaderboard.results.map((user) => {
      const extraPoints = cyclingPoints[user.email] ?? 0;
      return {
        ...user,
        cyclingPoints: extraPoints,
        totalPoints: user.totalPoints + extraPoints,
      };
    });

    return merged
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, 3)
      .map(
        (user, index) =>
          ({
            name: user.name,
            place: index + 1,
            totalPoints: user.totalPoints,
          }) as Player,
      );
  }, [scores, loading]);

  return { topPlayers, loading };
};
