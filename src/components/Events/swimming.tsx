import crowdGif from '@/assets/images/sprint/crowd.gif';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef, useEffect } from 'react';
import { useLottie } from 'lottie-react';
import swimmerJump from '@/assets/lottie/swimmer-jump.json';
import swimmerSwim from '@/assets/lottie/swimmer-swim.json';
import useEventStore from '@/stores/eventStore';
import { Timer } from '@/components/ui/timer';
import { cn, getDistance, TOTAL_DISTANCE, useThrottle } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { addScoreToEvent } from '@/firebase/database/games';
import { useCurrentUser } from '@/firebase/hooks/useCurrentUser';
import { CURRENT_EVENT } from '@/types/Game';
import './swimming.css';

export default function SwimmingScreen() {
  gsap.registerPlugin(useGSAP);

  const {
    start,
    finish,
    finished,
    speed,
    distanceTraveled,
    setTime,
    setDistanceTraveled,
    started,
  } = useEventStore();

  const crowd = useRef(null);
  const singleCrowd = useRef(null);
  const swimmerContainer = useRef(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const throttleAddScoreToEvent = useThrottle(addScoreToEvent, 500);
  const { user } = useCurrentUser();

  const swimmerOne = {
    animationData: swimmerJump,
    loop: false,
    autoplay: false,
  };

  const swimmerTwo = {
    animationData: swimmerSwim,
    loop: true,
    autoplay: true,
  };

  const {
    View: SwimmerOneView,
    goToAndStop,
    playSegments,
    setSpeed,
  } = useLottie(swimmerOne);

  const { View: SwimmerTwoView, setSpeed: setSpeedTwo } = useLottie(swimmerTwo);

  useEffect(() => {
    if (!started) return;
    const timer = setInterval(() => {
      if (finished) {
        const newTime = useEventStore.getState().time;

        setTime(newTime);
        clearInterval(timer);
      } else {
        const newTime = useEventStore.getState().time + 1;
        setTime(newTime);
      }
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, [started, finished]);

  useEffect(() => {
    if (!started || finished || !user) return;

    const newDistance =
      distanceTraveled > TOTAL_DISTANCE ? TOTAL_DISTANCE : distanceTraveled;
    throttleAddScoreToEvent(
      CURRENT_EVENT,
      'update',
      { uid: user.uid },
      {
        finishTime: useEventStore.getState().time,
        distanceTraveled: newDistance,
      },
    );
  }, [started, finished, distanceTraveled, user]);

  useEffect(() => {
    if (!started || finished) return;
    const distanceTimer = setInterval(() => {
      if (finished) {
        clearInterval(distanceTimer);
      } else {
        const bonusSpeed =
          speed === 50
            ? 0
            : speed === 75
              ? 1
              : speed === 100
                ? 2
                : speed === 125
                  ? 3
                  : 5;
        const newDistance = distanceTraveled + 1 + bonusSpeed;
        setDistanceTraveled(newDistance);
      }
    }, 500);

    if (distanceTraveled >= TOTAL_DISTANCE) {
      finish();
      clearInterval(distanceTimer);
    }

    return () => {
      clearInterval(distanceTimer);
    };
  }, [started, finished, distanceTraveled]);

  useEffect(() => {
    gsap.set('.swimmer-surface', {
      y: 60,
    });
    goToAndStop(0, true);
    setTimeout(() => {
      start();
    }, 2000);
  }, []);

  useEffect(() => {
    if (started && !finished) {
      playSegments([0, 60], true);
      timeline.current = gsap.timeline({ paused: true, repeat: -1 });
      timeline.current.to(crowd.current, { x: -800, ease: 'none' });
      timeline.current.duration(2).play();

      gsap.to('.swimmer-surface', {
        y: 0,
        duration: 1,
        delay: 2,
        ease: 'linear',
      });

      gsap.to('.podium', {
        x: -160,
        duration: 0.5,
        ease: 'linear',
      });
    }
  }, [started]);

  useEffect(() => {
    if (!timeline.current) return;
    if (!started || finished) return;
    switch (speed) {
      case 50:
        gsap.to(swimmerContainer.current, {
          x: -300,
          duration: 1,
          ease: 'linear',
        });
        timeline.current.duration(3);
        setSpeedTwo(0.8);
        break;
      case 75:
        gsap.to(swimmerContainer.current, {
          x: -150,
          duration: 1,
          ease: 'linear',
        });
        timeline.current.duration(2.5);
        setSpeedTwo(1);
        break;
      case 100:
        gsap.to(swimmerContainer.current, {
          x: 0,
          duration: 1,
          ease: 'linear',
        });
        timeline.current.duration(2);
        setSpeedTwo(1.2);
        break;
      case 125:
        gsap.to(swimmerContainer.current, {
          x: 150,
          duration: 1,
          ease: 'linear',
        });
        timeline.current.duration(1.5);
        setSpeedTwo(1.4);
        break;
      case 150:
        gsap.to(swimmerContainer.current, {
          x: 300,
          duration: 1,
          ease: 'linear',
        });
        timeline.current.duration(1);
        setSpeedTwo(1.6);
        break;
      default:
        null;
        break;
    }
  }, [speed, started]);

  useEffect(() => {
    if (finished) {
      gsap.to(swimmerContainer.current, {
        x: 600,
        duration: 3,
        ease: 'linear',
        onComplete: () => {
          const duration = 15 * TOTAL_DISTANCE;
          const animationEnd = Date.now() + duration;
          const defaults = {
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            zIndex: 0,
            scalar: 2,
          };

          function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min;
          }

          const interval: NodeJS.Timeout = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
              return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti({
              ...defaults,
              particleCount,
              origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            });
            confetti({
              ...defaults,
              particleCount,
              origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            });
          }, 250);
          if (!timeline.current) return;
          timeline.current.pause();
          timeline.current.kill();
        },
      });
    }
  }, [finished]);

  return (
    <>
      <div className="crowd absolute left-0 top-0 z-10 h-auto w-full">
        <div ref={crowd} className="crowd-array relative -top-16">
          <img
            ref={singleCrowd}
            src={crowdGif}
            className="absolute inline-block h-auto w-[800px]"
            alt=""
          />
          <img
            src={crowdGif}
            className="absolute left-[calc(100%-1px)] top-0 inline-block h-auto w-[800px]"
            alt=""
          />
        </div>
      </div>
      <div className="track absolute bottom-0 left-0 z-20 h-36 w-full bg-[#00BBDE]"></div>
      <div className="track absolute -bottom-14 left-0 z-30 h-36 w-full bg-[#00BBDE]"></div>
      <div className="top-50 absolute z-40">
        <>{SwimmerOneView}</>
      </div>
      <div className="player absolute bottom-10 left-[calc(50%-160px)] z-20">
        <div
          ref={swimmerContainer}
          className="swimmer relative top-16 h-80 w-80"
        >
          <div className="swimmer-surface top-26 absolute z-20 h-full w-full">
            <>{SwimmerTwoView}</>
          </div>
        </div>
      </div>
      <div className="podium floor-tile absolute bottom-0 left-0 z-30 h-36 w-40 bg-gray-200"></div>
      <div className="stats">
        <div className="timer absolute left-10 top-10 z-30">
          <Timer />
        </div>
        <div className="speed absolute bottom-2 right-6 z-30 flex h-6 w-80 items-center gap-4">
          <span>SPEED</span>
          <progress
            className={cn(
              'nes-progress !h-[20px] !bg-transparent',
              speed === 50
                ? 'is-error'
                : speed === 75
                  ? 'is-warning'
                  : speed === 150
                    ? 'is-success'
                    : 'is-primary',
            )}
            value={((speed - 20) / (150 - 20)) * 100}
            max="100"
          ></progress>
        </div>
        <div className="distance">
          <div className="distance-traveled absolute bottom-3 left-3 z-30">
            <span className="text-white">DISTANCE </span>
            <span className="text-white">{getDistance(distanceTraveled)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
