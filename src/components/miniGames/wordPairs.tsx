import { useEffect, FC } from 'react';
import { cn } from '@/lib/utils';
import useWordPairsStore from '@/stores/wordPairsStore';

const WordPairs: FC = () => {
    const {
        started,
        finished,
        passed,
        score,
        timeLeft,
        leftWord,
        rightWord,
        targetScore,
        lives,
        start,
        handleAnswer,
        setTimeLeft,
    } = useWordPairsStore();

    // Start game and setup timer
    useEffect(() => {
        if (!started) {
            start();
        }

        const timer = setInterval(() => {
            if (started && !finished) {
                setTimeLeft(timeLeft - 1);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [started, finished, timeLeft, setTimeLeft, start]);

    // Game over screen
    if (finished && passed) {
        return (
            <div className="nes-container is-rounded flex min-h-full w-full flex-col items-center justify-center bg-gray-200 p-8">
                <h1 className="mb-4 text-2xl font-bold">Word Pairs</h1>
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-center text-4xl font-bold text-green-500">
                        You passed!
                    </h1>
                </div>
            </div>
        );
    }

    if (finished && !passed) {
        return (
            <div className="nes-container is-rounded flex min-h-full w-full flex-col items-center justify-center bg-gray-200 p-8">
                <h1 className="mb-4 text-2xl font-bold">Word Pairs</h1>
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-center text-4xl font-bold text-red-500">
                        Better luck next time!
                    </h1>
                </div>
            </div>
        );
    }

    return (
        <div className="nes-container is-rounded relative z-50 min-h-full w-full overflow-hidden bg-gray-100">
            {/* Game stats */}
            <div className="absolute top-4 left-0 right-0 flex items-center justify-between px-4">
                <div>
                    Score: <span className="font-bold">{score}/{targetScore}</span>
                </div>
                <div className="flex items-center gap-2">
                    Lives: <span className="font-bold text-red-500">{Array(lives).fill('❤️').join('')}</span>
                </div>
                <div>
                    Time: <span className={cn('font-bold', timeLeft <= 10 && 'text-red-600')}>{timeLeft}s</span>
                </div>
            </div>

            {/* Game area */}
            <div className="flex h-[300px] w-full flex-col items-center justify-center gap-8">

                {/* Words display */}
                <div className="flex w-full items-center justify-center gap-8">
                    <div className="flex h-24 w-64 items-center justify-center rounded-lg bg-blue-100 text-xl font-bold shadow-lg hover:bg-blue-200 transition-colors px-4">
                        {leftWord}
                    </div>
                    <div className="text-2xl font-bold text-gray-400">vs</div>
                    <div className="flex h-24 w-64 items-center justify-center rounded-lg bg-blue-100 text-xl font-bold shadow-lg hover:bg-blue-200 transition-colors px-4">
                        {rightWord}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-6">
                    <button
                        onClick={() => handleAnswer(true)}
                        type="button"
                        disabled={finished}
                        className={cn(
                            'nes-btn is-success pointer-events-auto h-16 w-40 text-xl font-bold',
                            finished && 'opacity-50'
                        )}
                    >
                        Match!
                    </button>
                    <button
                        onClick={() => handleAnswer(false)}
                        type="button"
                        disabled={finished}
                        className={cn(
                            'nes-btn is-error pointer-events-auto h-16 w-44 text-xl font-bold',
                            finished && 'opacity-50'
                        )}
                    >
                        Different!
                    </button>
                </div>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-sm text-gray-600">
                    Click Match or Different
                </p>
            </div>
        </div>
    );
};

export default WordPairs;
