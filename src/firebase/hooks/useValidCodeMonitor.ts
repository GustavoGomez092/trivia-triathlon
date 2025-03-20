import { useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { signOut } from 'firebase/auth';
import { useNavigate } from '@tanstack/react-router';
import { auth, database } from '../database/firebase-config';

export default function useValidCodeMonitor() {
  const navigate = useNavigate();
  useEffect(() => {
    const validCodeRef = ref(database, 'currentValidCode');

    const unsubscribe = onValue(validCodeRef, async (snapshot) => {
      const validCodeData = snapshot.val();
      if (!validCodeData || !validCodeData.active) {
        await signOut(auth);
        navigate({ to: '/login' });
      }
    });

    return () => unsubscribe();
  }, [navigate]);
}
