import { FC } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useTopUsersForEvent } from '@/firebase/hooks/useTopUsersForEvent';
import { requireAuthLoader } from '@/firebase/database/requireAuthLoader.ts';
import { useCurrentUser } from '@/firebase/hooks/useCurrentUser';
import useIsEventStarted from '@/firebase/hooks/useIsEventStarted.ts';
import { Label } from '@/components/ui/label';
import { getSanitizedEmail, getUsername } from '@/lib/utils';
import './index.css';

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
  useIsEventStarted('sprint');

  const { user } = useCurrentUser();
  const { email: currentUserEmail } = user || {};
  const { scores, loading } = useTopUsersForEvent('sprint');

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
