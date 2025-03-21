import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../database/firebase-config';
import { EventType } from '@/types/Game';

export function useLoginEventStatus(event: EventType) {
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const eventRef = ref(database, `events/${event}`);
    const unsubscribe = onValue(eventRef, (snapshot) => {
      const eventData = snapshot.val();
      if (eventData && eventData.started) {
        setIsStarted(true);
        setErrorMessage('The game has already started. Registration is closed.');
      } else {
        setIsStarted(false);
        setErrorMessage('');
      }
    });
    return () => unsubscribe();
  }, [event]);

  return { isStarted, errorMessage };
}
