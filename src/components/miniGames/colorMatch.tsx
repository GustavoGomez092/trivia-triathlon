import { useEffect, FC } from 'react';
import useColorMatchStore, { ColorType } from '@/stores/colorMatchStore';
import useEventStore from '@/stores/eventStore';
import { cn } from '@/lib/utils';

const ColorMatch: FC = () => {
    const {
        started,
        finished,
        passed,
        timeLeft,
        correctMatches,
        currentWord,
        targetMatches,
        start,
        handleKeyPress,
        setTimeLeft,
        reset,
        finish
    } = useColorMatchStore();

    const colorMap: Record<ColorType, string> = {
        'RED': 'text-red-400',
        'BLUE': 'text-blue-400',
        'GREEN': 'text-green-400',
        'YELLOW': 'text-yellow-400'
    };

    useEffect(() => {
        start();
        return () => reset();
    }, [start, reset]);

    const { speedIncrease, speedDecrease } = useEventStore();

    useEffect(() => {
        if (!started || finished) return;

        const timerId = setInterval(() => {
            if (timeLeft <= 1) {
                clearInterval(timerId);
                if (!finished) {
                    finish(false); // Game over, not passed
                    speedDecrease();
                }
            } else {
                setTimeLeft(timeLeft - 1);
            }
        }, 1000);

        return () => clearInterval(timerId);
    }, [started, finished, timeLeft, setTimeLeft, speedDecrease, finish]);

    useEffect(() => {
        if (!started || finished) return;

        const handleKey = (event: KeyboardEvent) => {
            if (event.key.startsWith('Arrow')) {
                event.preventDefault();
                handleKeyPress(event.key);
            }
        };

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [started, finished, handleKeyPress]);

    // Handle win condition and reset
    useEffect(() => {
        if (!finished) return;

        // Only call speedIncrease on successful completion
        if (passed) {
            speedIncrease();
        }

        // Always reset after a delay
        const resetTimer = setTimeout(reset, 1000);
        return () => clearTimeout(resetTimer);
    }, [finished, passed, speedIncrease, reset]);

    if (finished) {
        return (
            <div className="nes-container is-rounded flex min-h-full w-full flex-col items-center justify-center bg-slate-800 p-8">
                <h1 className="mb-4 text-2xl font-bold text-white">Color Match</h1>
                <div className="flex flex-col items-center justify-center gap-4">
                    <h2 className={cn(
                        'text-center text-4xl font-bold',
                        passed ? 'text-green-400' : 'text-red-400'
                    )}>
                        {passed ? 'You passed!' : 'Better luck next time!'}
                    </h2>
                </div>
            </div>
        );
    }

    return (
        <div className="nes-container is-rounded relative z-50 min-h-full w-full overflow-hidden bg-slate-800">
            <div className="relative flex min-h-full w-full flex-col gap-3 p-3 text-center">
                {/* Game stats */}
                <div className="flex items-center justify-between text-sm text-slate-300">
                    <div>
                        Matches: <span className="font-bold text-white">{correctMatches}/{targetMatches}</span>
                    </div>
                    <div>
                        Time: <span className={cn('font-bold text-white', timeLeft <= 5 && 'text-red-400')}>{timeLeft}s</span>
                    </div>
                </div>

                {/* Current word */}
                {currentWord && (
                    <div className="flex h-20 w-full items-center justify-center rounded-lg bg-slate-900/50 shadow-lg ring-1 ring-white/10">
                        <div className={cn(
                            'text-6xl font-black transition-colors duration-300',
                            colorMap[currentWord.color]
                        )}>
                            {currentWord.word}
                        </div>
                    </div>
                )}

                {/* Controls guide */}
                <div className="grid w-full grid-cols-2 gap-3 text-sm md:grid-cols-4">
                    <div className="flex flex-col items-center gap-1">
                        <span className="nes-btn is-small flex h-10 w-10 items-center justify-center text-xl font-bold bg-slate-900/50 shadow-lg ring-1 ring-white/10 hover:bg-slate-900/70 transition-colors">
                            ⬅
                        </span>
                        <span className="text-red-400 font-semibold">Red</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="nes-btn is-small flex h-10 w-10 items-center justify-center text-xl font-bold bg-slate-900/50 shadow-lg ring-1 ring-white/10 hover:bg-slate-900/70 transition-colors">
                            ⬆
                        </span>
                        <span className="text-blue-400 font-semibold">Blue</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="nes-btn is-small flex h-10 w-10 items-center justify-center text-xl font-bold bg-slate-900/50 shadow-lg ring-1 ring-white/10 hover:bg-slate-900/70 transition-colors">
                            ⮕
                        </span>
                        <span className="text-green-400 font-semibold">Green</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="nes-btn is-small flex h-10 w-10 items-center justify-center text-xl font-bold bg-slate-900/50 shadow-lg ring-1 ring-white/10 hover:bg-slate-900/70 transition-colors">
                            ⬇
                        </span>
                        <span className="text-yellow-400 font-semibold">Yellow</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ColorMatch;
