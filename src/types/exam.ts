export interface RawQuestion {
  id: number;
  rows: number[];
  answer: number;
}

export interface Question {
  id: number;
  originalId: number;
  rows: number[];
  answer: number;
}

export interface LevelInfo {
  id: number;
  code: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  badge: string;
  questionCount: number;
  available: boolean;
}

export interface ExamState {
  studentName: string;
  level: LevelInfo;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<number, string>; // questionId -> answer string
  startTime: number;
  durationSeconds: number;
  isSubmitted: boolean;
  submissionType?: 'timeout' | 'manual';
}

export interface ExamResult {
  studentName: string;
  level: LevelInfo;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unansweredQuestions: number;
  score: number;
  percentage: number;
  timeSpentSeconds: number;
  submissionType: 'timeout' | 'manual';
  telegramSent?: boolean;
}

export type ScreenState = 'welcome' | 'student-info' | 'level-select' | 'exam' | 'result';
