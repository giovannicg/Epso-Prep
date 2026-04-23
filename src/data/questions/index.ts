import type { Question, ExamCategory, Language } from '../../types';
import verbalReasoningEs from './verbal_reasoning_es.json';
import numericalReasoningEs from './numerical_reasoning_es.json';

const questionBank: Record<string, Question[]> = {
  verbal_reasoning_es: verbalReasoningEs as Question[],
  numerical_reasoning_es: numericalReasoningEs as Question[],
};

export function getQuestions(category: ExamCategory, language: Language): Question[] {
  const key = `${category}_${language}`;
  return questionBank[key] ?? [];
}

export function getQuestionById(id: string): Question | undefined {
  return Object.values(questionBank).flat().find(q => q.id === id);
}
