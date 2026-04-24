export type ExamCategory =
  | 'verbal_reasoning'
  | 'numerical_reasoning'
  | 'abstract_reasoning'
  | 'situational_judgement';

export type Language = 'es' | 'en' | 'fr';

export type AnswerKey = 'A' | 'B' | 'C' | 'D' | 'E';

export interface AnswerOption {
  key: AnswerKey;
  text: string;
}

export interface TableData {
  title?: string;
  headers: string[];
  rows: string[][];
}

export interface Question {
  id: string;
  category: ExamCategory;
  language: Language;
  passage?: string;
  tableData?: TableData;
  imageUrls?: string[];
  question: string;
  options: AnswerOption[];
  correctKey: AnswerKey;
  explanation?: string;
  groupId?: string;
  groupTitle?: string;
  groupQuestionIndex?: number;
  groupTotalQuestions?: number;
}

export interface QuestionGroupItem {
  id: string;
  question: string;
  options: AnswerOption[];
  correctKey: AnswerKey;
  explanation?: string;
}

export interface QuestionGroup {
  dataset_id: string;
  category: ExamCategory;
  language: Language;
  title?: string;
  tableData?: TableData;
  imageUrls?: string[];
  passage?: string;
  questions: QuestionGroupItem[];
}

export type AnswerStatus = 'correct' | 'incorrect' | 'unanswered';

export interface QuestionAttempt {
  questionId: string;
  selectedKey: AnswerKey | null;
  status: AnswerStatus;
  answeredAt: number;
}

export interface QuizSession {
  id: string;
  category: ExamCategory;
  language: Language;
  questionIds: string[];
  attempts: Record<string, QuestionAttempt>;
  currentIndex: number;
  startedAt: number;
  completedAt: number | null;
  totalQuestions: number;
}

export interface CategoryStats {
  totalAttempted: number;
  totalCorrect: number;
  sessionsCompleted: number;
  lastAttemptedAt: number | null;
}

export interface SessionSummary {
  id: string;
  category: ExamCategory;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: number;
}

export interface ProgressState {
  statsByCategory: Record<ExamCategory, CategoryStats>;
  recentSessions: SessionSummary[];
}

export type RootStackParamList = {
  MainTabs: undefined;
  Quiz: { category: ExamCategory; language: Language };
  QuizResults: { sessionId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Practice: undefined;
  Progress: undefined;
};
