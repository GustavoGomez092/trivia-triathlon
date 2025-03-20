import { createFileRoute } from '@tanstack/react-router';
import { requireAuthLoader } from '@/firebase/database/requireAuthLoader.ts';
import useIsEventStarted from "@/firebase/hooks/useIsEventStarted.ts";

export const Route = createFileRoute('/waiting-room/')({
  component: waitingRoom,
  loader: requireAuthLoader,
});

function waitingRoom() {
  useIsEventStarted('sprint');
 
  return (
    <div className="p-2">Hello welcome to the waiting room!</div>
  );
}
