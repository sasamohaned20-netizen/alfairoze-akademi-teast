import React, { useState } from 'react';
import { User, ArrowLeft, ArrowRight } from 'lucide-react';
import { EXAM_CONFIG } from '../config/examConfig';

interface StudentInfoScreenProps {
  initialName?: string;
  onSubmit: (name: string) => void;
  onBack: () => void;
}

export const StudentInfoScreen: React.FC<StudentInfoScreenProps> = ({
  initialName = '',
  onSubmit,
  onBack,
}) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('يرجى إدخال اسم الطالب أولاً');
      return;
    }
    if (trimmed.length < 2) {
      setError('يرجى كتابة الاسم بشكل صحيح (حرفين على الأقل)');
      return;
    }
    setError('');
    onSubmit(trimmed);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between px-4 py-8 max-w-md mx-auto">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-brand-muted hover:text-brand-dark active:scale-95 transition-all cursor-pointer"
            aria-label="الرجوع"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <img src="/brand/logo.svg" alt="logo" className="w-8 h-8 object-contain" />
            <span className="text-xs font-bold text-brand-darkTeal">
              {EXAM_CONFIG.academyNameAr}
            </span>
          </div>
          <div className="w-10"></div>
        </div>

        <div className="text-right mb-6">
          <h2 className="text-2xl font-black text-brand-dark mb-1">
            بيانات الطالب
          </h2>
          <p className="text-sm text-brand-muted">
            أدخل اسمك الكريم للبدء في الاختبار واختيار مستواك
          </p>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="w-full my-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-200/60 border border-slate-100">
          <label className="block text-right text-sm font-bold text-brand-slate mb-2">
            اسم الطالب بالكامل
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-brand-teal">
              <User className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="مثال: محمد أحمد"
              autoFocus
              className={`w-full py-4 pr-12 pl-4 rounded-2xl bg-brand-bg border-2 text-right font-bold text-lg text-brand-dark placeholder:text-slate-400 placeholder:font-normal focus:outline-none transition-all ${
                error
                  ? 'border-red-400 bg-red-50/40 focus:border-red-500'
                  : 'border-slate-200 focus:border-brand-teal focus:bg-white'
              }`}
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs font-bold text-right mt-2 mr-1">
              ⚠️ {error}
            </p>
          )}

          <div className="mt-4 p-3 bg-brand-teal/5 rounded-2xl border border-brand-teal/15 text-right flex items-start gap-2">
            <span className="text-base">💡</span>
            <p className="text-xs text-brand-darkTeal leading-relaxed font-medium">
              سيظهر هذا الاسم في شهادة النتيجة وسيتم إرسال نتيجتك لمعلمك بهذا الاسم.
            </p>
          </div>
        </div>
      </form>

      {/* Bottom Action */}
      <div className="w-full pt-4 pb-2">
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full py-4 px-6 bg-gradient-to-r from-brand-teal to-brand-darkTeal text-white font-extrabold text-lg rounded-2xl shadow-lg shadow-brand-teal/25 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <span>متابعة لاختيار المستوى</span>
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
