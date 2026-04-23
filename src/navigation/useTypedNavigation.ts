import { useNavigate, useParams } from 'react-router-dom'
import type { ExamCategory, Language } from '../types'

export function useAppNavigation() {
  const navigate = useNavigate()
  return {
    navigate: (screen: string, params?: { category?: ExamCategory; language?: Language; sessionId?: string }) => {
      if (screen === 'MainTabs') navigate('/')
      else if (screen === 'Quiz') navigate(`/quiz/${params!.category}/${params!.language}`)
      else if (screen === 'QuizResults') navigate('/results')
    },
    replace: (screen: string, params?: { category?: ExamCategory; language?: Language }) => {
      if (screen === 'Quiz') navigate(`/quiz/${params!.category}/${params!.language}`, { replace: true })
      else if (screen === 'QuizResults') navigate('/results', { replace: true })
    },
    goBack: () => navigate(-1 as never),
  }
}

export function useQuizRoute() {
  const { category, language } = useParams<{ category: string; language: string }>()
  return { params: { category: category as ExamCategory, language: language as Language } }
}

export function useQuizResultsRoute() {
  return { params: {} }
}
