import { useCurrentUser } from '@/firebase/hooks/useCurrentUser';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { requireAuthLoader } from '@/firebase/database/requireAuthLoader.ts';
import { FC, useEffect } from 'react';
import { isEventStarted } from '@/firebase/database/games';
import './index.css';
import { useTopUsersForEvent } from '@/firebase/hooks/useTopUsersForEvent';
import { getSanitizedEmail, getUsername } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface PlayerBadgeProps {
  currentUserEmail: string;
  userName: string;
  email: string;
}

const PlayerBadge: FC<PlayerBadgeProps> = ({
  currentUserEmail,
  userName,
  email,
}) => {
  const sanitizedEmail = getSanitizedEmail(email);
  const isCurrentUser = getSanitizedEmail(currentUserEmail) === sanitizedEmail;

  return (
    <div className="nes-badge is-icon !w-fit" key={email}>
      <span className="is-warning !-left-9 !-top-7 !bg-transparent !shadow-none">
        {isCurrentUser && <i className="nes-logo is-small"></i>}
      </span>
      <span className="is-error !w-full">{userName || getUsername(email)}</span>
    </div>
  );
};

const waitingRoom = () => {
  const { user } = useCurrentUser();
  const { email: currentUserEmail } = user || {};
  const { scores, loading } = useTopUsersForEvent('sprint');

  const navigation = useRouter();

  useEffect(() => {
    if (!user) {
      return;
    }

    const checkEventStatus = async () => {
      const started = await isEventStarted('sprint');

      if (started) {
        navigation.navigate({ to: '/player-sprint' });
      }
    };

    checkEventStatus();
  }, [user]);

  return (
    <div className="waiting-room-page h-svh w-svw flex flex-col justify-end p-4 pb-6">
      <div className="nes-container is-rounded bg-gray-200/85 flex h-fit w-full flex-col items-center gap-4 p-8">
        <h1 className="text-2xl font-bold">Participants</h1>

        {loading ? (
          <Label htmlFor="loading">Loading...</Label>
        ) : (
          <div className="flex max-h-[80svh] w-full flex-wrap justify-center gap-x-16 gap-y-8 overflow-y-auto px-16 pt-12">
            <PlayerBadge
              currentUserEmail={user?.email || ''}
              email={user?.email || ''}
              key={user?.email}
              userName={user?.name || ''}
            />

            {scores
              ?.filter(
                ({ email }) =>
                  getSanitizedEmail(currentUserEmail) !==
                  getSanitizedEmail(email),
              )
              ?.map(({ userName, email }) => {
                return (
                  <PlayerBadge
                    currentUserEmail={currentUserEmail || ''}
                    email={email}
                    key={email}
                    userName={userName}
                  />
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export const Route = createFileRoute('/waiting-room/')({
  component: waitingRoom,
  loader: requireAuthLoader,
});
