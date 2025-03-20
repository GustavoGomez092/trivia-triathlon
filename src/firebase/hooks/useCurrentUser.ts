import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, database } from '@/firebase/database/firebase-config';
import { ref, get } from 'firebase/database';

export interface User {
  email: string;
  name: string;
  inviteCode: string;
  loggedInAt: string;
}

export function useCurrentUser() {
  const [authUserData, loading, error] = useAuthState(auth);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      if (authUserData) {
        const userRef = ref(database, `users/${authUserData.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setUser(snapshot.val());
        }
      }
    }
    fetchUserData();
  }, [authUserData]);

  return { user, loading, error };
}
