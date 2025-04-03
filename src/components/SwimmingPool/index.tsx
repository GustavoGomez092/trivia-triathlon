import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { getUsername, TOTAL_DISTANCE, getSanitizedEmail } from '@/lib/utils';
import { Tooltip, TooltipProps } from '@/components/ui/tooltip';
import { UserScore } from '@/firebase/hooks/useTopUsersForEvent';
import controlPanel from '@/assets/images/controlPanel.png';
import nsLogo from '@/assets/images/NS-logo-cropped.png';
import pool from '@/assets/images/pool.png';
import { Label } from '@/components/ui/label';

gsap.registerPlugin(MotionPathPlugin);

interface Player {
  color: string;
  distance: number;
  email: string;
  id: number;
  lane: number;
  name: string;
}

interface SwimmingPoolProps {
  loading: boolean;
  scores: UserScore[];
  selectedEmail: string | null;
}

const SwimmingPool: React.FC<SwimmingPoolProps> = ({
  loading,
  scores,
  selectedEmail,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const circleRefs = useRef<(SVGCircleElement | null)[]>([]);
  const playerTweens = useRef<gsap.core.Timeline[]>([]);

  const [players, setPlayers] = useState<Player[]>([]);
  const [tooltip, setTooltip] = useState<TooltipProps>({
    visible: false,
    x: 0,
    y: 0,
    name: '',
    distance: 0,
  });

  useEffect(() => {
    const newPlayers: Player[] = scores.map((score, index) => ({
      id: index,
      lane: index % 9,
      distance: score.score.distanceTraveled || 0,
      color: `hsl(${(index * 360) / (scores.length || 20)}, 100%, 50%)`,
      email: score.email,
      name: score.userName,
    }));
    setPlayers(newPlayers);
  }, [scores]);

  useEffect(() => {
    const lanes = Array.from(document.querySelectorAll('.lane'));
    players.forEach((player) => {
      const lane = lanes[player.lane] as SVGPathElement;
      if (lane && circleRefs.current[player.id]) {
        const timeline = gsap.timeline({ paused: true });

        timeline.to(circleRefs.current[player.id], {
          motionPath: {
            path: lane,
            align: lane,
            autoRotate: false,
            alignOrigin: [0.5, 0.5],
            start: 0,
            end: 1,
          },
          duration: 5,
          ease: 'none',
        });

        timeline.to(circleRefs.current[player.id], {
          motionPath: {
            path: lane,
            align: lane,
            autoRotate: false,
            alignOrigin: [0.5, 0.5],
            start: 1,
            end: 0,
          },
          duration: 5,
          ease: 'none',
        });

        playerTweens.current[player.id] = timeline;
        timeline.progress(player.distance / TOTAL_DISTANCE);
      }
    });
  }, [players]);

  useEffect(() => {
    players.forEach((player) => {
      playerTweens.current[player.id]?.progress(
        player.distance / TOTAL_DISTANCE,
      );
    });
  }, [players]);

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
        name: player.name || getUsername(player.email),
        distance: player.distance,
      });
    }
  };

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
      setTooltip({ visible: false, x: 0, y: 0, name: '', distance: 0 });
    }
  };

  useEffect(() => {
    players.forEach((player) => {
      const circle = circleRefs.current[player.id];
      if (circle) {
        if (!selectedEmail) {
          gsap.to(circle, { opacity: 0.7, scale: 1, duration: 0.2 });
        } else if (
          getSanitizedEmail(player.email) === getSanitizedEmail(selectedEmail)
        ) {
          gsap.to(circle, { opacity: 1, scale: 1.4, duration: 0.2 });
        } else {
          gsap.to(circle, { opacity: 0.5, scale: 1, duration: 0.2 });
        }
      }
    });
  }, [selectedEmail, players]);

  return (
    <div className="player-game h-8/12 nes-container is-rounded flex max-h-[576px] max-w-[1024px] items-center justify-start gap-8 self-start overflow-hidden bg-[#61696B] lg:self-center">
      <div className="interface nes-container is-rounded relative top-2 h-[520px] max-h-[520px] min-h-[520px] w-[800px] min-w-[800px] max-w-[800px] overflow-hidden bg-green-900 !p-0">
        {loading ? (
          <Label className="text-white" htmlFor="loading">
            Loading...
          </Label>
        ) : (
          <div
            ref={containerRef}
            className="relative flex items-center justify-center"
          >
            <div className="relative h-[520px] w-[800px]">
              <img
                src={pool}
                alt="Pool"
                className="pointer-events-none absolute left-0 top-0 h-full w-full object-cover"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="800"
                height="520"
                viewBox="0 0 800 520"
                className="pointer-events-none absolute left-0 top-0 h-full w-full"
              >
                <g transform="matrix(1 0 0 1 396.83 103.83)">
                  <path
                    className="lane"
                    d="M -370.5 1 L 370.5 -1"
                    stroke="transparent"
                    strokeWidth="2"
                    fill="none"
                  />
                </g>
                <g transform="matrix(1 0 0 1 396.5 257.83)">
                  <path
                    className="lane"
                    d="M -370.5 1 L 370.5 -1"
                    stroke="transparent"
                    strokeWidth="2"
                    fill="none"
                  />
                </g>
                <g transform="matrix(1 0 0 1 397.5 155.83)">
                  <path
                    className="lane"
                    d="M -370.5 1 L 370.5 -1"
                    stroke="red"
                    strokeWidth="2"
                    fill="none"
                  />
                </g>
                <g transform="matrix(1 0 0 1 396.5 307.5)">
                  <path
                    className="lane"
                    d="M -370.5 1 L 370.5 -1"
                    stroke="red"
                    strokeWidth="2"
                    fill="none"
                  />
                </g>
                <g transform="matrix(1 0 0 1 396.5 359.5)">
                  <path
                    className="lane"
                    d="M -370.5 1 L 370.5 -1"
                    stroke="red"
                    strokeWidth="2"
                    fill="none"
                  />
                </g>
                <g transform="matrix(1 0 0 1 396.5 406.5)">
                  <path
                    className="lane"
                    d="M -370.5 1 L 370.5 -1"
                    stroke="red"
                    strokeWidth="2"
                    fill="none"
                  />
                </g>
                <g transform="matrix(1 0 0 1 396.5 467.5)">
                  <path
                    className="lane"
                    d="M -370.5 1 L 370.5 -1"
                    stroke="red"
                    strokeWidth="2"
                    fill="none"
                  />
                </g>
                <g transform="matrix(1 0 0 1 396.83 207.5)">
                  <path
                    className="lane"
                    d="M -370.5 1 L 370.5 -1"
                    stroke="red"
                    strokeWidth="2"
                    fill="none"
                  />
                </g>
                <g transform="matrix(1 0 0 1 396.5 48.83)">
                  <path
                    className="lane"
                    d="M -370.5 1 L 370.5 -1"
                    stroke="red"
                    strokeWidth="2"
                    fill="none"
                  />
                </g>
              </svg>
              {players.map((player) => (
                <svg
                  key={player.id}
                  className="absolute left-0 top-0 h-full w-full"
                  viewBox="0 0 800 520"
                  style={{ overflow: 'visible', pointerEvents: 'none' }}
                >
                  <circle
                    ref={(el) => (circleRefs.current[player.id] = el)}
                    cx="0"
                    cy="0"
                    r="10"
                    fill={player.color}
                    opacity="0.7"
                    stroke="white"
                    strokeWidth="2"
                    onMouseEnter={(e) => handleCircleMouseEnter(e, player)}
                    onMouseMove={(e) => handleCircleMouseMove(e, player)}
                    onMouseLeave={() => handleCircleMouseLeave(player)}
                  />
                </svg>
              ))}
              {tooltip.visible && (
                <div
                  className="absolute z-50"
                  style={{ left: tooltip.x, top: tooltip.y }}
                >
                  <Tooltip {...tooltip} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="knobs hidden h-full flex-col items-center justify-center gap-8 2xl:flex">
        <img src={controlPanel} className="relative top-2 w-[130px]" alt="" />
        <img src={nsLogo} className="mb-4 h-12 w-auto" alt="" />
      </div>
    </div>
  );
};

export { SwimmingPool };
