import { create } from 'zustand'
import { getQuestions, getQuestionById } from '../data/questions'
import { shuffleArray } from '../utils/quizUtils'
import type { ExamSession, ExamSectionAttempt, Language, ExamCategory, AnswerKey, QuestionAttempt } from '../types'

const EXAM_CONFIG: Array<{ category: ExamCategory; count: number; timeLimitSeconds: number }> = [
  { category: 'verbal_reasoning', count: 30, timeLimitSeconds: 35 * 60 },
  { category: 'numerical_reasoning', count: 10, timeLimitSeconds: 10 * 60 },
  { category: 'eu_knowledge', count: 10, timeLimitSeconds: 10 * 60 },
]

interface ExamStore {
  session: ExamSession | null
  startExam: (language: Language) => ExamSession | null
  submitAnswer: (questionId: string, selectedKey: AnswerKey) => void
  advanceQuestion: () => void
  completeSection: () => void
  clearExam: () => void
  getCurrentSection: () => ExamSectionAttempt | null
  getCurrentQuestionId: () => string | null
}

export const useExamStore = create<ExamStore>((set, get) => ({
  session: null,

  startExam: (language) => {
    const now = Date.now()
    const sections: ExamSectionAttempt[] = EXAM_CONFIG.map(({ category, count, timeLimitSeconds }, i) => {
      const questions = getQuestions(category, language)
      const selected = shuffleArray(questions).slice(0, Math.min(count, questions.length))
      return {
        category,
        questionIds: selected.map(q => q.id),
        attempts: {},
        timeLimitSeconds,
        startedAt: i === 0 ? now : 0,
        completedAt: null,
        currentIndex: 0,
      }
    })
    const session: ExamSession = {
      id: `exam_${now}`,
      language,
      sections,
      currentSectionIndex: 0,
      startedAt: now,
      completedAt: null,
    }
    set({ session })
    return session
  },

  submitAnswer: (questionId, selectedKey) => {
    const { session } = get()
    if (!session) return
    const question = getQuestionById(questionId)
    if (!question) return
    const attempt: QuestionAttempt = {
      questionId,
      selectedKey,
      status: selectedKey === question.correctKey ? 'correct' : 'incorrect',
      answeredAt: Date.now(),
    }
    const idx = session.currentSectionIndex
    set(state => {
      if (!state.session) return state
      const sections = state.session.sections.map((s, i) =>
        i === idx ? { ...s, attempts: { ...s.attempts, [questionId]: attempt } } : s
      )
      return { session: { ...state.session, sections } }
    })
  },

  advanceQuestion: () => {
    const idx = get().session?.currentSectionIndex ?? 0
    set(state => {
      if (!state.session) return state
      const sections = state.session.sections.map((s, i) =>
        i === idx ? { ...s, currentIndex: s.currentIndex + 1 } : s
      )
      return { session: { ...state.session, sections } }
    })
  },

  completeSection: () => {
    const { session } = get()
    if (!session) return
    const idx = session.currentSectionIndex
    const nextIndex = idx + 1
    const isLast = nextIndex >= session.sections.length
    const now = Date.now()
    set(state => {
      if (!state.session) return state
      const sections = state.session.sections.map((s, i) => {
        if (i === idx) return { ...s, completedAt: now }
        if (i === nextIndex && !isLast) return { ...s, startedAt: now }
        return s
      })
      return {
        session: {
          ...state.session,
          sections,
          currentSectionIndex: isLast ? idx : nextIndex,
          completedAt: isLast ? now : null,
        },
      }
    })
  },

  clearExam: () => set({ session: null }),

  getCurrentSection: () => {
    const { session } = get()
    if (!session) return null
    return session.sections[session.currentSectionIndex] ?? null
  },

  getCurrentQuestionId: () => {
    const { session } = get()
    if (!session) return null
    const section = session.sections[session.currentSectionIndex]
    if (!section) return null
    return section.questionIds[section.currentIndex] ?? null
  },
}))
