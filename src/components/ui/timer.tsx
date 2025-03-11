import * as React from 'react';

import { cn } from '@/lib/utils';
import useSprintStore from '@/stores/sprintStore';

function Timer({ className, ...props }: React.ComponentProps<'div'>) {
  const { time } = useSprintStore();

  const setTime = (ticks: number) => {
    // Each tick is 0.1 s (100 ms)
    const minutes = Math.floor(ticks / 600);
    const seconds = Math.floor((ticks % 600) / 10);
    const tenths = ticks % 10; // leftover ticks for the fraction of a second

    // Optional zero-padding
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');
    const paddedTenths = String(tenths).padEnd(2, '0');

    // Return "mm:ss.t" format (or adjust to your preference)
    return `${paddedMinutes}:${paddedSeconds}:${paddedTenths}`;
  };

  return (
    <div className={cn('timer', className)} {...props}>
      <div className="nes-container timer__time bg-white !p-1 text-black">
        {setTime(time)}
      </div>
    </div>
  );
}

export { Timer };
