import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { ref, get, set } from 'firebase/database';
import { signInAnonymously } from 'firebase/auth';
import { database, auth } from '@/firebase/database/firebase-config';
import { useRouter } from '@tanstack/react-router';
import nsLogo from '@/assets/images/NS-logo-cropped.png';
import { addScoreToEvent, getEventScore } from "@/firebase/database/games.ts";
import { getUserByEmail } from "@/firebase/database/user.ts";
import { useLoginEventStatus } from "@/firebase/hooks/useLoginEventStatus.ts";
import { CURRENT_EVENT } from '@/types/Game';

const MAX_NAME_LENGTH = 20;
const LoginForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { errorMessage: errorMessageEventStatus, isStarted } = useLoginEventStatus(CURRENT_EVENT);

  const isValidName = () => {
    if (!name || name.trim().length === 0) {
      setError('Name is required.');
      setLoading(false);
      return false;
    }

    const trimmedName = name.trim();
    if (trimmedName.length > MAX_NAME_LENGTH) {
      setError(`Name cannot exceed ${MAX_NAME_LENGTH} characters.`);
      setLoading(false);
      return false;
    }

    if (!/[A-Za-z]/.test(trimmedName)) {
      setError('Name must contain at least one letter.');
      setLoading(false);
      return false;
    }

    return true;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {

      if (isStarted) {
        setError(errorMessageEventStatus);
        setLoading(false);
        return;
      }

      const codeRef = ref(database, 'currentValidCode');
      const snapshot = await get(codeRef);

      if (!snapshot.exists()) {
        setError('No valid code found.');
        setLoading(false);
        return;
      }

      const codeData = snapshot.val();
      if (codeData.active && codeData.code === inviteCode) {
        if (!isValidName()) {
          return;
        }

        const existentUser = await getUserByEmail(email);
        if (existentUser) {
          setError('User with this email already exists.');
          setLoading(false);
          return;
        }

        const userCredential = await signInAnonymously(auth);
        const uid = userCredential.user.uid;

        const userData = {
          email,
          inviteCode,
          name,
          uid,
          loggedInAt: new Date().toISOString(),
        };
        await set(ref(database, `users/${uid}`), userData);

        const eventScore = await getEventScore(CURRENT_EVENT, uid);
        if (!eventScore?.distanceTraveled) {
          const scoreUserData = {
            email,
            userName: name,
            uid,
          }

          await addScoreToEvent(CURRENT_EVENT, 'set', scoreUserData, {
            finishTime: 0,
            distanceTraveled: 0,
          });
        }

        router.navigate({ to: '/waiting-room' });
      } else {
        setError(
          `Oops! That invite code doesn't seem to work. Please check your code and try again.`,
        );
      }
    } catch (err: any) {
      console.error('Error during login:', err);
      setError(err.message || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="nes-container">
        <CardHeader>
          <div className="flex flex-col items-center gap-2 text-center">
            <img src={nsLogo} className="mb-4 h-12 w-auto" alt="" />
            <h1 className="text-chart-1 font-sans text-4xl font-bold">
              Trivia Triathlon
            </h1>
            <p className="text-muted-foreground text-balance text-sm">
              Enter your email + invite code to login
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="player@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="name">Name</Label>
                </div>
                <Input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="inviteCode">Invite code</Label>
                </div>
                <Input
                  id="inviteCode"
                  type="text"
                  required
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
              {error && <p className="text-red-500">{error}</p>}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export { LoginForm };
