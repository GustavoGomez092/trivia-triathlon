import { useTopUsersForEvent } from '@/firebase/hooks/useTopUsersForEvent.ts';
import { Table } from './ui/table';
import { cn, getTime } from '@/lib/utils';
import { useCurrentUser } from '@/firebase/hooks/useCurrentUser';

const TABLE_HEADERS = Object.freeze([
  { title: 'Pos', key: 'pos' },
  { title: 'Player', key: 'player' },
  { title: 'Dist', key: 'dist' },
  { title: 'Time', key: 'time' },
]);

const GamePositionTable = () => {
  const { scores, loading: isLoadingStats } = useTopUsersForEvent('sprint');
  const { user, loading: isLoadingUser } = useCurrentUser();

  const isLoading = isLoadingStats || isLoadingUser;

  return (
    <div className="nes-container is-rounded flex h-fit w-full flex-col items-center gap-4 bg-gray-200 p-8">
      <h1 className="text-2xl font-bold">Event Stats</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <thead>
            <tr>
              {TABLE_HEADERS?.map(({ key, title }) => (
                <th key={key}>{title}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {scores?.map((score, index) => {
              const email = score.email;
              const sanitizedEmail = user?.email.replace(/\./g, '_');
              const isCurrentUser = email === sanitizedEmail;
              return (
                <tr
                  key={email}
                  className={cn(
                    'whitespace-nowrap text-black/50 transition-colors',
                    {
                      'bg-red-100 font-bold text-red-500/100': isCurrentUser,
                    },
                  )}
                >
                  <td>{index + 1}</td>
                  <td>{score.userName}</td>
                  <td>{score.score.distanceTraveled} m</td>
                  <td>{getTime(score.score.finishTime)}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default GamePositionTable;
