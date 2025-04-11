import { clsx, type ClassValue } from 'clsx';
import { useRef, useCallback } from 'react';
import { twMerge } from 'tailwind-merge';

export const TOTAL_DISTANCE = 3000;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTime = (ticks: number) => {
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

export const getUsername = (email: string) => {
  return email.split('@')[0];
};

export const useThrottle = (callback: Function, limit: number) => {
  const lastCallRef = useRef(0);
  const throttledCallback = useCallback(
    (...args: any) => {
      const now = Date.now();
      if (now - lastCallRef.current >= limit) {
        lastCallRef.current = now;
        callback(...args);
      }
    },
    [callback, limit],
  );
  return throttledCallback;
};

export const getDistance = (distanceTraveled: number) => {
  return `${
    distanceTraveled < TOTAL_DISTANCE ? distanceTraveled : TOTAL_DISTANCE
  } kms`;
};

export const getSanitizedEmail = (email?: string) => {
  return email ? email.replace(/\./g, '_') : '';
};
