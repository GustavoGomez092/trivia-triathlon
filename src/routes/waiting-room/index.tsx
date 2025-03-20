import { useCurrentUser } from '@/firebase/hooks/useCurrentUser';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/waiting-room/')({
  component: waitingRoom,
});

function waitingRoom() {
  const { user } = useCurrentUser();
  return (
    <div className="p-2">Hello {user?.email} welcome to the waiting room!</div>
  );
}
