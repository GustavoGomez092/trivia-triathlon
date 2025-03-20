import { useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { useNavigate } from '@tanstack/react-router';
import { database } from '../database/firebase-config';
import {EventType} from "@/types/Game.ts";

export default function useIsEventStarted(event: EventType) {
  const navigate = useNavigate();
  useEffect(() => {
    const eventRef = ref(database, `events/${event}`);

    const unsubscribe = onValue(eventRef, async (snapshot) => {
      const validCodeData = snapshot.val();
      if (!validCodeData || !validCodeData.started) {
        navigate({ to: '/waiting-room' });
      } else {
        navigate({ to: '/player-sprint' });
      }
    });

    return () => unsubscribe();
  }, [navigate]);
}
