import './index.css';
import { createFileRoute } from '@tanstack/react-router';
import SprintScreen from '@/components/Events/sprint';
import controlPanel from '@/assets/images/knobs.png';
import GameRandomizer from '@/components/miniGames/gameRandomizer';

export const Route = createFileRoute('/player-sprint/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="sprint-event h-svh w-svw flex bg-sky-400 p-4">
      <div className="player-main pointer-events-none flex w-8/12 flex-col gap-6">
        <div className="player-game h-8/12 nes-container is-rounded  flex max-h-[576px] max-w-[1024px] items-start justify-start gap-8 self-start overflow-auto bg-[#61696B] lg:self-center">
          <div className="interface nes-container is-rounded relative top-2 h-[496px] max-h-[496px] min-h-[496px] w-[800px] min-w-[800px] max-w-[800px] overflow-hidden">
            <SprintScreen />
          </div>
          <div className="knobs hidden h-full items-start 2xl:flex">
            <img
              src={controlPanel}
              className="relative top-2 w-[130px]"
              alt=""
            />
          </div>
        </div>
        <div className="player-mini-games h-4/12 flex items-center justify-center">
          <GameRandomizer />
        </div>
      </div>
      <div className="event-stats flex w-4/12"></div>
    </div>
  );
}
