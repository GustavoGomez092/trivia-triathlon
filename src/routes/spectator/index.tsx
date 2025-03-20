import { Button } from '@/components/ui/button';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { PositionTable } from '@/components/PositionTable';
import { RacingTrack } from '@/components/RacingTrack';
import { useTopUsersForEvent } from '@/firebase/hooks/useTopUsersForGame';
import { useGetUsers } from '@/firebase/hooks/useCurrentUser';
import './index.css';

const Spectator = () => {
  const { scores, loading } = useTopUsersForEvent('sprint');
  const { loading: loadingUsers, getNameByEmail } = useGetUsers();

  const router = useRouter();
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  const handleReturnToLogin = () => {
    router.navigate({ to: '/login' });
  };

  return (
    <div className="spectator-page h-svh w-svw flex p-4">
      <div className="player-main pointer-events-none flex w-8/12 flex-col gap-6">
        <RacingTrack
          loading={loading || loadingUsers}
          getNameByEmail={getNameByEmail}
          scores={scores!}
          selectedEmail={selectedEmail}
        />
      </div>

      <div className="w-3xl flex">
        <PositionTable
          loading={loading || loadingUsers}
          getNameByEmail={getNameByEmail}
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
