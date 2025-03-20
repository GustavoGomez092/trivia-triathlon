import { useState, useEffect, useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, database } from '@/firebase/database/firebase-config';
import { ref, get } from 'firebase/database';
import { getUsername, getSanitizedEmail } from '@/lib/utils';

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

export const useGetUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const usersRef = ref(database, 'users');
    get(usersRef)
      .then((snapshot) => {
        const usersData = snapshot.val();
        if (usersData) {
          const usersArray = Object.entries(usersData).map(([uid, user]) => {
            const typedUser = user as Partial<User>;
            return {
              ...(typeof typedUser === 'object' && typedUser !== null
                ? typedUser
                : {}),
              uid,
              email: typedUser.email || '',
              name: typedUser.name || '',
              inviteCode: typedUser.inviteCode || '',
              loggedInAt: typedUser.loggedInAt || '',
            };
          });
          setUsers(usersArray);
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getNameByEmail = useCallback(
    (email: string) => {
      return (
        users.find(
          (user) => getSanitizedEmail(user.email) === getSanitizedEmail(email),
        )?.name || getUsername(email)
      );
    },
    [users],
  );

  return {
    error,
    getNameByEmail,
    loading,
    users,
  };
};
