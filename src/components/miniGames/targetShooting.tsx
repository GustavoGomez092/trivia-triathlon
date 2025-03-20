import useSprintStore from '@/stores/sprintStore';
import useTargetShootingStore from '@/stores/targetShootingStore';
import { useEffect, useRef, useCallback, FC } from 'react';

type TargetCoordinates = {
  x: number;
  y: number;
};

const TOTAL_SCORE = 10;

const TargetShooting: FC = () => {
  const {
    score,
    showTarget,
    gameActive,
    speed,
    passed,
    reset,
    setPassed,
    increaseScore,
    setShowTarget,
    setGameActive,
    increaseSpeed,
    decreaseSpeed,
  } = useTargetShootingStore();

  const cursorRef = useRef<SVGSVGElement | null>(null);
  const clayTargetRef = useRef<SVGSVGElement | null>(null);
  const shootAnimationRef = useRef<SVGAnimateElement | null>(null);
  const gameContainerRef = useRef<HTMLDivElement | null>(null);
  const intervalIdRef = useRef<number | null>(null);

  const { speedIncrease, speedDecrease } = useSprintStore();

  useEffect(() => {
    setPassed(false);
  }, []);

  useEffect(() => {
    if (score === TOTAL_SCORE) {
      setPassed(true);
    }
  }, [score, setPassed]);

  useEffect(() => {
    if (passed) {
      setTimeout(() => {
        reset();
      }, 1000);
    }
  }, [passed, reset]);

  // Function to position the target
  const positionTarget = useCallback((): TargetCoordinates => {
    if (!clayTargetRef.current || !gameContainerRef.current)
      return { x: 0, y: 0 };

    const xCoor = Math.floor(Math.random() * 141) - 20;
    const yCoor = Math.floor(Math.random() * -21) - 20;

    clayTargetRef.current.style.left = `${xCoor}%`;
    clayTargetRef.current.style.bottom = `${yCoor}%`;

    return { x: xCoor, y: yCoor };
  }, []);

  // Function to animate the target
  const pullTarget = useCallback(
    (coords: TargetCoordinates, newSpeed: number): void => {
      if (!clayTargetRef.current || !gameActive) return;

      let left = coords.x;
      let bottom = coords.y;

      const pullRight = left <= 50;
      const randomLeft = Math.floor(Math.random()) + newSpeed;
      const randomBottom = Math.floor(Math.random()) + newSpeed;

      // Clear any existing interval
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }

      // Using window.setInterval and storing the numeric ID
      intervalIdRef.current = window.setInterval(() => {
        if (pullRight) {
          left += randomLeft;
        } else {
          left -= randomLeft;
        }
        bottom += randomBottom;

        if (clayTargetRef.current) {
          clayTargetRef.current.style.left = `${left}%`;
          clayTargetRef.current.style.bottom = `${bottom}%`;
        }

        if (left >= 100 || left <= -10 || bottom >= 100) {
          if (intervalIdRef.current !== null) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;

            speedDecrease();
            decreaseSpeed();
          }

          if (gameActive) {
            const newCoords = positionTarget();
            pullTarget(newCoords, speed);
          }
        }
      }, 40);
    },
    [gameActive, positionTarget],
  );

  // Handle shoot animation
  const triggerShootAnimation = useCallback((): void => {
    if (shootAnimationRef.current) {
      shootAnimationRef.current.beginElement();
    }
  }, []);

  // Handle target hit
  const handleTargetHit = useCallback((): void => {
    if (!showTarget) return;

    increaseScore();
    speedIncrease();
    increaseSpeed();
    setShowTarget(false);

    if (intervalIdRef.current !== null) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }

    // Set a timeout to show a new target
    setTimeout(() => {
      if (gameActive) {
        setShowTarget(true);
        const newCoords = positionTarget();
        pullTarget(newCoords, speed);
      }
    }, 1000);
  }, [showTarget, gameActive, positionTarget, pullTarget]);

  // Track cursor movement
  const trackMovement = useCallback((e: MouseEvent): void => {
    if (cursorRef.current && gameContainerRef.current) {
      // Get bounding rectangle of the game container
      const rect = gameContainerRef.current.getBoundingClientRect();

      // Check if mouse is within the game container
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        cursorRef.current.style.display = 'block';
        cursorRef.current.style.left = `${e.clientX - 24}px`;
        cursorRef.current.style.top = `${e.clientY - 24}px`;
      } else {
        cursorRef.current.style.display = 'none';
      }
    }
  }, []);

  // Function to check if target was hit
  const checkTargetHit = useCallback(
    (e: MouseEvent): void => {
      if (!clayTargetRef.current || !showTarget || !gameContainerRef.current)
        return;

      // Get bounding rectangles
      const targetRect = clayTargetRef.current.getBoundingClientRect();
      const gameRect = gameContainerRef.current.getBoundingClientRect();

      // Check if click is within game container
      if (
        e.clientX < gameRect.left ||
        e.clientX > gameRect.right ||
        e.clientY < gameRect.top ||
        e.clientY > gameRect.bottom
      ) {
        return;
      }

      // Trigger shoot animation for any click within game area
      triggerShootAnimation();

      // Check if click is within target
      if (
        e.clientX >= targetRect.left &&
        e.clientX <= targetRect.right &&
        e.clientY >= targetRect.top &&
        e.clientY <= targetRect.bottom
      ) {
        handleTargetHit();
      }
    },
    [showTarget, triggerShootAnimation, handleTargetHit],
  );

  // Set up and clean up game
  useEffect(() => {
    setGameActive(true);

    // Initialize the target position and movement
    const coordinates = positionTarget();
    pullTarget(coordinates, speed);

    // Set up event listeners
    window.addEventListener('mousemove', trackMovement);
    window.addEventListener('click', checkTargetHit);

    // Cleanup function
    return () => {
      window.removeEventListener('mousemove', trackMovement);
      window.removeEventListener('click', checkTargetHit);

      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }

      setGameActive(false);
    };
  }, [positionTarget, pullTarget, trackMovement, checkTargetHit]);

  if (passed) {
    return (
      <div className="nes-container is-rounded flex min-h-full w-full flex-col items-center justify-center bg-gray-200 p-8">
        <h1 className="mb-4 text-2xl font-bold">Target Shooting</h1>
        <div className="flex flex-col items-center justify-center bg-gray-200 lg:flex-row">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-center text-4xl font-bold text-green-500">
              You passed!
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={gameContainerRef}
      className="nes-container is-rounded relative min-h-full w-full cursor-none overflow-hidden bg-gray-200"
    >
      {/* Custom cursor - positioned with fixed to ensure it's always on top */}
      <svg
        id="cursor"
        viewBox="0 0 100 100"
        className="pointer-events-none fixed z-50 h-12 w-12"
        ref={cursorRef}
      >
        <circle
          cx="50"
          cy="50"
          r="30"
          fill="none"
          stroke="#F84A64"
          strokeWidth="10"
        >
          <animate
            id="shoot"
            attributeName="r"
            begin="indefinite"
            dur="0.1s"
            from="30"
            to="40"
            fill="freeze"
            ref={shootAnimationRef}
          />
          <animate
            attributeName="r"
            begin="shoot.end"
            dur="0.1s"
            from="40"
            to="30"
            fill="freeze"
          />
        </circle>
        <path
          d="M 50 0 v 20 Z M 50 80 v 20"
          stroke="#F84A64"
          strokeWidth="10"
        />
        <path
          d="M 0 50 h 20 Z M 80 50 h 20"
          stroke="#F84A64"
          strokeWidth="10"
        />
      </svg>

      {/* Main container */}
      <div
        className="relative min-h-full w-full px-4 pt-8 text-center"
        data-score={score}
      >
        {/* Clay target - using absolute positioning */}
        <svg
          id="clay-target"
          viewBox="0 0 50 20"
          className={`absolute h-10 w-24 ${
            showTarget ? 'inline-block' : 'hidden'
          }`}
          ref={clayTargetRef}
          style={{ position: 'absolute' }}
          pointerEvents="none"
        >
          <defs>
            <linearGradient id="gradient" x1="100%" y1="0" x2="0" y2="100%">
              <stop offset="0%" stopColor="#55BEFA" />
              <stop offset="50%" stopColor="#0e87cc" />
              <stop offset="100%" stopColor="#55BEFA" />
            </linearGradient>
          </defs>
          <ellipse
            className="target"
            cx="25"
            cy="10"
            rx="20"
            ry="10"
            fill="url(#gradient)"
            pointerEvents="none"
          />
        </svg>

        {/* Name of the game */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 transform text-2xl font-bold text-black">
          Target Shooting
        </div>

        {/* Score display */}
        <div className="text-1xl absolute bottom-0 right-0 font-bold text-black">
          Score: {score}/{TOTAL_SCORE}
        </div>
      </div>
    </div>
  );
};

export default TargetShooting;
