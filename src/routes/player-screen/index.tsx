import './index.css';
import { createFileRoute } from '@tanstack/react-router';
import SwimmingScreen from '@/components/Events/swimming';
import controlPanel from '@/assets/images/controlPanel.png';
import GameRandomizer from '@/components/miniGames/gameRandomizer';
import { requireAuthLoader } from '@/firebase/database/requireAuthLoader.ts';
import { GamePositionTable } from '@/components/GamePositionTable';
import nsLogo from '@/assets/images/NS-logo-cropped.png';
import useIsEventStarted from '@/firebase/hooks/useIsEventStarted.ts';
import { CURRENT_EVENT, EventType } from '@/types/Game';
import SprintScreen from '@/components/Events/sprint';
import { ReactNode } from 'react';

const SCREEN: Record<EventType, ReactNode> = {
  sprint: <SprintScreen />,
  swimming: <SwimmingScreen />,
  cycling: <>TODO</>,
};

export const Route = createFileRoute('/player-screen/')({
  component: RouteComponent,
  loader: requireAuthLoader,
});

function RouteComponent() {
  useIsEventStarted(CURRENT_EVENT);

  return (
    <div className="sprint-event h-svh w-svw flex gap-2 bg-sky-400 p-4">
      <div className="player-main pointer-events-none flex w-[60%] flex-col gap-8 2xl:gap-6">
        <div className="player-game h-7/12 2xl:h-8/12 nes-container is-rounded flex max-h-[576px] max-w-[1024px] items-start justify-start gap-8 self-start overflow-hidden bg-[#61696B] lg:self-center">
          <div className="interface nes-container is-rounded relative -top-7 h-[496px] max-h-[496px] min-h-[496px] w-[800px] min-w-[800px] max-w-[800px] scale-95 overflow-hidden 2xl:top-0 2xl:scale-100">
            {SCREEN[CURRENT_EVENT]}
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
      <div className="event-stats flex w-[40%]">
        <GamePositionTable />
      </div>
    </div>
  );
}
