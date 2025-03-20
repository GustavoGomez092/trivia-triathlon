import { Button } from '@/components/ui/button';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { PositionTable } from '@/components/PositionTable';
import { RacingTrack } from '@/components/RacingTrack';
import { useTopUsersForEvent } from '@/firebase/hooks/useTopUsersForGame';
import './index.css';

const Spectator = () => {
  const { scores, loading } = useTopUsersForEvent('whackAKey');
  const router = useRouter();
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  const handleReturnToLogin = () => {
    router.navigate({ to: '/login' });
  };

  return (
    <div className="min-h-svh spectator-page flex w-full items-start justify-between gap-8 p-6 md:p-10">
      <div className="z-30 w-full">
        {loading ? (
          <Label htmlFor="loading">Loading...</Label>
        ) : (
          <RacingTrack scores={scores!} selectedEmail={selectedEmail} />
        )}
      </div>

      <div className="z-30 w-max">
        {loading ? (
          <Label htmlFor="loading">Loading...</Label>
        ) : (
          <PositionTable
            scores={scores!}
            onRowEnter={(email) => setSelectedEmail(email)}
            onRowLeave={() => setSelectedEmail(null)}
            selectedEmail={selectedEmail}
          />
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

export const Route = createFileRoute('/spectator/')({
  component: Spectator,
});
