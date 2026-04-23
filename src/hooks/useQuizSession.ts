import { useQuizStore } from '../store/quizStore';
import { useAppNavigation } from '../navigation/useTypedNavigation';
import type { AnswerKey } from '../types';

export function useQuizSession() {
  const store = useQuizStore();
  const navigation = useAppNavigation();

  function handleSubmit(selectedKey: AnswerKey) {
    const qId = store.getCurrentQuestionId();
    if (qId) store.submitAnswer(qId, selectedKey);
  }

  function handleNext() {
    const session = store.activeSession;
    if (!session) return;
    const isLast = session.currentIndex >= session.totalQuestions - 1;
    if (isLast) {
      store.completeSession();
      navigation.replace('QuizResults', { sessionId: session.id });
    } else {
      store.advanceQuestion();
    }
  }

  return {
    session: store.activeSession,
    currentQuestionId: store.getCurrentQuestionId(),
    handleSubmit,
    handleNext,
  };
}
