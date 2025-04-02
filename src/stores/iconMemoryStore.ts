import { create } from 'zustand';
import useEventStore from './eventStore';

const { setTrigger, setPassed: setPassedIconMemory } = useEventStore.getState();

export const CARD_PAIRS = 6; // Número de pares de cartas (16 cartas en total)

export type IconName =
  | 'home'
  | 'user'
  | 'settings'
  | 'bell'
  | 'star'
  | 'heart'
  | 'moon'
  | 'sun'
  | 'cloud'
  | 'cloud-rain'
  | 'wind'
  | 'cloud-snow'
  | 'cloud-lightning'
  | 'umbrella'
  | 'coffee'
  | 'pizza'
  | 'ice-cream'
  | 'cake'
  | 'cookie'
  | 'apple'
  | 'banana'
  | 'grape'
  | 'carrot';

interface Card {
  id: number;
  icon: IconName;
  isFlipped: boolean;
  isMatched: boolean;
}

interface IconMemoryState {
  cards: Card[];
  flippedCards: number[];
  gameActive: boolean;
  finished: boolean;
  passed: boolean;
  timeLeft: number;
  availableIcons: IconName[];
  setGameActive: (active: boolean) => void;
  setTimeLeft: (time: number | ((prev: number) => number)) => void;
  setFinished: (finished: boolean) => void;
  setPassed: (passed: boolean) => void;
  initializeGame: () => void;
  handleCardClick: (cardId: number) => void;
  reset: () => void;
}

const useIconMemoryStore = create<IconMemoryState>((set, get) => ({
  cards: [],
  flippedCards: [],
  gameActive: true,
  finished: false,
  passed: false,
  timeLeft: 30,
  availableIcons: [
    'home',
    'user',
    'settings',
    'bell',
    'star',
    'heart',
    'moon',
    'sun',
    'cloud',
    'cloud-rain',
    'wind',
    'cloud-snow',
    'cloud-lightning',
    'umbrella',
    'coffee',
    'pizza',
    'ice-cream',
    'cake',
    'cookie',
    'apple',
    'banana',
    'grape',
    'carrot',
  ],

  setGameActive: (active) => set({ gameActive: active }),
  setTimeLeft: (time) =>
    set((state) => ({
      timeLeft: typeof time === 'function' ? time(state.timeLeft) : time,
    })),
  setFinished: (finished) => set({ finished }),
  setPassed: (passed) => {
    set({ passed, finished: true });
    setPassedIconMemory(passed);
  },

  initializeGame: () => {
    const { availableIcons } = get();
    // Select CARD_PAIRS random icons
    const selectedIcons = availableIcons
      .sort(() => Math.random() - 0.5)
      .slice(0, CARD_PAIRS);

    // Create card pairs
    const newCards: Card[] = [...selectedIcons, ...selectedIcons]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({
        id: index,
        icon,
        isFlipped: false,
        isMatched: false,
      }));

    set({
      cards: newCards,
      flippedCards: [],
      gameActive: true,
      timeLeft: 30,
      finished: false,
      passed: false,
    });
  },

  handleCardClick: (cardId: number) => {
    const { cards, flippedCards, gameActive, finished } = get();
    if (!gameActive || finished || flippedCards.length >= 2) return;

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    set({ flippedCards: newFlippedCards });

    set({
      cards: cards.map((c) =>
        c.id === cardId ? { ...c, isFlipped: true } : c,
      ),
    });

    if (newFlippedCards.length === 2) {
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.icon === secondCard.icon) {
        // Match found
        setTimeout(() => {
          set((state) => ({
            cards: state.cards.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true }
                : c,
            ),
            flippedCards: [],
          }));
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          set((state) => ({
            cards: state.cards.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false }
                : c,
            ),
            flippedCards: [],
          }));
        }, 1000);
      }
    }
  },

  reset: () => {
    setTrigger(Math.floor(Math.random() * 1000) + 1000);
    set({
      cards: [],
      flippedCards: [],
      gameActive: true,
      finished: false,
      passed: false,
      timeLeft: 30,
    });
  },
}));

export default useIconMemoryStore;
