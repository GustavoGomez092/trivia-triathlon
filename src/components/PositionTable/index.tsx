import { cn, getDistance, getTime } from '@/lib/utils';
import { FC } from 'react';
import { UserScore } from '@/firebase/hooks/useTopUsersForEvent.ts';
import { Table } from '@/components/ui/table';
import { Label } from '@/components/ui/label';

const TABLE_HEADERS = Object.freeze([
  { title: 'Pos', key: 'pos' },
  { title: 'Player', key: 'player' },
  { title: 'Dist', key: 'dist' },
  { title: 'Time', key: 'time' },
]);

interface PositionTableProps {
  loading?: boolean;
  onRowEnter?: (email: string) => void;
  onRowLeave?: () => void;
  scores?: UserScore[];
  selectedEmail?: string | null;
}

const PositionTable: FC<PositionTableProps> = ({
  loading,
  onRowEnter,
  onRowLeave,
  scores,
}) => {
  return (
    <div className="nes-container is-rounded flex h-fit w-full flex-col items-center gap-4 bg-gray-200 p-8">
      <h1 className="text-2xl font-bold">Event Positions</h1>

      {loading ? (
        <Label htmlFor="loading">Loading...</Label>
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
              // Compute a color for the row (using the same HSL logic)
              const rowColor = `hsl(${
                (index * 360) / (scores.length || 20)
              }, 100%, 50%)`;
              return (
                <tr
                  key={email}
                  onMouseEnter={() => onRowEnter && onRowEnter(email)}
                  onMouseLeave={() => onRowLeave && onRowLeave()}
                  className={cn(
                    'whitespace-nowrap transition-colors hover:bg-gray-500',
                  )}
                  style={{ color: rowColor }}
                >
                  <td>{index + 1}</td>
                  <td>{email}</td>
                  <td>{getDistance(score.score.distanceTraveled)}</td>
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

export { PositionTable };
