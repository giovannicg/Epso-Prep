import { create } from 'zustand'
import type { ProgressState, SessionSummary, CategoryStats } from '../types'
import { useUserStore } from './userStore'

const storageKey = (userId: string) => `epso_progress_${userId}_v1`

function defaultCategoryStats(): CategoryStats {
  return { totalAttempted: 0, totalCorrect: 0, sessionsCompleted: 0, lastAttemptedAt: null }
}

function defaultState(): ProgressState {
  return {
    statsByCategory: {
      verbal_reasoning: defaultCategoryStats(),
      numerical_reasoning: defaultCategoryStats(),
      abstract_reasoning: defaultCategoryStats(),
      situational_judgement: defaultCategoryStats(),
    },
    recentSessions: [],
  }
}

function loadFromStorage(userId: string): ProgressState {
  try {
    const raw = localStorage.getItem(storageKey(userId))
    if (raw) return JSON.parse(raw) as ProgressState
  } catch { /* ignore */ }
  return defaultState()
}

interface ProgressStore extends ProgressState {
  isLoaded: boolean
  loadProgress: () => void
  loadForUser: (userId: string) => void
  recordSession: (summary: SessionSummary) => void
  resetProgress: () => void
}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  isLoaded: false,
  ...defaultState(),

  loadProgress: () => {
    const userId = useUserStore.getState().activeUser
    if (userId) {
      set({ ...loadFromStorage(userId), isLoaded: true })
    } else {
      set({ isLoaded: true })
    }
  },

  loadForUser: (userId: string) => {
    set({ ...loadFromStorage(userId), isLoaded: true })
  },

  recordSession: (summary: SessionSummary) => {
    const userId = useUserStore.getState().activeUser
    if (!userId) return
    const state = get()
    const prev = state.statsByCategory[summary.category]
    const updated: ProgressState = {
      statsByCategory: {
        ...state.statsByCategory,
        [summary.category]: {
          totalAttempted: prev.totalAttempted + summary.totalQuestions,
          totalCorrect: prev.totalCorrect + summary.correctAnswers,
          sessionsCompleted: prev.sessionsCompleted + 1,
          lastAttemptedAt: summary.completedAt,
        },
      },
      recentSessions: [summary, ...state.recentSessions].slice(0, 10),
    }
    set(updated)
    localStorage.setItem(storageKey(userId), JSON.stringify(updated))
  },

  resetProgress: () => {
    const userId = useUserStore.getState().activeUser
    if (userId) localStorage.removeItem(storageKey(userId))
    set(defaultState())
  },
}))
