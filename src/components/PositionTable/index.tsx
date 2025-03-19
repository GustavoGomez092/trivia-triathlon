import { cn, getTime } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { useTopUsersForGame } from '@/firebase/hooks/useTopUsersForGame';

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

export function PositionTable({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const { scores, loading } = useTopUsersForGame('whackAKey');

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="nes-container">
        <CardContent>
          {loading ? (
            <Label htmlFor="loading">Loading...</Label>
          ) : (
            <Table
              tableHeaders={TABLE_HEADERS}
              tableData={scores.map((score, index) => ({
                dist: `${score.score.distanceTraveled} m`,
                player: score.email,
                pos: index + 1,
                time: getTime(score.score.finishTime),
              }))}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
