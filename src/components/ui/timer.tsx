import * as React from 'react';

import { cn, getTime } from '@/lib/utils';
import useEventStore from '@/stores/eventStore';

function Timer({ className, ...props }: React.ComponentProps<'div'>) {
  const { time } = useEventStore();

  return (
    <div className={cn('timer', className)} {...props}>
      <div className="nes-container timer__time bg-white !p-1 text-black">
        {getTime(time)}
      </div>
    </div>
  );
}

export { Timer };
