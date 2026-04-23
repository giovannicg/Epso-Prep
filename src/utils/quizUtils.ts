import type { QuizSession } from '../types';

export function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function computeScore(session: QuizSession): {
  correct: number;
  total: number;
  percentage: number;
} {
  const attempts = Object.values(session.attempts);
  const correct = attempts.filter(a => a.status === 'correct').length;
  const total = session.totalQuestions;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  return { correct, total, percentage };
}
