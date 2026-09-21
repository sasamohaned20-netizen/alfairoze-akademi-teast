import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, LogOut } from 'lucide-react';
import { LevelInfo, Question } from '../types/exam';
import { CustomKeypad } from './CustomKeypad';
import { ConfirmModal } from './ConfirmModal';
import { EXAM_CONFIG } from '../config/examConfig';

interface ExamScreenProps {
  studentName: string;
  level: LevelInfo;
  questions: Question[];
  initialStartTime?: number;
  initialAnswers?: Record<number, string>;
  initialIndex?: number;
  onSubmitExam: (answers: Record<number, string>, submissionType: 'timeout' | 'manual', timeSpent: number) => void;
}

export const ExamScreen: React.FC<ExamScreenProps> = ({
  studentName,
  level,
  questions,
  initialStartTime,
  initialAnswers = {},
  initialIndex = 0,
  onSubmitExam,
}) => {
  // 1. Session & Timing initialization
  const startTimeRef = useRef<number>(initialStartTime || Date.now());
  const [timeRemaining, setTimeRemaining] = useState<number>(() => {
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    return Math.max(0, EXAM_CONFIG.durationSeconds - elapsed);
  });

  // 2. Exam progress state
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [answers, setAnswers] = useState<Record<number, string>>(initialAnswers);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent multiple submissions
  const submittedRef = useRef(false);

  const currentQuestion: Question | undefined = questions[currentIndex];
  const totalQuestions = questions.length;

  // 3. Save progress to storage for refresh protection
  const saveSession = useCallback(() => {
    try {
      const sessionData = {
        studentName,
        levelId: level.id,
        startTime: startTimeRef.current,
        questions,
        answers,
        currentIndex,
      };
      sessionStorage.setItem(EXAM_CONFIG.storageKey, JSON.stringify(sessionData));
    } catch {
      // Ignore storage errors
    }
  }, [studentName, level.id, questions, answers, currentIndex]);

  useEffect(() => {
    saveSession();
  }, [saveSession]);

  // 4. Submission Handler
  const handleFinalSubmit = useCallback(
    (type: 'timeout' | 'manual') => {
      if (submittedRef.current) return;
      submittedRef.current = true;
      setIsSubmitting(true);

      // Save any pending currentInput if not yet saved
      const finalAnswers = { ...answers };
      if (currentQuestion && currentInput.trim() !== '') {
        finalAnswers[currentQuestion.id] = currentInput.trim();
      }

      const timeSpent = Math.min(
        EXAM_CONFIG.durationSeconds,
        Math.floor((Date.now() - startTimeRef.current) / 1000)
      );

      // Clear session from storage
      try {
        sessionStorage.removeItem(EXAM_CONFIG.storageKey);
      } catch {
        // Ignore
      }

      onSubmitExam(finalAnswers, type, timeSpent);
    },
    [answers, currentQuestion, currentInput, onSubmitExam]
  );

  // 5. Timer countdown effect (drift-free)
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = Math.max(0, EXAM_CONFIG.durationSeconds - elapsed);
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        handleFinalSubmit('timeout');
      }
    }, 250);

    return () => clearInterval(interval);
  }, [handleFinalSubmit]);

  // 6. Formatting time: mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 7. Keypad Actions
  const handleDigitPress = (digit: string) => {
    // Limit answer length to 7 digits for sanity
    if (currentInput.replace('-', '').length >= 7) return;
    setCurrentInput((prev) => prev + digit);
  };

  const handleBackspace = () => {
    setCurrentInput((prev) => prev.slice(0, -1));
  };

  const handleToggleSign = () => {
    setCurrentInput((prev) => {
      if (prev.startsWith('-')) {
        return prev.substring(1);
      } else {
        return '-' + prev;
      }
    });
  };

  const handleEnter = () => {
    if (isSubmitting) return;

    // Record answer for current question (even if empty)
    const updatedAnswers = { ...answers };
    if (currentQuestion) {
      if (currentInput.trim() !== '') {
        updatedAnswers[currentQuestion.id] = currentInput.trim();
      }
      setAnswers(updatedAnswers);
    }

    // Move to next question or submit if reached end
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
      setCurrentInput('');
    } else {
      // Last question finished
      handleFinalSubmit('manual');
    }
  };

  // Keyboard shortcut for toggle minus sign on desktop
  useEffect(() => {
    const handlePhysicalMinus = (e: KeyboardEvent) => {
      if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        handleToggleSign();
      }
    };
    window.addEventListener('keydown', handlePhysicalMinus);
    return () => window.removeEventListener('keydown', handlePhysicalMinus);
  }, []);

  const answeredCount = Object.keys(answers).length + (currentInput.trim() !== '' ? 1 : 0);
  const isTimeCritical = timeRemaining <= 30; // Last 30 seconds

  return (
    <div className="h-[100dvh] w-full max-w-md mx-auto flex flex-col justify-between p-3 sm:p-4 select-none bg-brand-bg overflow-hidden">
      {/* ────────────────── TOP BAR ────────────────── */}
      <div className="w-full flex items-center justify-between pb-2 border-b border-slate-200/80">
        {/* Level badge */}
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-sm sm:text-base text-brand-dark px-3 py-1 rounded-xl bg-white border border-slate-200 shadow-2xs">
            {level.titleAr}
          </span>
        </div>

        {/* Timer */}
        <div
          className={`flex items-center gap-1.5 px-3.5 py-1 rounded-xl font-bold font-mono text-base sm:text-lg transition-colors border ${
            isTimeCritical
              ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
              : 'bg-white text-brand-darkTeal border-slate-200 shadow-2xs'
          }`}
          dir="ltr"
        >
          <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-red-500' : 'text-brand-teal'}`} />
          <span>{formatTime(timeRemaining)}</span>
        </div>

        {/* Finish early button */}
        <button
          type="button"
          onClick={() => setIsConfirmOpen(true)}
          className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-red-600 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-red-200 active:scale-95 transition-all cursor-pointer"
          title="إنهاء الاختبار مبكرًا"
        >
          <span>إنهاء</span>
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ────────────────── MIDDLE: QUESTION & ANSWER ────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center py-1 sm:py-2">
        {/* Question Counter & Progress Bar */}
        <div className="w-full flex items-center justify-between text-xs text-brand-muted font-bold px-2 mb-1.5">
          <span>السؤال {currentIndex + 1} من {totalQuestions}</span>
          <span>تم إجابة {answeredCount}</span>
        </div>

        {/* Progress line */}
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-brand-teal transition-all duration-200 rounded-full"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Question Numbers Card (Mental Math Soroban Stack) */}
        <div className="w-full bg-white rounded-3xl p-4 sm:p-5 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col items-center">
          {currentQuestion ? (
            <div className="w-full max-w-[200px] flex flex-col items-center justify-center font-mono">
              {/* If multiplication expression exists (e.g. "56 × 4"), render expression */}
              {currentQuestion.expression ? (
                <div className="w-full flex items-center justify-center py-4 mb-2" dir="ltr">
                  <span className="text-3xl sm:text-4xl font-black tracking-widest text-brand-slate font-mono">
                    {currentQuestion.expression}
                  </span>
                </div>
              ) : currentQuestion.rows ? (
                /* Stack of numbers */
                <div className="w-full flex flex-col items-center space-y-0.5 mb-3">
                  {currentQuestion.rows.map((num, i) => {
                    const isNegative = num < 0;
                    const displayValue = Math.abs(num);
                    const showPlus = i > 0 && !isNegative;

                    return (
                      <div
                        key={i}
                        className="w-full flex items-center justify-between text-2xl sm:text-3xl font-black tracking-wider text-brand-slate py-0.5 px-3"
                        dir="ltr"
                      >
                        {/* Sign indicator */}
                        <span className="w-6 text-center text-lg sm:text-xl font-bold">
                          {isNegative ? (
                            <span className="text-rose-500 font-extrabold">-</span>
                          ) : showPlus ? (
                            <span className="text-teal-600 font-bold">+</span>
                          ) : (
                            <span className="text-transparent"> </span>
                          )}
                        </span>

                        {/* Number value */}
                        <span className="soroban-num text-right flex-1 text-2xl sm:text-3xl font-extrabold">
                          {displayValue}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {/* Dividing separator line */}
              <div className="w-full h-0.5 bg-slate-300 rounded-full mb-3" />

              {/* Answer Input Field */}
              <div className="w-full relative flex items-center">
                <div
                  className={`w-full h-13 sm:h-14 rounded-2xl bg-brand-bg border-2 flex items-center justify-center px-4 font-mono text-2xl sm:text-3xl font-black transition-all ${
                    currentInput !== ''
                      ? 'border-brand-teal bg-teal-50/20 text-brand-dark'
                      : 'border-slate-300 text-slate-400'
                  }`}
                  dir="ltr"
                >
                  {currentInput !== '' ? (
                    <span className="tracking-widest">{currentInput}</span>
                  ) : (
                    <span className="text-slate-300 font-normal text-lg tracking-normal flex items-center">
                      اكتب الإجابة
                      <span className="inline-block w-0.5 h-6 bg-brand-teal animate-pulse mr-1" />
                    </span>
                  )}
                </div>

                {/* Optional Negative Toggle Button (±) for problems with negative answers */}
                <button
                  type="button"
                  onClick={handleToggleSign}
                  className="absolute left-2 p-1.5 rounded-xl bg-white border border-slate-200 text-brand-muted hover:text-brand-dark active:scale-90 transition-all text-xs font-bold shadow-2xs cursor-pointer"
                  title="تغيير الإشارة (+/-)"
                  aria-label="تغيير إشارة الإجابة"
                >
                  ±
                </button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-brand-muted">
              جاري تحميل السؤال التالي...
            </div>
          )}
        </div>
      </div>

      {/* ────────────────── BOTTOM: CUSTOM NUMERIC KEYBOARD ────────────────── */}
      <div className="w-full pb-1">
        <CustomKeypad
          onDigitPress={handleDigitPress}
          onBackspace={handleBackspace}
          onEnter={handleEnter}
          disabled={isSubmitting}
        />
      </div>

      {/* Confirmation Modal for Early Finish */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onConfirm={() => {
          setIsConfirmOpen(false);
          handleFinalSubmit('manual');
        }}
        onCancel={() => setIsConfirmOpen(false)}
        answeredCount={answeredCount}
        totalCount={totalQuestions}
      />
    </div>
  );
};
