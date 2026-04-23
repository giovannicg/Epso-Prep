import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuizStore } from '../store/quizStore'
import { useProgressStore } from '../store/progressStore'
import { computeScore } from '../utils/quizUtils'
import type { AnswerKey } from '../types'

export function useQuizSession() {
  const navigate = useNavigate()
  const session = useQuizStore(s => s.activeSession)
  const getCurrentQuestionId = useQuizStore(s => s.getCurrentQuestionId)
  const currentQuestionId = getCurrentQuestionId()
  const submitAnswer = useQuizStore(s => s.submitAnswer)
  const advanceQuestion = useQuizStore(s => s.advanceQuestion)
  const completeSession = useQuizStore(s => s.completeSession)
  const recordSession = useProgressStore(s => s.recordSession)

  useEffect(() => {
    if (session?.completedAt) {
      const { correct, total, percentage } = computeScore(session)
      recordSession({
        id: session.id,
        category: session.category,
        score: percentage,
        totalQuestions: total,
        correctAnswers: correct,
        completedAt: session.completedAt,
      })
    }
  }, [session?.completedAt])

  function handleSubmit(key: AnswerKey) {
    if (!currentQuestionId) return
    submitAnswer(currentQuestionId, key)
  }

  function handleNext() {
    if (!session) return
    const isLast = session.currentIndex >= session.totalQuestions - 1
    if (isLast) {
      completeSession()
      navigate('/results', { replace: true })
    } else {
      advanceQuestion()
    }
  }

  return { session, currentQuestionId, handleSubmit, handleNext }
}
