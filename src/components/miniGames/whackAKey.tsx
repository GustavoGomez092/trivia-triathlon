import useSprintStore from '@/stores/sprintStore';
import useWhackaKeyStore from '@/stores/whackaKeyStore';
import { Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';

function WhackAKey() {
  const {
    finished,
    started,
    correctKeys,
    correctKeysTarget,
    incorrectKeys,
    incorrectKeysTarget,
    passed,
    start,
    finish,
    reset,
    setPassed,
    correct,
    incorrect,
  } = useWhackaKeyStore();

  const { speedIncrease, speedDecrease } = useSprintStore();

  // The keyboard keys we'll monitor
  const moleKeys = ['Q'];

  // Which mole (by index) is currently active
  const [activeMoleIndex, setActiveMoleIndex] = useState<number | null>(null);

  // Start the game
  useEffect(() => {
    start();
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    // Randomly pick an active mole every 1 second
    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * moleKeys.length);
      setActiveMoleIndex(randomIndex);
    }, 900);

    // Cleanup the interval on unmount
    return () => clearInterval(intervalId);
  }, [moleKeys.length, started, finished]);

  // Listen for keydown events
  useEffect(() => {
    if (!started || finished) return;

    // if the total number of correct keys is equal to the target number of correct keys, finish the game
    if (correctKeys === correctKeysTarget) {
      setPassed(true);
      finish();
    }

    // if the total number of incorrect keys is equal to the target number of incorrect keys, finish the game
    if (incorrectKeys === incorrectKeysTarget) {
      setPassed(false);
      finish();
    }

    const handleKeyDown = (e: { key: string }) => {
      // Convert pressed key to uppercase (to match our moleKeys)
      const pressedKey = e.key.toUpperCase();
      // Check if pressedKey matches the active mole's key
      if (
        activeMoleIndex !== null &&
        moleKeys[activeMoleIndex] === pressedKey
      ) {
        correct();
        // Optional: set active mole to null or end it immediately
        setActiveMoleIndex(null);
      } else {
        incorrect();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeMoleIndex, moleKeys, started, finished]);

  useEffect(() => {
    if (finished && passed) {
      setTimeout(() => {
        speedIncrease();
        reset();
      }, 1000);
    } else if (finished && !passed) {
      setTimeout(() => {
        speedDecrease();
        reset();
      }, 1000);
    }
  }, [finished, passed]);

  return (
    <div className="nes-container is-rounded flex min-h-full w-full flex-col items-center justify-center bg-gray-200 p-8">
      <h1 className="mb-4 text-2xl font-bold">Whack-a-Key</h1>
      <div className="flex flex-col items-center justify-center bg-gray-200 lg:flex-row">
        {!finished && (
          <>
            <div className="scoreboards flex w-7/12 gap-6">
              <div className="mb-6 text-xl">
                <h3>Correct</h3>
                <div className="correct-keys max-w-46 flex flex-wrap gap-4">
                  {
                    // Show a green checkmark for each correct key
                    Array.from({ length: correctKeysTarget }, (_, index) => (
                      <Check
                        key={index}
                        size={24}
                        className={`${
                          index < correctKeys ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                    ))
                  }
                </div>
              </div>
              <div className="text-xl">
                <h3>Incorrect</h3>
                <div className="incorrect-keys max-w-44 flex flex-wrap gap-4">
                  {
                    // Show a red checkmark for each incorrect key
                    Array.from({ length: incorrectKeysTarget }, (_, index) => (
                      <X
                        key={index}
                        size={24}
                        className={`${
                          index < incorrectKeys ? 'bg-red-500' : 'bg-gray-400'
                        }`}
                      />
                    ))
                  }
                </div>
              </div>
            </div>
            <div className="grid w-5/12 grid-cols-4 justify-items-center gap-4">
              {moleKeys.map((key, index) => {
                const isActive = index === activeMoleIndex;
                return (
                  <div
                    key={key}
                    className={` nes-btn
                      flex h-16 w-16 items-center justify-center rounded
                      text-white
                      ${isActive ? 'is-success' : ''}
                    `}
                  >
                    <span className="text-2xl font-bold">{key}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {finished && passed ? (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-center text-4xl font-bold text-green-500">
              You passed!
            </h1>
          </div>
        ) : finished && !passed ? (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-center text-4xl font-bold text-red-500">
              Better luck next time!
            </h1>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default WhackAKey;
