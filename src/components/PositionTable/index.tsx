import { cn, getTime } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { FC } from 'react';
import { UserScore } from '@/firebase/hooks/useTopUsersForGame';

const TABLE_HEADERS = Object.freeze([
  {
    title: 'Pos',
    key: 'pos',
  },
  {
    title: 'Player',
    key: 'player',
  },
  {
    title: 'Dist',
    key: 'dist',
  },
  {
    title: 'Time',
    key: 'time',
  },
]);

interface PositionTableProps {
  className?: string;
  scores?: UserScore[];
}

export const PositionTable: FC<PositionTableProps> = ({
  className,
  scores,
}) => {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <Card className="nes-container">
        <CardContent>
          <Table
            tableHeaders={TABLE_HEADERS}
            tableData={scores?.map((score, index) => ({
              dist: `${score.score.distanceTraveled} m`,
              player: score.email,
              pos: index + 1,
              time: getTime(score.score.finishTime),
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
};
