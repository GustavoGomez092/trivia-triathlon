import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { PositionTable } from '@/components/PositionTable';
import { SwimmingPool } from '@/components/SwimmingPool';
import { useTopUsersForEvent } from '@/firebase/hooks/useTopUsersForEvent.ts';
import './index.css';
import { CURRENT_EVENT } from '@/types/Game';

const Spectator = () => {
  const { scores, loading } = useTopUsersForEvent(CURRENT_EVENT);

  // const router = useRouter();
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  // const handleReturnToLogin = () => {
  //   router.navigate({ to: '/login' });
  // };

  return (
    <div className="spectator-page h-svh w-svw flex gap-2 p-4">
      <div className="player-main flex w-[60%] flex-col">
        <SwimmingPool
          loading={loading}
          scores={scores!}
          selectedEmail={selectedEmail}
        />
      </div>

      <div className="w-[40%]">
        <PositionTable
          loading={loading}
          onRowEnter={(email) => setSelectedEmail(email)}
          onRowLeave={() => setSelectedEmail(null)}
          scores={scores!}
          selectedEmail={selectedEmail}
        />
      </div>

      {/* <Button
        variant="default"
        className="!fixed bottom-6 right-6 z-20"
        onClick={handleReturnToLogin}
      >
        Back to login
      </Button> */}
    </div>
  );
};

export const Route = createFileRoute('/spectator/')({
  component: Spectator,
});
