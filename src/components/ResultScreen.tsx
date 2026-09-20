import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, XCircle, MinusCircle, RotateCcw, Send, Clock } from 'lucide-react';
import { ExamResult } from '../types/exam';
import { EXAM_CONFIG } from '../config/examConfig';

interface ResultScreenProps {
  result: ExamResult;
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ result, onRestart }) => {
  useEffect(() => {
    // Launch celebratory confetti when the student achieved points
    try {
      if (result.score > 0) {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#019599', '#23aab0', '#ffde17', '#10b981'],
        });
      }
    } catch {
      // Ignore if canvas confetti fails in restricted environment
    }
  }, [result.score]);

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between px-4 py-6 max-w-md mx-auto text-center">
      {/* Top Brand Header */}
      <div>
        <div className="flex items-center justify-center gap-2 mb-3">
          <img src="/brand/logo.svg" alt="logo" className="w-9 h-9 object-contain" />
          <span className="text-xs font-bold text-brand-darkTeal">
            {EXAM_CONFIG.academyNameAr}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-brand-dark mb-1">
          أحسنت يا {result.studentName}! 🎉
        </h1>
        <p className="text-sm font-bold text-brand-teal mb-3">
          {result.level.titleAr}
        </p>
      </div>

      {/* Main Score Box */}
      <div className="w-full bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/60 border border-slate-100 my-auto">
        <div className="w-16 h-16 rounded-full bg-brand-teal/10 text-brand-teal mx-auto flex items-center justify-center mb-3">
          <Award className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold text-brand-muted block mb-1">
          النتيجة النهائية
        </span>

        <div className="text-4xl sm:text-5xl font-black text-brand-dark tracking-tight mb-2" dir="ltr">
          <span className="text-brand-teal">{result.score}</span>
          <span className="text-slate-300 mx-1">/</span>
          <span className="text-slate-600 text-3xl sm:text-4xl">{result.totalQuestions}</span>
        </div>

        {/* Completion status */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-brand-muted text-xs font-bold mb-6">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {result.submissionType === 'timeout'
              ? 'انتهى الوقت المحدد (5 دقائق)'
              : 'أنهى الطالب الاختبار قبل انتهاء الوقت'}
          </span>
        </div>

        {/* 4 Statistics Cards */}
        <div className="grid grid-cols-2 gap-2.5 text-right">
          {/* Answered */}
          <div className="bg-brand-bg rounded-2xl p-3 border border-slate-100">
            <span className="text-xs font-medium text-brand-muted block mb-1">
              تم الحل
            </span>
            <span className="text-xl font-black text-brand-dark">
              {result.answeredQuestions}
            </span>
          </div>

          {/* Correct */}
          <div className="bg-emerald-50/60 rounded-2xl p-3 border border-emerald-100/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-emerald-700">صحيح</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-xl font-black text-emerald-700">
              {result.correctAnswers}
            </span>
          </div>

          {/* Wrong */}
          <div className="bg-rose-50/60 rounded-2xl p-3 border border-rose-100/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-rose-700">خطأ</span>
              <XCircle className="w-4 h-4 text-rose-600" />
            </div>
            <span className="text-xl font-black text-rose-700">
              {result.wrongAnswers}
            </span>
          </div>

          {/* Unanswered */}
          <div className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200/60">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-600">بدون إجابة</span>
              <MinusCircle className="w-4 h-4 text-slate-500" />
            </div>
            <span className="text-xl font-black text-slate-600">
              {result.unansweredQuestions}
            </span>
          </div>
        </div>

        {/* Telegram delivery note */}
        <div className="mt-5 p-3 rounded-2xl bg-sky-50/70 border border-sky-100 text-sky-800 text-xs font-bold flex items-center justify-center gap-2">
          <Send className="w-4 h-4 text-sky-600" />
          <span>تم إرسال تقرير النتيجة إلى المعلم عبر Telegram 📲</span>
        </div>
      </div>

      {/* Bottom CTA: Retake or select another level */}
      <div className="w-full pt-4 pb-2">
        <button
          type="button"
          onClick={onRestart}
          className="w-full py-4 px-6 bg-gradient-to-r from-brand-teal to-brand-darkTeal text-white font-extrabold text-lg rounded-2xl shadow-lg shadow-brand-teal/25 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>بدء اختبار جديد</span>
        </button>
      </div>
    </div>
  );
};
