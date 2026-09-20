import { LevelInfo, Question, RawQuestion } from '../types/exam';
import { EXAM_CONFIG } from '../config/examConfig';

// Import raw level JSON data directly
import level0Data from './levels/level-0.json';
import level1Data from './levels/level-1.json';
import level2Data from './levels/level-2.json';
import level3Data from './levels/level-3.json';
import level4Data from './levels/level-4.json';
import level5Data from './levels/level-5.json';

// Active levels defined according to the provided files
export const AVAILABLE_LEVELS: LevelInfo[] = [
  {
    id: 0,
    code: 'level-0',
    titleAr: 'المستوى التمهيدي',
    titleEn: 'Introductory Level',
    subtitleAr: '100 سؤال — 5 دقائق',
    badge: 'التمهيدي',
    questionCount: 100,
    available: true,
  },
  {
    id: 1,
    code: 'level-1',
    titleAr: 'المستوى الأول',
    titleEn: 'Level 1',
    subtitleAr: '100 سؤال — 5 دقائق',
    badge: 'المستوى 1',
    questionCount: 100,
    available: true,
  },
  {
    id: 2,
    code: 'level-2',
    titleAr: 'المستوى الثاني',
    titleEn: 'Level 2',
    subtitleAr: '100 سؤال — 5 دقائق',
    badge: 'المستوى 2',
    questionCount: 100,
    available: true,
  },
  {
    id: 3,
    code: 'level-3',
    titleAr: 'المستوى الثالث',
    titleEn: 'Level 3',
    subtitleAr: '100 سؤال — 5 دقائق',
    badge: 'المستوى 3',
    questionCount: 100,
    available: true,
  },
  {
    id: 4,
    code: 'level-4',
    titleAr: 'المستوى الرابع',
    titleEn: 'Level 4',
    subtitleAr: '100 سؤال — 5 دقائق',
    badge: 'المستوى 4',
    questionCount: 100,
    available: true,
  },
  {
    id: 5,
    code: 'level-5',
    titleAr: 'المستوى الخامس',
    titleEn: 'Level 5',
    subtitleAr: '100 سؤال — 5 دقائق',
    badge: 'المستوى 5',
    questionCount: 100,
    available: true,
  },
];

/**
 * Adapter map to extract question array regardless of the json key used
 */
function extractQuestions(data: unknown): RawQuestion[] {
  if (!data || typeof data !== 'object') return [];
  const obj = data as Record<string, unknown>;

  // Check common keys
  for (const key of ['level_0', 'level_1', 'level_2', 'level_3', 'level_4', 'level_5', 'questions', 'data']) {
    if (Array.isArray(obj[key])) {
      return obj[key] as RawQuestion[];
    }
  }

  // Fallback: check the first array property found
  for (const val of Object.values(obj)) {
    if (Array.isArray(val)) {
      return val as RawQuestion[];
    }
  }

  return [];
}

const LEVEL_DATA_MAP: Record<number, RawQuestion[]> = {
  0: extractQuestions(level0Data),
  1: extractQuestions(level1Data),
  2: extractQuestions(level2Data),
  3: extractQuestions(level3Data),
  4: extractQuestions(level4Data),
  5: extractQuestions(level5Data),
};

/**
 * Fisher-Yates modern shuffle algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Selects exactly `count` questions randomly from the level file and shuffles them
 */
export function getExamQuestionsForLevel(levelId: number, count = EXAM_CONFIG.questionsPerExam): Question[] {
  const allQuestions = LEVEL_DATA_MAP[levelId];
  if (!allQuestions || allQuestions.length === 0) {
    throw new Error(`لا توجد أسئلة متاحة للمستوى المحدد (${levelId})`);
  }

  // 1. Shuffle the full pool
  const shuffled = shuffleArray(allQuestions);

  // 2. Select `count` items (or all if fewer available)
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  // 3. Map to normalized exam question objects with sequential 1-based IDs
  return selected.map((q, index) => ({
    id: index + 1,
    originalId: q.id,
    rows: q.rows,
    answer: q.answer,
  }));
}

export function getLevelById(levelId: number): LevelInfo | undefined {
  return AVAILABLE_LEVELS.find((lvl) => lvl.id === levelId);
}
