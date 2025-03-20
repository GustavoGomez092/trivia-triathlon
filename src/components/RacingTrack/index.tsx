import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { TOTAL_DISTANCE } from '@/lib/utils';
import { Tooltip, TooltipProps } from '@/components/ui/tooltip';
import { UserScore } from '@/firebase/hooks/useTopUsersForGame';
import racingTrack from '@/assets/images/racing-track.svg';

gsap.registerPlugin(MotionPathPlugin);

interface Player {
  id: number;
  lane: number;
  distance: number;
  color: string;
  email: string;
}

interface RacingTrackProps {
  scores: UserScore[];
  selectedEmail: string | null;
}

export const RacingTrack: React.FC<RacingTrackProps> = ({
  scores,
  selectedEmail,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const circleRefs = useRef<(SVGCircleElement | null)[]>([]);
  const playerTweens = useRef<gsap.core.Tween[]>([]);

  const [players, setPlayers] = useState<Player[]>([]);
  const [tooltip, setTooltip] = useState<TooltipProps>({
    visible: false,
    x: 0,
    y: 0,
    email: '',
    distance: '0',
  });

  // Convert real score data to players.
  useEffect(() => {
    const newPlayers: Player[] = scores.map((score, index) => ({
      id: index,
      lane: index % 5,
      distance: score.score.distanceTraveled || 0,
      // Compute a color based on index (you can adjust the divisor if needed)
      color: `hsl(${(index * 360) / (scores.length || 20)}, 100%, 50%)`,
      email: score.email,
    }));
    setPlayers(newPlayers);
  }, [scores]);

  // Set up GSAP tweens for each circle once players are set.
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
            start: -0.48,
            end: 0.355,
          },
          duration: 5,
          paused: true,
          ease: 'none',
        });
        playerTweens.current[player.id] = tween;
        tween.progress(player.distance / TOTAL_DISTANCE);
      }
    });
  }, [players]);

  // When players change, update tween progress.
  useEffect(() => {
    players.forEach((player) => {
      playerTweens.current[player.id].progress(
        player.distance / TOTAL_DISTANCE,
      );
    });
  }, [players]);

  // Update tooltip position based on the circle's bounding box.
  const updateTooltipFromCircle = (player: Player) => {
    const circle = circleRefs.current[player.id];
    const container = containerRef.current;
    if (circle && container) {
      const circleRect = circle.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setTooltip({
        visible: true,
        x: circleRect.left - containerRect.left + circleRect.width / 2 - 50,
        y: circleRect.top - containerRect.top - 10,
        email: player.email,
        distance: player.distance.toFixed(0),
      });
    }
  };

  // Circle hover events.
  const handleCircleMouseEnter = (
    _e: React.MouseEvent<SVGCircleElement, MouseEvent>,
    player: Player,
  ) => {
    if (!selectedEmail) {
      const circle = circleRefs.current[player.id];
      if (circle) {
        gsap.to(circle, { opacity: 1, scale: 1.4, duration: 0.2 });

        updateTooltipFromCircle(player);
      }
    }
  };

  const handleCircleMouseMove = (
    _e: React.MouseEvent<SVGCircleElement, MouseEvent>,
    player: Player,
  ) => {
    if (!selectedEmail) {
      updateTooltipFromCircle(player);
    }
  };

  const handleCircleMouseLeave = (player: Player) => {
    if (!selectedEmail) {
      const circle = circleRefs.current[player.id];
      if (circle) {
        gsap.to(circle, { scale: 1, opacity: 0.5, duration: 0.2 });
      }
      setTooltip({ visible: false, x: 0, y: 0, email: '', distance: '0' });
    }
  };

  // Update circle styles based on selectedEmail.
  useEffect(() => {
    players.forEach((player) => {
      const circle = circleRefs.current[player.id];
      if (circle) {
        if (!selectedEmail) {
          gsap.to(circle, { opacity: 0.7, scale: 1, duration: 0.2 });
        } else if (player.email === selectedEmail) {
          gsap.to(circle, { opacity: 1, scale: 1.4, duration: 0.2 });
        } else {
          gsap.to(circle, { opacity: 0.5, scale: 1, duration: 0.2 });
        }
      }
    });
  }, [selectedEmail, players]);

  return (
    <div className="nes-container is-dark with-title">
      <p className="title">Nicasource TV</p>
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
            <image href={racingTrack} width="640" height="480" />
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
          {tooltip.visible && <Tooltip {...tooltip} />}
        </div>
      </div>
    </div>
  );
};
