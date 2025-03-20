import { getUsername } from '@/lib/utils';
import { FC } from 'react';

export interface TooltipProps {
  visible: boolean;
  x: number;
  y: number;
  email: string;
  distance: string;
}

const Tooltip: FC<TooltipProps> = ({ distance, email, x, y }) => {
  return (
    <div
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-full transform whitespace-nowrap bg-black bg-opacity-70 px-2 py-1 text-xs text-white"
      style={{ left: x, top: y }}
    >
      <div>
        <strong>{getUsername(email)}</strong>
      </div>
      <div>{distance} m</div>
    </div>
  );
};

export { Tooltip };
