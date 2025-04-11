import { motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { useFinalLeaderboard } from '@/firebase/hooks/useFinalLeaderboard';
import { createFileRoute } from '@tanstack/react-router';
import './index.css';

const heightByPlace = {
  1: 300,
  2: 200,
  3: 144,
};

const podiumColors = {
  1: 'bg-[#FFD700]', // real gold
  2: 'bg-[#C0C0C0]', // real silver
  3: 'bg-[#CD7F32]', // real bronze
};

const iconPool = [
  'nes-mario',
  'nes-ash',
  'nes-bulbasaur',
  'nes-charmander',
  'nes-squirtle',
  'nes-kirby',
];

const WinnersPodium = () => {
  const { topPlayers, loading } = useFinalLeaderboard();

  const iconsByPlayer = useMemo(() => {
    const shuffled = [...iconPool].sort(() => 0.5 - Math.random());
    const assignments: Record<string, string> = {};
    topPlayers.forEach((player, index) => {
      assignments[player.name] = shuffled[index % shuffled.length];
    });
    return assignments;
  }, [topPlayers]);

  useEffect(() => {
    const fireworkSequence = setTimeout(() => {
      const shoot = () => {
        for (let i = 0; i < 5; i++) {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: {
              x: Math.random(),
              y: Math.random() * 0.5,
            },
          });
        }
      };
      shoot();
      const interval = setInterval(shoot, 1500);
      return () => clearInterval(interval);
    }, 4000);

    return () => clearTimeout(fireworkSequence);
  }, []);

  if (loading) return <div className="nes-text">Loading podium...</div>;

  return (
    <div className="winners-page h- relative flex h-screen w-full flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-sky-300 to-blue-500 p-8">
      <div className="nes-container is-rounded z-10 mb-6 w-auto bg-[#92cc41] px-6 py-2 text-center text-4xl uppercase text-blue-950 shadow-md">
        NS Trivia Triathlon Winners
      </div>

      <div className="relative z-10 mb-20 flex w-full max-w-4xl items-end justify-center gap-8">
        {[3, 2, 1].map((order, index) => {
          const player = topPlayers.find((p) => p.place === order);
          if (!player) return null;

          const { name, place } = player;
          const icon = iconsByPlayer[name];
          const height = heightByPlace[place];

          return (
            <div
              key={name}
              className={`relative flex flex-col items-center justify-end ${
                place === 1
                  ? 'z-10 order-2'
                  : place === 2
                    ? 'order-1'
                    : 'order-3'
              }`}
              style={{ height: height + 150 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 1 + 1.3,
                  duration: 1.2,
                  ease: 'easeOut',
                }}
                className=" mb-4 flex flex-col items-center justify-center gap-5"
              >
                <div className="nes-container is-rounded bg-white px-3 py-1 text-center text-xs font-bold text-black shadow">
                  {name}
                </div>
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    ease: 'easeInOut',
                  }}
                  className="text-4xl"
                >
                  <i className={icon}></i>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height, opacity: 1 }}
                transition={{
                  delay: index * 1,
                  duration: 1.2,
                  ease: 'easeOut',
                }}
                className={`absolute bottom-0 w-48 ${podiumColors[place]} nes-container is-rounded flex items-end justify-center overflow-hidden border border-black text-sm text-black`}
              >
                <span className="text-lg font-bold">
                  {place}
                  <sup className="align-super text-xs">o</sup>
                </span>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Route = createFileRoute('/winners/')({
  component: WinnersPodium,
});
