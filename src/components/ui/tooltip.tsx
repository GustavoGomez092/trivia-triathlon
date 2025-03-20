import { getDistance } from '@/lib/utils';
import { FC } from 'react';

export interface TooltipProps {
  visible: boolean;
  x: number;
  y: number;
  name: string;
  distance: number;
}

const Tooltip: FC<TooltipProps> = ({ distance, name, x, y }) => {
  return (
    <div
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-full transform whitespace-nowrap bg-black bg-opacity-70 px-2 py-1 text-xs text-white"
      style={{ left: x, top: y }}
    >
      <div>
        <strong>{name}</strong>
      </div>
      <div>{getDistance(distance)}</div>
    </div>
  );
};

export { Tooltip };
