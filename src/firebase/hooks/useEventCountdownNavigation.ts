import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { useNavigate } from '@tanstack/react-router';
import { database } from '../database/firebase-config';

interface UseEventCountdownNavigationProps {
  event: string;
  startCount?: number;
  redirectTo: string;
}

export default function useEventCountdownNavigation({
  event,
  startCount = 5,
  redirectTo,
}: UseEventCountdownNavigationProps) {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState<number | null>(null);

  // Listen for event start using Firebase
  useEffect(() => {
    const eventRef = ref(database, `events/${event}`);
    const unsubscribe = onValue(eventRef, (snapshot) => {
      const eventData = snapshot.val();
      // Only trigger countdown if it's not already running
      if (eventData && eventData.started && countdown === null) {
        setCountdown(startCount);
      }
    });
    return () => unsubscribe();
  }, [event, countdown, startCount]);

  // Countdown timer logic: use setTimeout to decrement every second
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      navigate({ to: redirectTo });
    } else {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, navigate, redirectTo]);

  return countdown;
}
