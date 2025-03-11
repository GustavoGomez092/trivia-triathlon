import { Player } from '@/types/Player'
import { create } from 'zustand'
import useSprintStore from './sprintStore'

const { setTrigger } = useSprintStore.getState()

enum Difficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD"
} 

export interface WhackAKeyStore {
  difficulty: Difficulty,
  started: boolean,
  time: number,
  player: Player | null,
  speed: number,
  finished: boolean,
  correctKeys: number,
  correctKeysTarget: number,
  incorrectKeys: number,
  incorrectKeysTarget: number,
  moleKeys: number,
  passed: boolean,
  start: () => void,
  finish: () => void,
  reset: () => void,
  correct: () => void,
  incorrect: () => void,
  setPlayer: (player: Player) => void,
  setDifficulty: (difficulty: Difficulty) => void,
  setPassed: (val: boolean) => void,
}

const useWhackaKeyStore = create<WhackAKeyStore>((set) => ({
  difficulty: Difficulty.EASY,
  started: false,
  time: 10000,
  player: null,
  speed: 100,
  finished: false,
  correctKeys: 0,
  correctKeysTarget: 10,
  incorrectKeys: 0,
  incorrectKeysTarget: 3,
  moleKeys: 4,
  passed: false,
  start: () => set({ started: true }),
  finish: () => set(() =>({ finished: true })),
  reset: () => set(() =>{
    setTrigger(Math.floor(Math.random() * 1000) + 1000)
    return { started: false, finished: false, time: 0, correctKeys: 0, incorrectKeys: 0, passed: false }
  }),
  correct: () => set((state) => ({ correctKeys: state.correctKeys + 1 })),
  incorrect: () => set((state) => ({ incorrectKeys: state.incorrectKeys + 1 })),
  setPlayer: (player:Player) => set({ player }),
  setDifficulty: (difficulty:Difficulty) => set({ 
    difficulty: difficulty,
    moleKeys: difficulty === Difficulty.EASY ? 4 : difficulty === Difficulty.MEDIUM ? 8 : 12
  }),
  setPassed: (val:boolean) => set(() => ({ passed:val })),
}))

export default useWhackaKeyStore