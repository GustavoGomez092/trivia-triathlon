import { useCurrentUser } from '@/firebase/hooks/useCurrentUser';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { requireAuthLoader } from '@/firebase/database/requireAuthLoader.ts';
import { useEffect } from 'react';
import { isEventStarted } from '@/firebase/database/games';

export const Route = createFileRoute('/waiting-room/')({
  component: waitingRoom,
  loader: requireAuthLoader,
});

function waitingRoom() {
  const { user } = useCurrentUser();
  const navigation = useRouter();

  useEffect(() => {
    if (!user) {
      return;
    }

    const checkEventStatus = async () => {
      const started = await isEventStarted('sprint');

      if (started) {
        navigation.navigate({ to: '/player-sprint' });
      }
    };

    checkEventStatus();
  }, [user]);
 
  return (
    <div className="p-2">Hello welcome to the waiting room!</div>
  );
}
