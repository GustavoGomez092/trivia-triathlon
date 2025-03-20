import './index.css';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import SprintScreen from '@/components/Events/sprint';
import controlPanel from '@/assets/images/controlPanel.png';
import GameRandomizer from '@/components/miniGames/gameRandomizer';
import { useEffect } from 'react';
import { isEventStarted } from '@/firebase/database/games.ts';
import { useCurrentUser } from '@/firebase/hooks/useCurrentUser.ts';
import { requireAuthLoader } from '@/firebase/database/requireAuthLoader.ts';
import { GamePositionTable } from '@/components/GamePositionTable';
import nsLogo from '@/assets/images/NS-logo-cropped.png';

export const Route = createFileRoute('/player-sprint/')({
  component: RouteComponent,
  loader: requireAuthLoader,
});

function RouteComponent() {
  const router = useRouter();
  const { user } = useCurrentUser();

  useEffect(() => {
    async function checkEventStatus() {
      const started = await isEventStarted('sprint');
      if (!started && user) {
        router.navigate({ to: '/waiting-room' });
      }
    }

    checkEventStatus();
  }, []);

  return (
    <div className="sprint-event h-svh w-svw flex bg-sky-400 p-4">
      <div className="player-main pointer-events-none flex w-8/12 flex-col gap-6">
        <div className="player-game h-8/12 nes-container is-rounded flex max-h-[576px] max-w-[1024px] items-start justify-start gap-8 self-start overflow-auto bg-[#61696B] lg:self-center">
          <div className="interface nes-container is-rounded relative top-2 h-[496px] max-h-[496px] min-h-[496px] w-[800px] min-w-[800px] max-w-[800px] overflow-hidden">
            <SprintScreen />
          </div>
          <div className="knobs hidden h-full flex-col items-center justify-center gap-8 2xl:flex">
            <img
              src={controlPanel}
              className="relative top-2 w-[130px]"
              alt=""
            />
            <img src={nsLogo} className="mb-4 h-12 w-auto" alt="" />
          </div>
        </div>
        <div className="player-mini-games h-4/12 flex items-center justify-center">
          <GameRandomizer />
        </div>
      </div>
      <div className="event-stats w-3xl flex">
        <GamePositionTable />
      </div>
    </div>
  );
}
