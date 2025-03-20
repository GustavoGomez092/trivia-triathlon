import { Button } from '@/components/ui/button';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { PositionTable } from '@/components/PositionTable';
import { RacingTrack } from '@/components/RacingTrack';
import { useTopUsersForEvent } from '@/firebase/hooks/useTopUsersForEvent.ts';
import './index.css';

const Spectator = () => {
  const { scores, loading } = useTopUsersForEvent('sprint');

  const router = useRouter();
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  const handleReturnToLogin = () => {
    router.navigate({ to: '/login' });
  };

  return (
    <div className="spectator-page h-svh w-svw flex p-4">
      <div className="player-main pointer-events-none flex w-8/12 flex-col gap-6">
        <RacingTrack
          loading={loading}
          scores={scores!}
          selectedEmail={selectedEmail}
        />
      </div>

      <div className="w-3xl flex">
        <PositionTable
          loading={loading}
          onRowEnter={(email) => setSelectedEmail(email)}
          onRowLeave={() => setSelectedEmail(null)}
          scores={scores!}
          selectedEmail={selectedEmail}
        />
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

export const Route = createFileRoute('/spectator/')({
  component: Spectator,
});
