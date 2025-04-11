import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../database/firebase-config';
import { EventType } from '@/types/Game.ts';

export default function useIsEventFinished(event: EventType) {
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        const eventRef = ref(database, `events/${event}`);

        const unsubscribe = onValue(eventRef, (snapshot) => {
            const eventData = snapshot.val();
            setIsStarted(Boolean(eventData?.finished));
        });

        return () => unsubscribe();
    }, [event]);

    return isStarted;
}
