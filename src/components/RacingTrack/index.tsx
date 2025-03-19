import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

interface Player {
  id: number;
  lane: number;
  distance: number;
  color: string;
  email: string;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  email: string;
  distance: string;
}

export const RacingTrack: React.FC = () => {
  // Container ref for relative positioning.
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Refs for the SVG circles.
  const circleRefs = useRef<(SVGCircleElement | null)[]>([]);
  // Tween refs.
  const playerTweens = useRef<gsap.core.Tween[]>([]);

  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    email: '',
    distance: '0',
  });

  // Create 20 players with unique emails and colors.
  useEffect(() => {
    const initialPlayers: Player[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      lane: i % 5,
      distance: 0,
      color: `hsl(${(i * 360) / 20}, 100%, 50%)`,
      email: `player${i}@example.com`,
    }));
    setPlayers(initialPlayers);
  }, []);

  // Set up GSAP tweens for each circle once players exist.
  useEffect(() => {
    const lanes = Array.from(document.querySelectorAll('.lane'));
    players.forEach((player) => {
      const lane = lanes[player.lane] as SVGPathElement;
      if (lane && circleRefs.current[player.id]) {
        const tween = gsap.to(circleRefs.current[player.id], {
          motionPath: {
            path: lane,
            align: lane,
            autoRotate: true,
            alignOrigin: [0.5, 0.5],
            start: -0.48, // maps to 0% progress
            end: 0.345, // maps to 100% progress
          },
          duration: 5, // Dummy duration; progress is controlled manually.
          paused: true,
          ease: 'none',
        });
        playerTweens.current[player.id] = tween;
      }
    });
  }, [players]);

  // Simulate realtime updates.
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayers((prevPlayers) => {
        const updated = prevPlayers.map((player) => {
          let newDistance = player.distance + Math.random() * 10;
          if (newDistance > 1000) newDistance = 1000;
          return { ...player, distance: newDistance };
        });
        updated.forEach((player) => {
          if (playerTweens.current[player.id] !== undefined) {
            playerTweens.current[player.id].progress(player.distance / 1000);
          }
        });
        return updated;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Update tooltip position based on the circle's bounding box.
  const updateTooltipFromCircle = (player: Player) => {
    const circle = circleRefs.current[player.id];
    const container = containerRef.current;
    if (circle && container) {
      const circleRect = circle.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setTooltip({
        visible: true,
        x: circleRect.left - containerRect.left + circleRect.width / 2,
        y: circleRect.top - containerRect.top - 10,
        email: player.email,
        distance: player.distance.toFixed(0),
      });
    }
  };

  // Circle hover events.
  const handleCircleMouseEnter = (
    e: React.MouseEvent<SVGCircleElement, MouseEvent>,
    player: Player,
  ) => {
    if (!selectedPlayerId) {
      const circle = circleRefs.current[player.id];
      if (circle) {
        gsap.to(circle, { scale: 1.2, duration: 0.2 });
        gsap.to(circle, {
          attr: { stroke: 'black', strokeWidth: 2 },
          duration: 0.2,
        });
        updateTooltipFromCircle(player);
      }
    }
  };

  const handleCircleMouseMove = (
    e: React.MouseEvent<SVGCircleElement, MouseEvent>,
    player: Player,
  ) => {
    if (!selectedPlayerId) {
      updateTooltipFromCircle(player);
    }
  };

  const handleCircleMouseLeave = (player: Player) => {
    if (!selectedPlayerId) {
      const circle = circleRefs.current[player.id];
      if (circle) {
        gsap.to(circle, { scale: 1, duration: 0.2 });
        gsap.to(circle, {
          attr: { stroke: 'none', strokeWidth: 0 },
          duration: 0.2,
        });
      }
      setTooltip({ visible: false, x: 0, y: 0, email: '', distance: '0' });
    }
  };

  return (
    // Outer TV screen container with a big top border and medium side/bottom borders, non-rounded.

    <div className="nes-container is-dark with-title">
      <p className="title">Nicasource TV</p>

      {/* Center the SVG track */}
      <div
        ref={containerRef}
        className="relative flex items-center justify-center p-5"
      >
        <div className="relative">
          <svg
            style={{ imageRendering: 'pixelated' }}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            width="640"
            height="480"
            viewBox="0 0 640 480"
            xmlSpace="preserve"
          >
            <image
              href="https://res.cloudinary.com/reymundotenorio/image/upload/v1742266987/BANP/racing-track.svg"
              width="640"
              height="480"
            />
            {/* Racetrack Paths (5 lanes) */}
            {[...Array(5)].map((_, index) => (
              <g
                key={index}
                transform={`matrix(${1 + index * 0.1} 0 0 ${
                  1 + index * 0.15
                } 310.4 247.2)`}
              >
                <path
                  className="lane"
                  style={{
                    stroke: 'transparent',
                    strokeWidth: 2,
                    fill: 'none',
                  }}
                  vectorEffect="non-scaling-stroke"
                  transform="translate(-309.4, -246.2)"
                  d="M 193.4 143.2 L 424.2 143.6 Q 506.2 159.2 511 243.2 Q 505.8 336 421.4 349.2 L 208.6 349.2 Q 112.6 341.2 107.8 247.2 Q 108.6 159.6 193.4 143.2"
                />
              </g>
            ))}
            {/* Player Circles */}
            {players.map((player) => (
              <circle
                key={player.id}
                ref={(el) => (circleRefs.current[player.id] = el)}
                cx="640"
                cy="240"
                r="10"
                fill={player.color}
                opacity="0.7"
                onMouseEnter={(e) => handleCircleMouseEnter(e, player)}
                onMouseMove={(e) => handleCircleMouseMove(e, player)}
                onMouseLeave={() => handleCircleMouseLeave(player)}
              />
            ))}
          </svg>
          {tooltip.visible && (
            <div
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-full transform whitespace-nowrap rounded bg-black bg-opacity-70 px-2 py-1 text-xs text-white"
              style={{ left: tooltip.x, top: tooltip.y }}
            >
              <div>
                <strong>{tooltip.email}</strong>
              </div>
              <div>{tooltip.distance} m</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
