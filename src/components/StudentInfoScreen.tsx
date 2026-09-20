import React, { useState } from 'react';
import { User, Phone, ArrowLeft, ArrowRight } from 'lucide-react';
import { EXAM_CONFIG } from '../config/examConfig';

interface StudentInfoScreenProps {
  initialName?: string;
  initialPhone?: string;
  onSubmit: (name: string, phone: string) => void;
  onBack: () => void;
}

export const StudentInfoScreen: React.FC<StudentInfoScreenProps> = ({
  initialName = '',
  initialPhone = '',
  onSubmit,
  onBack,
}) => {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      setError('يرجى إدخال اسم الطالب أولاً');
      return;
    }
    if (trimmedName.length < 2) {
      setError('يرجى كتابة الاسم بشكل صحيح (حرفين على الأقل)');
      return;
    }

    if (!trimmedPhone) {
      setError('يرجى إدخال رقم الموبايل');
      return;
    }

    // Validate phone digits (at least 8 digits)
    const cleanDigits = trimmedPhone.replace(/[\s\-]/g, '');
    if (!/^\+?[0-9]{8,15}$/.test(cleanDigits)) {
      setError('يرجى إدخال رقم موبايل صحيح (أرقام فقط)');
      return;
    }

    setError('');
    onSubmit(trimmedName, trimmedPhone);
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
            أدخل اسمك ورقم الموبايل للبدء في الاختبار
          </p>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="w-full my-auto space-y-4">
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-200/60 border border-slate-100">
          {/* Student Name */}
          <div className="mb-4">
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
                className="w-full py-3.5 pr-12 pl-4 rounded-2xl bg-brand-bg border-2 border-slate-200 focus:border-brand-teal focus:bg-white text-right font-bold text-base sm:text-lg text-brand-dark placeholder:text-slate-400 placeholder:font-normal focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Student Mobile Number */}
          <div className="mb-2">
            <label className="block text-right text-sm font-bold text-brand-slate mb-2">
              رقم الموبايل / ولي الأمر
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-brand-teal">
                <Phone className="w-5 h-5" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (error) setError('');
                }}
                placeholder="مثال: 01012345678"
                dir="ltr"
                className="w-full py-3.5 pr-12 pl-4 rounded-2xl bg-brand-bg border-2 border-slate-200 focus:border-brand-teal focus:bg-white text-right font-bold text-base sm:text-lg text-brand-dark placeholder:text-slate-400 placeholder:font-normal focus:outline-none transition-all font-mono"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-xs font-bold text-right mt-3 mr-1">
              ⚠️ {error}
            </p>
          )}

          <div className="mt-4 p-3 bg-brand-teal/5 rounded-2xl border border-brand-teal/15 text-right flex items-start gap-2">
            <span className="text-base">💡</span>
            <p className="text-xs text-brand-darkTeal leading-relaxed font-medium">
              سيتم إرسال نتيجة الاختبار مع بيانات الطالب ورقم الهاتف إلى معلم الأكاديمية مباشرة.
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
