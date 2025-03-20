import { cn, getTime } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { FC } from 'react';
import { UserScore } from '@/firebase/hooks/useTopUsersForEvent.ts';
import { Table } from '@/components/ui/table';

const TABLE_HEADERS = Object.freeze([
  { title: 'Pos', key: 'pos' },
  { title: 'Player', key: 'player' },
  { title: 'Dist', key: 'dist' },
  { title: 'Time', key: 'time' },
]);

interface PositionTableProps {
  className?: string;
  scores?: UserScore[];
  onRowEnter?: (email: string) => void;
  onRowLeave?: () => void;
  selectedEmail?: string | null;
}

const PositionTable: FC<PositionTableProps> = ({
  className,
  scores,
  onRowEnter,
  onRowLeave,
}) => {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <Card className="nes-container">
        <CardContent>
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
                    <td>{score.userName}</td>
                    <td>{score.score.distanceTraveled} m</td>
                    <td>{getTime(score.score.finishTime)}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export { PositionTable };
