import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import confetti from 'canvas-confetti';
import { getUsername, getSanitizedEmail, TOTAL_DISTANCE } from '@/lib/utils';
import { Tooltip, TooltipProps } from '@/components/ui/tooltip';
import { UserScore } from '@/firebase/hooks/useTopUsersForEvent';
import controlPanel from '@/assets/images/controlPanel.png';
import nsLogo from '@/assets/images/NS-logo-cropped.png';
import americaMap from '@/assets/images/america-continent.png';
import { Label } from '@/components/ui/label';

gsap.registerPlugin(MotionPathPlugin);

interface Player {
  color: string;
  distance: number;
  email: string;
  id: number;
  name: string;
}

interface CyclingRouteProps {
  loading: boolean;
  scores: UserScore[];
  selectedEmail: string | null;
}

const CyclingRoute: React.FC<CyclingRouteProps> = ({
  loading,
  scores,
  selectedEmail,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const circleRefs = useRef<(SVGCircleElement | null)[]>([]);
  const playerTweens = useRef<gsap.core.Timeline[]>([]);

  const [players, setPlayers] = useState<Player[]>([]);
  const [hoveredPlayerId, setHoveredPlayerId] = useState<number | null>(null);
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
      distance: score.score.distanceTraveled || 0,
      color: `hsl(${(index * 360) / (scores.length || 20)}, 100%, 50%)`,
      email: score.email,
      name: score.userName,
    }));
    setPlayers(newPlayers);
  }, [scores]);

  useEffect(() => {
    const lane = document.querySelector('.lane') as SVGPathElement;
    players.forEach((player) => {
      const circle = circleRefs.current[player.id];
      if (lane && circle) {
        const timeline = gsap.timeline({ paused: true });

        timeline.to(circle, {
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
          onUpdate: () => {
            if (
              player.distance >= TOTAL_DISTANCE &&
              !timeline.vars.data?.celebrated
            ) {
              timeline.vars.data = { celebrated: true };
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.7, x: 0.3 },
              });
            }
          },
        });

        playerTweens.current[player.id] = timeline;
        timeline.progress(player.distance / TOTAL_DISTANCE);

        const progress = player.distance / TOTAL_DISTANCE;
        if (progress === 0) {
          gsap.set(circle, {
            motionPath: {
              path: lane,
              align: lane,
              autoRotate: false,
              alignOrigin: [0.5, 0.5],
              start: 0,
              end: 0.0001,
            },
          });
        }
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
        x: circleRect.left - containerRect.left + circleRect.width / 2,
        y: circleRect.top - containerRect.top + circleRect.height + 50,
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
        setHoveredPlayerId(player.id);
        gsap.to(circle, {
          opacity: 1,
          scale: 1.4,
          duration: 0.2,
          overwrite: 'auto',
        });
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
        setHoveredPlayerId(null);
        gsap.to(circle, {
          scale: 1,
          opacity: 0.5,
          duration: 0.2,
          overwrite: 'auto',
        });
      }
      setTooltip((prev) => ({ ...prev, visible: false }));
    }
  };

  useEffect(() => {
    players.forEach((player) => {
      const circle = circleRefs.current[player.id];
      if (circle && hoveredPlayerId !== player.id) {
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
  }, [selectedEmail, players, hoveredPlayerId]);

  const flags = [
    { x: 386, y: 603, emoji: '🇦🇷' }, // Argentina
    { x: 477, y: 435, emoji: '🇧🇷' }, // Brazil
    { x: 333, y: 420, emoji: '🇪🇨' }, // Ecuador
    { x: 296, y: 351, emoji: '🇳🇮' }, // Nicaragua
    { x: 238, y: 311, emoji: '🇲🇽' }, // Mexico
    { x: 211, y: 238, emoji: '🇺🇸' }, // USA/Utah
  ];

  return (
    <div className="player-game nes-container is-rounded flex h-[740px] max-h-[740px] max-w-[1024px] items-center justify-start gap-8 self-start overflow-visible bg-[#61696B] lg:self-center">
      <div className="interface nes-container is-rounded relative top-2 h-[660px] w-[800px] overflow-visible bg-green-900 !p-0">
        {loading ? (
          <Label className="text-white" htmlFor="loading">
            Loading...
          </Label>
        ) : (
          <div
            ref={containerRef}
            className="relative flex items-center justify-center"
          >
            <div className="relative h-[650px] w-[800px]">
              <img
                src={americaMap}
                alt="America Route"
                className="pointer-events-none absolute left-0 top-0 h-full w-full object-cover"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="800"
                height="650"
                viewBox="0 0 800 650"
                className="pointer-events-none absolute left-0 top-0 h-full w-full"
              >
                <g transform="matrix(1 0 0 1 345 421.5)">
                  <path
                    className="lane"
                    d="M 386 603 Q 382 465 477 435 Q 390 374 333 420 Q 351 411 296 351 Q 259 335 238 311 Q 266 243 211 238"
                    stroke="transparent"
                    strokeWidth="2"
                    fill="none"
                    vectorEffect="non-scaling-stroke"
                    transform="translate(-344, -420.5)"
                  />
                </g>
                {flags.map((pt, idx) => (
                  <text
                    key={idx}
                    x={pt.x}
                    y={pt.y}
                    fontSize="20px"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                  >
                    {pt.emoji}
                  </text>
                ))}
              </svg>
              <svg
                className="absolute left-0 top-0 h-full w-full"
                viewBox="0 0 800 650"
                style={{ overflow: 'visible' }}
              >
                {players.map((player) => (
                  <circle
                    key={player.id}
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
                    style={{ pointerEvents: 'all' }}
                  />
                ))}
              </svg>
              {tooltip.visible && <Tooltip {...tooltip} />}
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

export { CyclingRoute };
