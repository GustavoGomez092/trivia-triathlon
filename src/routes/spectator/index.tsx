import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { PositionTable } from '@/components/PositionTable';
import { CyclingRoute } from '@/components/CyclingRoute';
import { useTopUsersForEvent } from '@/firebase/hooks/useTopUsersForEvent.ts';
import './index.css';
import { CURRENT_EVENT } from '@/types/Game';

const Spectator = () => {
  const { scores, loading } = useTopUsersForEvent(CURRENT_EVENT);

  // const router = useRouter();
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  return (
    <div className="spectator-page h-svh w-svw flex gap-2 p-4">
      <div className="player-main flex w-[60%] flex-col">
        <CyclingRoute
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
    </div>
  );
};

export const Route = createFileRoute('/spectator/')({
  component: Spectator,
});
