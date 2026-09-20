import React from 'react';
import { AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  answeredCount: number;
  totalCount: number;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  answeredCount,
  totalCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-150">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 border border-amber-200/60 mx-auto flex items-center justify-center mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-black text-brand-dark mb-2">
          هل أنت متأكد من إنهاء الاختبار؟
        </h3>

        <p className="text-sm text-brand-muted mb-4 leading-relaxed">
          لقد أجبت على <span className="font-bold text-brand-teal">{answeredCount}</span> من أصل{' '}
          <span className="font-bold text-brand-dark">{totalCount}</span> سؤال. لن تتمكن من العودة بعد
          الإنهاء.
        </p>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base shadow-md shadow-rose-600/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>إنهاء الاختبار الآن</span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-brand-slate font-bold text-base active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>العودة للاختبار</span>
          </button>
        </div>
      </div>
    </div>
  );
};
