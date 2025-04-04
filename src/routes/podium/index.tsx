import { Button } from '@/components/ui/button';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import './index.css';
import { Table } from '@/components/ui/table';
import data from '@/data/results.json';
import { cn } from '@/lib/utils';

const TABLE_HEADERS = Object.freeze([
  { title: 'Pos', key: 'position' },
  { title: 'Player', key: 'name' },
  { title: 'Sprint', key: 'sprintPoints' },
  { title: 'Swimming', key: 'swimmingPoints' },
  { title: 'Total', key: 'totalPoints' },
]);
const POSITION = ['🥇', '🥈', '🥉'];

const Podium = () => {
  const router = useRouter();

  const handleReturnToLogin = () => {
    router.navigate({ to: '/login' });
  };

  return (
    <div className="podium-page h-svh w-svw flex items-center justify-end p-4">
      <div className="nes-container is-rounded flex w-fit flex-col items-center gap-4 bg-gray-200 p-8">
        <h1 className="text-2xl font-bold">Sprint Podium</h1>

        <Table>
          <thead>
            <tr>
              {TABLE_HEADERS?.map(({ key, title }) => (
                <th key={key}>{title}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.results
              ?.sort((a, b) => b.totalPoints - a.totalPoints)
              .map((score, index) => (
                <tr
                  key={index}
                  className={cn(
                    'whitespace-nowrap text-xs text-black/50 transition-colors',
                    index === 0 && 'font-bold text-amber-500', // Gold medal (1st place)
                    index === 1 && 'font-bold text-slate-500', // Silver medal (2nd place)
                    index === 2 && 'font-bold text-amber-700', // Bronze medal (3rd place)
                    index > 2 && 'text-black/40', // All other positions
                  )}
                >
                  <td className="text-right">
                    <span
                      className={cn(POSITION?.[index] ? 'text-xl' : 'text-xs')}
                    >
                      {POSITION?.[index] ? POSITION[index] : score.position}
                    </span>
                  </td>
                  <td className="text-left">{score.name}</td>
                  <td className="text-right">{score.sprintPoints}</td>
                  <td className="text-right">{score.swimmingPoints}</td>
                  <td className="text-right">{score.totalPoints}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>

      <Button
        variant="default"
        className="!fixed bottom-6 right-6 z-20"
        onClick={handleReturnToLogin}
      >
        Back to login
      </Button>
    </div>
  );
};

export const Route = createFileRoute('/podium/')({
  component: Podium,
});
