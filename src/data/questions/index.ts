import type { Question, ExamCategory, Language, QuestionGroup } from '../../types';
import verbalReasoningEs from './verbal_reasoning_es.json';
import verbalReasoningEn from './verbal_reasoning_en.json';
import numericalReasoningEsRaw from './numerical_reasoning_es_book.json';
import numericalReasoningEnRaw from './numerical_reasoning_en.json';
import euKnowledgeEs from './eu_knowldge_es.json';
import euKnowledgeEn from './eu_knowldge_en.json';

function flattenGroups(groups: QuestionGroup[]): Question[] {
  return groups.flatMap(group =>
    group.questions.map((item, idx) => ({
      id: item.id,
      category: group.category,
      language: group.language,
      tableData: group.tableData,
      imageUrls: group.imageUrls,
      passage: group.passage,
      question: item.question,
      options: item.options,
      correctKey: item.correctKey,
      explanation: item.explanation,
      groupId: group.dataset_id,
      groupTitle: group.title,
      groupQuestionIndex: idx + 1,
      groupTotalQuestions: group.questions.length,
    }))
  );
}

const numericalReasoningEs = flattenGroups(numericalReasoningEsRaw as unknown as QuestionGroup[]);
const numericalReasoningEn = flattenGroups(numericalReasoningEnRaw as unknown as QuestionGroup[]);

const questionBank: Record<string, Question[]> = {
  verbal_reasoning_es: verbalReasoningEs as Question[],
  verbal_reasoning_en: verbalReasoningEn as Question[],
  numerical_reasoning_es: numericalReasoningEs,
  numerical_reasoning_en: numericalReasoningEn,
  eu_knowledge_es: euKnowledgeEs as Question[],
  eu_knowledge_en: euKnowledgeEn as Question[],
};

export function getQuestions(category: ExamCategory, language: Language): Question[] {
  const key = `${category}_${language}`;
  return questionBank[key] ?? [];
}

export function getQuestionById(id: string): Question | undefined {
  return Object.values(questionBank).flat().find(q => q.id === id);
}

export function getQuestionByIdAndLanguage(id: string, language: Language): Question | undefined {
  return Object.entries(questionBank)
    .filter(([key]) => key.endsWith(`_${language}`))
    .flatMap(([, qs]) => qs)
    .find(q => q.id === id);
}
