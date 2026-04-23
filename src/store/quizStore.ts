import { create } from 'zustand';
import type { QuizSession, ExamCategory, Language, QuestionAttempt, AnswerKey } from '../types';
import { getQuestions, getQuestionById } from '../data/questions';
import { shuffleArray } from '../utils/quizUtils';

const SESSION_SIZE = 10;

interface QuizStore {
  activeSession: QuizSession | null;
  startSession: (category: ExamCategory, language: Language) => QuizSession | null;
  submitAnswer: (questionId: string, selectedKey: AnswerKey) => void;
  advanceQuestion: () => void;
  completeSession: () => void;
  clearSession: () => void;
  getCurrentQuestionId: () => string | null;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  activeSession: null,

  startSession: (category, language) => {
    const questions = getQuestions(category, language);
    if (questions.length === 0) return null;
    const selected = shuffleArray(questions).slice(0, SESSION_SIZE);
    const session: QuizSession = {
      id: `${category}_${Date.now()}`,
      category,
      language,
      questionIds: selected.map(q => q.id),
      attempts: {},
      currentIndex: 0,
      startedAt: Date.now(),
      completedAt: null,
      totalQuestions: selected.length,
    };
    set({ activeSession: session });
    return session;
  },

  submitAnswer: (questionId, selectedKey) => {
    const session = get().activeSession;
    if (!session) return;
    const question = getQuestionById(questionId);
    if (!question) return;
    const attempt: QuestionAttempt = {
      questionId,
      selectedKey,
      status: selectedKey === question.correctKey ? 'correct' : 'incorrect',
      answeredAt: Date.now(),
    };
    set(state => ({
      activeSession: state.activeSession
        ? {
            ...state.activeSession,
            attempts: { ...state.activeSession.attempts, [questionId]: attempt },
          }
        : null,
    }));
  },

  advanceQuestion: () => {
    set(state => ({
      activeSession: state.activeSession
        ? { ...state.activeSession, currentIndex: state.activeSession.currentIndex + 1 }
        : null,
    }));
  },

  completeSession: () => {
    set(state => ({
      activeSession: state.activeSession
        ? { ...state.activeSession, completedAt: Date.now() }
        : null,
    }));
  },

  clearSession: () => set({ activeSession: null }),

  getCurrentQuestionId: () => {
    const session = get().activeSession;
    if (!session) return null;
    return session.questionIds[session.currentIndex] ?? null;
  },
}));
