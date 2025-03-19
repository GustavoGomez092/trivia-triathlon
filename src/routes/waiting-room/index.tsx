import { Button } from '@/components/ui/button';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import './index.css';
import { PositionTable } from '@/components/PositionTable';
import { RacingTrack } from '@/components/RacingTrack';
import { useTopUsersForGame } from '@/firebase/hooks/useTopUsersForGame';
import { Label } from '@/components/ui/label';

const waitingRoom = () => {
  const { scores, loading } = useTopUsersForGame('whackAKey');

  const router = useRouter();

  const handleReturnToLogin = () => {
    router.navigate({ to: '/login' });
  };

  return (
    <div className="min-h-svh waiting-room-page flex w-full items-start justify-between gap-8 p-6 md:p-10">
      <div className="z-30 w-full">
        {loading ? (
          <Label htmlFor="loading">Loading...</Label>
        ) : (
          <RacingTrack />
        )}
      </div>

      <div className="z-30 w-max">
        {loading ? (
          <Label htmlFor="loading">Loading...</Label>
        ) : (
          <PositionTable scores={scores} />
        )}
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

export const Route = createFileRoute('/waiting-room/')({
  component: waitingRoom,
});
