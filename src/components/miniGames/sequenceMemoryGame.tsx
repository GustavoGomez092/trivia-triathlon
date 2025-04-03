import React, { useEffect, useState } from 'react';
import { GameComponentProps } from './gameSlot';
import useSequenceMemoryStore from '@/stores/sequenceMemoryStore';
import useEventStore from '@/stores/eventStore';

const SEQUENCE_COLORS = ['red', 'blue', 'green', 'yellow'];
const MAX_LIVES = 3;
const SEQUENCE_MEMORY_GAME_TITLE = 'Sequence Memory';
const BASE_SHOW_DELAY = 500; // Faster show time
const BASE_PAUSE_DELAY = 200; // Faster pause between colors
const SEQUENCE_SPEED_MULTIPLIER = 0.8; // Higher multiplier for faster overall speed

const getNesColorClass = (color: string) => {
    switch (color) {
        case 'red':
            return 'is-error';
        case 'blue':
            return 'is-primary';
        case 'green':
            return 'is-success';
        case 'yellow':
            return 'is-warning';
        default:
            return '';
    }
};

const SequenceMemoryGame: React.FC<GameComponentProps> = () => {
    const [activeColor, setActiveColor] = useState<string | null>(null);
    const [hasFailed, setHasFailed] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [lives, setLives] = useState(MAX_LIVES);

    const { speedIncrease, speedDecrease, speed } = useEventStore();
    const {
        sequence,
        playerSequence,
        isShowingSequence,
        gameActive,
        finished,
        passed,
        level,
        targetLevel,
        reset,
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
        const speedAdjustment = SEQUENCE_SPEED_MULTIPLIER * (1 + ((150 - speed) / 150));
        const showDelay = BASE_SHOW_DELAY * speedAdjustment;
        const pauseDelay = BASE_PAUSE_DELAY * speedAdjustment;

        let hideTimer: NodeJS.Timeout;
        let nextTimer: NodeJS.Timeout;

        const showNextColor = () => {
            if (currentIndex >= sequence.length) {
                setActiveColor(null);
                showSequence();
                return;
            }

            setActiveColor(sequence[currentIndex]);
            hideTimer = setTimeout(() => {
                setActiveColor(null);
                nextTimer = setTimeout(() => {
                    currentIndex++;
                    showNextColor();
                }, pauseDelay);
            }, showDelay);
        };

        showNextColor();

        // Cleanup all timers
        return () => {
            if (hideTimer) clearTimeout(hideTimer);
            if (nextTimer) clearTimeout(nextTimer);
            setActiveColor(null);
        };
    }, [sequence, isShowingSequence, showSequence, speed]);

    useEffect(() => {
        if (!gameActive || isShowingSequence || !sequence.length) {
            if (timeLeft !== null) {
                setTimeLeft(null);
            }
            return;
        }

        const totalTime = 5 + sequence.length;
        if (timeLeft === null) {
            setTimeLeft(totalTime);
        }

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
    }, [gameActive, isShowingSequence, sequence.length, addToPlayerSequence, speedDecrease, timeLeft]);

    // Auto-restart when game ends (win or lose)
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (finished || lives <= 0) {
            timer = setTimeout(() => {
                reset();
            }, 1000);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [finished, lives, reset]);

    const handleColorClick = (color: string) => {
        if (!gameActive || isShowingSequence) return;

        const isCorrect = color === sequence[playerSequence.length];
        if (!isCorrect && !hasFailed) {
            speedDecrease();
            setHasFailed(true);
            const newLives = lives - 1;
            setLives(newLives);
        }

        // Always add to sequence to trigger store's restart logic
        addToPlayerSequence(color);
    };

    if (finished && passed) {
        return (
            <div className="nes-container is-rounded flex min-h-full w-full flex-col items-center justify-center bg-gray-200 p-8">
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
            <div className="nes-container is-rounded flex min-h-full w-full flex-col items-center justify-center bg-gray-200 p-8">
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
                        {SEQUENCE_COLORS.map((color) => {
                            const nesClass = getNesColorClass(color);
                            const isActive = color === activeColor;
                            const showColor = isShowingSequence ? isActive : gameActive;
                            const preventClick = isShowingSequence || activeColor !== null;

                            return (
                                <button
                                    key={color}
                                    data-color={color}
                                    className={`nes-btn ${showColor ? nesClass : 'is-disabled'} !border-0 !outline-none rounded-lg`}
                                    onClick={() => !preventClick && handleColorClick(color)}
                                    disabled={!gameActive || preventClick}
                                    style={{
                                        height: '45px',
                                        fontSize: '0.875rem',
                                        width: '100%',
                                        transform: isActive ? 'scale(1.05)' : 'scale(1)',
                                        transition: 'all 0.15s ease',
                                        pointerEvents: preventClick ? 'none' : 'auto',
                                        opacity: showColor ? 1 : 0.7
                                    }}
                                >
                                    {color}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SequenceMemoryGame;