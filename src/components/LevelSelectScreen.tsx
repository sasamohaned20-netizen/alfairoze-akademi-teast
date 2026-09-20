import React from 'react';
import { ArrowRight, Play, Clock, HelpCircle } from 'lucide-react';
import { LevelInfo } from '../types/exam';
import { AVAILABLE_LEVELS } from '../data/questionAdapter';

interface LevelSelectScreenProps {
  studentName: string;
  onSelectLevel: (level: LevelInfo) => void;
  onBack: () => void;
}

export const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({
  studentName,
  onSelectLevel,
  onBack,
}) => {
  return (
    <div className="min-h-[100dvh] flex flex-col justify-between px-4 py-6 max-w-md mx-auto">
      {/* Top Bar */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-brand-muted hover:text-brand-dark active:scale-95 transition-all cursor-pointer"
            aria-label="تغيير الاسم"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="text-center">
            <span className="text-xs text-brand-muted font-medium">الطالب:</span>
            <span className="text-sm font-extrabold text-brand-teal mr-1.5">{studentName}</span>
          </div>
          <div className="w-10"></div>
        </div>

        <div className="text-right mb-4">
          <h2 className="text-2xl font-black text-brand-dark mb-1">
            اختر مستواك
          </h2>
          <p className="text-xs text-brand-muted">
            اضغط على المستوى الذي تتدرب عليه لبدء الاختبار مباشرة
          </p>
        </div>
      </div>

      {/* Level Cards List */}
      <div className="space-y-3 my-2 overflow-y-auto max-h-[calc(100dvh-200px)] pr-0.5 no-scrollbar">
        {AVAILABLE_LEVELS.map((level) => (
          <div
            key={level.id}
            onClick={() => onSelectLevel(level)}
            className="group bg-white rounded-2xl p-4 sm:p-5 border-2 border-slate-100 hover:border-brand-teal/50 shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer flex items-center justify-between gap-3 text-right"
          >
            {/* Action button */}
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-brand-teal/10 text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-all shrink-0">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>

            {/* Level Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 justify-end">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-bg text-brand-muted border border-slate-200">
                  {level.badge}
                </span>
                <h3 className="text-base sm:text-lg font-black text-brand-dark group-hover:text-brand-teal transition-colors">
                  {level.titleAr}
                </h3>
              </div>

              <div className="flex items-center gap-3 text-xs text-brand-muted justify-end">
                <span className="inline-flex items-center gap-1">
                  <span>5 دقائق</span>
                  <Clock className="w-3.5 h-3.5" />
                </span>
                <span className="inline-flex items-center gap-1">
                  <span>100 سؤال عشوائي</span>
                  <HelpCircle className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="text-center pt-2">
        <p className="text-[11px] text-brand-muted">
          تأكد من استعدادك قبل البدء — يبدأ العد التنازلي فور اختيار المستوى ⏱️
        </p>
      </div>
    </div>
  );
};
