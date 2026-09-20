import React from 'react';
import { Sparkles, ArrowLeft, Brain } from 'lucide-react';
import { EXAM_CONFIG } from '../config/examConfig';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-[100dvh] flex flex-col justify-between items-center px-4 py-8 max-w-md mx-auto text-center">
      {/* Top Header / Brand */}
      <div className="w-full flex flex-col items-center pt-4">
        {/* Academy Circular Logo */}
        <div className="relative mb-6">
          <div className="w-36 h-36 rounded-full p-2 bg-white shadow-lg shadow-brand-teal/10 border-4 border-brand-teal/20 flex items-center justify-center overflow-hidden">
            <img
              src="/brand/logo-badge.png"
              alt="شعار أكاديمية الفيروز"
              className="w-full h-full object-contain rounded-full"
              onError={(e) => {
                // Fallback to svg if png fails
                (e.target as HTMLImageElement).src = '/brand/logo.svg';
              }}
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-brand-gold text-brand-dark p-2 rounded-full shadow-md">
            <Brain className="w-5 h-5" />
          </div>
        </div>

        {/* Academy Titles */}
        <h1 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight mb-1">
          {EXAM_CONFIG.academyNameAr}
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-brand-teal uppercase tracking-widest mb-3">
          {EXAM_CONFIG.academyNameEn}
        </p>

        <div className="inline-flex items-center gap-1.5 bg-brand-teal/10 text-brand-darkTeal px-3.5 py-1 rounded-full text-xs font-bold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-brand-teal" />
          <span>{EXAM_CONFIG.taglineAr}</span>
        </div>
      </div>

      {/* Main Exam Card */}
      <div className="w-full bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-200/60 border border-slate-100 flex flex-col items-center my-auto">
        <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 text-brand-teal flex items-center justify-center mb-4 font-bold text-xl">
          🧮
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-brand-slate mb-2">
          {EXAM_CONFIG.examTitleAr}
        </h2>
        <p className="text-brand-muted text-sm leading-relaxed mb-6">
          {EXAM_CONFIG.examDescriptionAr}
        </p>

        {/* Quick Highlights */}
        <div className="grid grid-cols-2 gap-3 w-full mb-2 text-right">
          <div className="bg-brand-bg rounded-2xl p-3 border border-slate-100 flex flex-col">
            <span className="text-xs text-brand-muted font-medium">عدد الأسئلة</span>
            <span className="text-lg font-bold text-brand-teal">100 سؤال</span>
          </div>
          <div className="bg-brand-bg rounded-2xl p-3 border border-slate-100 flex flex-col">
            <span className="text-xs text-brand-muted font-medium">المدة الزمنية</span>
            <span className="text-lg font-bold text-brand-darkTeal">5 دقائق</span>
          </div>
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="w-full pt-6 pb-2">
        <button
          onClick={onStart}
          className="w-full py-4 px-6 bg-gradient-to-r from-brand-teal to-brand-darkTeal text-white font-extrabold text-lg rounded-2xl shadow-lg shadow-brand-teal/25 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <span>ابدأ الاختبار</span>
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
