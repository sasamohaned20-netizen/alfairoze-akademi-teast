import React, { useState, useEffect, useCallback } from 'react';
import { ScreenState, LevelInfo, Question, ExamResult } from './types/exam';
import { WelcomeScreen } from './components/WelcomeScreen';
import { StudentInfoScreen } from './components/StudentInfoScreen';
import { LevelSelectScreen } from './components/LevelSelectScreen';
import { ExamScreen } from './components/ExamScreen';
import { ResultScreen } from './components/ResultScreen';
import { getExamQuestionsForLevel, getLevelById } from './data/questionAdapter';
import { EXAM_CONFIG } from './config/examConfig';

export const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>('welcome');
  const [studentName, setStudentName] = useState<string>('');
  const [studentPhone, setStudentPhone] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<LevelInfo | null>(null);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  // Restored exam session properties for anti-refresh
  const [savedStartTime, setSavedStartTime] = useState<number | undefined>();
  const [savedAnswers, setSavedAnswers] = useState<Record<number, string>>({});
  const [savedIndex, setSavedIndex] = useState<number>(0);

  /**
   * Grading logic: Calculates exact scores conforming to:
   * Correct + Wrong + Unanswered = Total
   */
  const calculateResult = useCallback(
    (
      questions: Question[],
      answers: Record<number, string>,
      name: string,
      phone: string,
      level: LevelInfo,
      submissionType: 'timeout' | 'manual',
      timeSpent: number
    ): ExamResult => {
      const totalQuestions = questions.length;
      let correctAnswers = 0;
      let wrongAnswers = 0;
      let answeredCount = 0;

      for (const q of questions) {
        const rawAns = answers[q.id];
        if (rawAns !== undefined && rawAns.trim() !== '') {
          answeredCount++;
          const numAns = Number(rawAns);
          if (!isNaN(numAns) && numAns === q.answer) {
            correctAnswers++;
          } else {
            wrongAnswers++;
          }
        }
      }

      const unansweredQuestions = totalQuestions - answeredCount;

      return {
        studentName: name,
        studentPhone: phone,
        level,
        totalQuestions,
        answeredQuestions: answeredCount,
        correctAnswers,
        wrongAnswers,
        unansweredQuestions,
        score: correctAnswers,
        percentage: Math.round((correctAnswers / totalQuestions) * 100),
        timeSpentSeconds: timeSpent,
        submissionType,
      };
    },
    []
  );

  /**
   * Sends the exam result to the secure backend endpoint for Telegram notification
   */
  const sendTelegramNotification = useCallback(async (result: ExamResult) => {
    try {
      await fetch('/api/submit-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: result.studentName,
          studentPhone: result.studentPhone,
          levelId: result.level.id,
          levelTitleAr: result.level.titleAr,
          totalQuestions: result.totalQuestions,
          answeredQuestions: result.answeredQuestions,
          correctAnswers: result.correctAnswers,
          wrongAnswers: result.wrongAnswers,
          unansweredQuestions: result.unansweredQuestions,
          score: result.score,
          timeSpentSeconds: result.timeSpentSeconds,
          submissionType: result.submissionType,
        }),
      });
    } catch {
      // Do not block user interface if telegram endpoint fails or has network delay
    }
  }, []);

  /**
   * On Initial Mount: Check if an active exam session was interrupted by refresh
   */
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(EXAM_CONFIG.storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        if (data && data.studentName && data.levelId !== undefined && data.questions) {
          const level = getLevelById(data.levelId);
          if (level) {
            const elapsed = Math.floor((Date.now() - data.startTime) / 1000);
            if (elapsed < EXAM_CONFIG.durationSeconds) {
              // Session still active! Restore and resume
              setStudentName(data.studentName);
              setStudentPhone(data.studentPhone || '');
              setSelectedLevel(level);
              setExamQuestions(data.questions);
              setSavedAnswers(data.answers || {});
              setSavedIndex(data.currentIndex || 0);
              setSavedStartTime(data.startTime);
              setScreen('exam');
              return;
            } else {
              // Time expired while page was closed/refreshed: grade immediately!
              sessionStorage.removeItem(EXAM_CONFIG.storageKey);
              const result = calculateResult(
                data.questions,
                data.answers || {},
                data.studentName,
                data.studentPhone || '',
                level,
                'timeout',
                EXAM_CONFIG.durationSeconds
              );
              setStudentName(data.studentName);
              setStudentPhone(data.studentPhone || '');
              setSelectedLevel(level);
              setExamResult(result);
              setScreen('result');
              sendTelegramNotification(result);
              return;
            }
          }
        }
      }
    } catch {
      // Session parse error, start clean
      sessionStorage.removeItem(EXAM_CONFIG.storageKey);
    }
  }, [calculateResult, sendTelegramNotification]);

  // Handler: Start from Welcome
  const handleStart = () => {
    setScreen('student-info');
  };

  // Handler: Student Info Submitted
  const handleStudentSubmit = (name: string, phone: string) => {
    setStudentName(name);
    setStudentPhone(phone);
    setScreen('level-select');
  };

  // Handler: Level Selected -> Start Exam
  const handleSelectLevel = (level: LevelInfo) => {
    try {
      // Generate 100 randomized & shuffled questions from this level
      const questions = getExamQuestionsForLevel(level.id, EXAM_CONFIG.questionsPerExam);
      setSelectedLevel(level);
      setExamQuestions(questions);
      setSavedAnswers({});
      setSavedIndex(0);
      setSavedStartTime(Date.now());
      setScreen('exam');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل أسئلة المستوى');
    }
  };

  // Handler: Exam Submitted (manual or timeout)
  const handleExamSubmit = (
    answers: Record<number, string>,
    submissionType: 'timeout' | 'manual',
    timeSpent: number
  ) => {
    if (!selectedLevel) return;

    const result = calculateResult(
      examQuestions,
      answers,
      studentName,
      studentPhone,
      selectedLevel,
      submissionType,
      timeSpent
    );

    setExamResult(result);
    setScreen('result');
    sendTelegramNotification(result);
  };

  return (
    <div className="w-full min-h-[100dvh] bg-brand-bg">
      {screen === 'welcome' && <WelcomeScreen onStart={handleStart} />}

      {screen === 'student-info' && (
        <StudentInfoScreen
          initialName={studentName}
          initialPhone={studentPhone}
          onSubmit={handleStudentSubmit}
          onBack={() => setScreen('welcome')}
        />
      )}

      {screen === 'level-select' && (
        <LevelSelectScreen
          studentName={studentName}
          onSelectLevel={handleSelectLevel}
          onBack={() => setScreen('student-info')}
        />
      )}

      {screen === 'exam' && selectedLevel && (
        <ExamScreen
          studentName={studentName}
          level={selectedLevel}
          questions={examQuestions}
          initialStartTime={savedStartTime}
          initialAnswers={savedAnswers}
          initialIndex={savedIndex}
          onSubmitExam={handleExamSubmit}
        />
      )}

      {screen === 'result' && examResult && (
        <ResultScreen result={examResult} />
      )}
    </div>
  );
};
