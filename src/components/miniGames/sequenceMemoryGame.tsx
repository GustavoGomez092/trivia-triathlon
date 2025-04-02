import React, { useEffect, useState } from 'react';
import { GameComponentProps } from './gameSlot';
import useSequenceMemoryStore from '@/stores/sequenceMemoryStore';
import useEventStore from '@/stores/eventStore';

const SEQUENCE_COLORS = ['red', 'blue', 'green', 'yellow'];
const MAX_LIVES = 3;
const SEQUENCE_MEMORY_GAME_TITLE = 'Sequence Memory';

const SequenceMemoryGame: React.FC<GameComponentProps> = () => {
    const [activeColor, setActiveColor] = useState<string | null>(null);
    const [hasFailed, setHasFailed] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [lives, setLives] = useState(MAX_LIVES);

    const { speedIncrease, speedDecrease } = useEventStore();
    const {
        sequence,
        playerSequence,
        isShowingSequence,
        gameActive,
        finished,
        passed,
        level,
        targetLevel,
        start,
        addToPlayerSequence,
        showSequence,
        setPassed,
        finish,
    } = useSequenceMemoryStore();

    useEffect(() => {
        start();
        return () => {
            setPassed(false);
            setHasFailed(false);
            setLives(MAX_LIVES);
        };
    }, [start, setPassed]);

    // Check game completion
    useEffect(() => {
        if (!gameActive || finished) return;

        if (level === targetLevel && playerSequence.length === sequence.length) {
            speedIncrease();
            setPassed(true);
            finish();
        }
    }, [gameActive, finished, level, targetLevel, playerSequence.length, sequence.length, speedIncrease, setPassed, finish]);

    // Reset failure state
    useEffect(() => {
        if (isShowingSequence) {
            setHasFailed(false);
        }
    }, [isShowingSequence]);

    // Handle sequence display
    useEffect(() => {
        if (!isShowingSequence || !sequence.length) return;

        let currentIndex = 0;
        const baseShowDelay = 600;
        const basePauseDelay = 200;
        const speedMultiplier = Math.max(0.5, 1 - (level - 1) * 0.2);
        const showDelay = baseShowDelay * speedMultiplier;
        const pauseDelay = basePauseDelay * speedMultiplier;

        const showNextColor = () => {
            if (currentIndex >= sequence.length) {
                setActiveColor(null);
                showSequence();
                return;
            }

            setActiveColor(sequence[currentIndex]);
            const hideTimer = setTimeout(() => {
                setActiveColor(null);
                const nextTimer = setTimeout(() => {
                    currentIndex++;
                    showNextColor();
                }, pauseDelay);
                return () => clearTimeout(nextTimer);
            }, showDelay);
            return () => clearTimeout(hideTimer);
        };

        showNextColor();
    }, [sequence, isShowingSequence, showSequence, level]);

    useEffect(() => {
        if (!gameActive || isShowingSequence || !sequence.length) {
            setTimeLeft(null);
            return;
        }

        const totalTime = 5 + sequence.length;
        setTimeLeft(totalTime);

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev === null || prev <= 0) {
                    clearInterval(timer);
                    if (gameActive) {
                        // Simulate a wrong move to trigger store's restart logic
                        setHasFailed(true);
                        speedDecrease();
                        addToPlayerSequence('wrong'); // This will trigger store's restart
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameActive, isShowingSequence, sequence.length, addToPlayerSequence, speedDecrease]);

    // Auto-restart when game is finished and not passed
    useEffect(() => {
        if (finished && !passed) {
            const timer = setTimeout(() => {
                setLives(MAX_LIVES); // Reset lives before restarting
                setHasFailed(false);
                start();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [finished, passed, start]);

    const handleColorClick = (color: string) => {
        if (!gameActive || isShowingSequence) return;

        const isCorrect = color === sequence[playerSequence.length];
        if (!isCorrect && !hasFailed) {
            speedDecrease();
            setHasFailed(true);
            const newLives = lives - 1;
            setLives(newLives);

            // If no lives left, make sure we reset lives on next restart
            if (newLives <= 0) {
                setTimeout(() => {
                    setLives(MAX_LIVES);
                }, 1000);
            }
        }

        // Always add to sequence to trigger store's restart logic
        addToPlayerSequence(color);
    };

    if (finished && passed) {
        return (
            <div className="flex min-h-full w-full flex-col items-center justify-center bg-gray-200 p-8">
                <h1 className="mb-4 text-2xl font-bold">{SEQUENCE_MEMORY_GAME_TITLE}</h1>
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
            <div className="flex min-h-full w-full flex-col items-center justify-center bg-gray-200 p-8">
                <h1 className="mb-4 text-2xl font-bold">{SEQUENCE_MEMORY_GAME_TITLE}</h1>
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-center text-4xl font-bold text-red-500">
                        Better luck next time!
                    </h1>
                </div>
            </div>
        );
    }

    return (
        <div className="nes-container is-rounded min-h-full w-full bg-gray-200 relative overflow-hidden mt-8" style={{ pointerEvents: 'auto', maxHeight: '310px' }}>
            <div className="flex min-h-full w-full flex-col gap-1 p-2 relative">
                {/* Header row */}
                <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                        {[...Array(MAX_LIVES)].map((_, i) => (
                            <i key={i}
                                className={`nes-icon heart ${i < lives ? '' : 'is-empty'}`}
                                style={{ transform: 'scale(2.5)', transformOrigin: 'center', marginTop: '4px' }}
                            />
                        ))}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1">
                            <span className="text-sm text-gray-600">Level:</span>
                            <span className="text-lg font-bold text-blue-500">{level}/{targetLevel}</span>
                        </div>
                        <div className="flex items-center gap-1 min-h-[24px]">
                            {timeLeft !== null && (
                                <>
                                    <span className="text-sm text-gray-600">Time:</span>
                                    <span className={`text-lg font-bold ${timeLeft <= 3 ? 'text-red-500' : 'text-blue-500'}`}>
                                        {timeLeft}s
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <h2 className="text-xl font-bold">{SEQUENCE_MEMORY_GAME_TITLE}</h2>
                    <p className="text-sm mt-1">
                        {isShowingSequence
                            ? `Memorize ${sequence.length} colors...`
                            : gameActive
                                ? `Reproduce the ${sequence.length}-color sequence!`
                                : hasFailed
                                    ? `Wrong sequence - ${lives} ${lives === 1 ? 'life' : 'lives'} left`
                                    : 'Get ready...'}
                    </p>
                </div>

                {/* Color buttons grid */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-5" style={{ width: '100%', maxWidth: '240px' }}>
                        {SEQUENCE_COLORS.map((color) => (
                            <button
                                key={color}
                                data-color={color}
                                className="nes-btn relative overflow-hidden active:scale-95 active:brightness-90"
                                onClick={() => handleColorClick(color)}
                                disabled={!gameActive || isShowingSequence}
                                style={{
                                    pointerEvents: !gameActive || isShowingSequence ? 'none' : 'auto',
                                    height: '45px',
                                    fontSize: '0.875rem',
                                    width: '100%',
                                    backgroundColor: isShowingSequence
                                        ? (color === activeColor ? color : '#d3d3d3')  // Gray during sequence unless active
                                        : color,  // Show actual colors after sequence
                                    color: ['yellow', 'green'].includes(color) ? '#000' : '#fff',
                                    textTransform: 'capitalize',
                                    opacity: !gameActive ? 0.7 : 1,
                                    transform: color === activeColor ? 'scale(1.05)' : 'scale(1)',
                                    transition: 'all 0.15s ease',
                                    outline: 'none',
                                    border: 'none',
                                    cursor: (!gameActive || isShowingSequence) ? 'default' : 'pointer'
                                }}
                            >
                                {color}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SequenceMemoryGame;