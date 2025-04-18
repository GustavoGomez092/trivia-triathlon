import { LoginForm } from '@/components/LoginForm';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import './index.css';
import { Button } from '@/components/ui/button';
import { useLottie } from 'lottie-react';
import sprinter from '@/assets/lottie/sprinter.json';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { loginLoader } from '@/firebase/database/loginLoader';
import { CURRENT_EVENT } from '@/types/Game';
import useIsEventIsFinished from '@/firebase/hooks/useIsEventFinished';

export const Route = createFileRoute('/login/')({
  component: LoginPage,
  loader: loginLoader,
});

export default function LoginPage() {
  const router = useRouter();

  const runner = useRef<HTMLDivElement | null>(null);

  const sprinterOne = {
    animationData: sprinter,
    initialSegment: [0, 15] as [number, number],
    loop: true,
  };

  const sprinterTwo = {
    animationData: sprinter,
    initialSegment: [17, 56] as [number, number],
    loop: true,
  };

  const { View: SprinterOneView } = useLottie(sprinterOne);
  const { View: SprinterTwoView } = useLottie(sprinterTwo);
  const isEventFinished = useIsEventIsFinished(CURRENT_EVENT);

  gsap.registerPlugin(useGSAP);

  useEffect(() => {
    gsap.to(runner.current, {
      x: '-130vw',
      duration: 10,
      repeat: -1,
      ease: 'linear',
      delay: 5,
      repeatDelay: 10,
    });
  }, [runner]);

  const handleNavigateToWaitingRoom = () => {
    router.navigate({ to: '/spectator' });
  };

  const handleNavigateToPodium = () => {
    router.navigate({ to: '/podium' });
  };

  const handleNavigateToWinners = () => {
    router.navigate({ to: '/winners' });
  };

  return (
    <div className="min-h-svh login-page flex w-full items-center justify-center p-6 md:p-10">
      <div className="z-30 w-full max-w-md">
        <LoginForm />
      </div>
      <Button
        variant="secondary"
        className="!fixed bottom-6 left-6 z-40"
        onClick={handleNavigateToPodium}
      >
        Podium
      </Button>

      {isEventFinished && (
        <Button
          variant="secondary"
          className="!fixed bottom-6 left-52 z-40"
          onClick={handleNavigateToWinners}
        >
          Winners
        </Button>
      )}

      <Button
        variant="secondary"
        className="!fixed bottom-6 right-6 z-40"
        onClick={handleNavigateToWaitingRoom}
      >
        Enter as spectator
      </Button>
      <div className="sprinter fixed -left-12 bottom-6 z-20 h-96 w-96">
        <>{SprinterOneView}</>
      </div>
      <div
        ref={runner}
        className="sprinter-two fixed -right-96 bottom-9 z-10 h-96 w-96 scale-x-[-1]"
      >
        <>{SprinterTwoView}</>
      </div>
    </div>
  );
}
