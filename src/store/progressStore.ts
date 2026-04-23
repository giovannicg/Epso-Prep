import { create } from 'zustand'
import type { ProgressState, SessionSummary, CategoryStats } from '../types'

const STORAGE_KEY = 'epso_progress_v1'

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

interface ProgressStore extends ProgressState {
  isLoaded: boolean
  loadProgress: () => void
  recordSession: (summary: SessionSummary) => void
  resetProgress: () => void
}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  isLoaded: false,
  ...defaultState(),

  loadProgress: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw) as ProgressState
        set({ ...saved, isLoaded: true })
      } else {
        set({ isLoaded: true })
      }
    } catch {
      set({ isLoaded: true })
    }
  },

  recordSession: (summary: SessionSummary) => {
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  },

  resetProgress: () => {
    localStorage.removeItem(STORAGE_KEY)
    set(defaultState())
  },
}))
