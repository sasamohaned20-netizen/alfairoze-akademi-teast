import React, { useEffect, useCallback } from 'react';
import { Delete, CornerDownLeft } from 'lucide-react';

interface CustomKeypadProps {
  onDigitPress: (digit: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  disabled?: boolean;
}

export const CustomKeypad: React.FC<CustomKeypadProps> = ({
  onDigitPress,
  onBackspace,
  onEnter,
  disabled = false,
}) => {
  // Vibration feedback for touch devices (if supported)
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(12);
    }
  };

  const handleDigit = (digit: string) => {
    if (disabled) return;
    triggerHaptic();
    onDigitPress(digit);
  };

  const handleBack = () => {
    if (disabled) return;
    triggerHaptic();
    onBackspace();
  };

  const handleEnterKey = () => {
    if (disabled) return;
    triggerHaptic();
    onEnter();
  };

  // Keyboard listener for desktop and physical keyboards
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (disabled) return;

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        onDigitPress(e.key);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        onBackspace();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onEnter();
      }
    },
    [disabled, onDigitPress, onBackspace, onEnter]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="w-full max-w-sm mx-auto select-none pt-1">
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {/* Row 1: 1, 2, 3 */}
        {['1', '2', '3'].map((digit) => (
          <button
            key={digit}
            type="button"
            disabled={disabled}
            onClick={() => handleDigit(digit)}
            className="keypad-btn h-14 sm:h-16 bg-white hover:bg-slate-50 text-brand-dark border-b-4 border-slate-200 active:border-b-0 active:translate-y-1"
          >
            {digit}
          </button>
        ))}

        {/* Row 2: 4, 5, 6 */}
        {['4', '5', '6'].map((digit) => (
          <button
            key={digit}
            type="button"
            disabled={disabled}
            onClick={() => handleDigit(digit)}
            className="keypad-btn h-14 sm:h-16 bg-white hover:bg-slate-50 text-brand-dark border-b-4 border-slate-200 active:border-b-0 active:translate-y-1"
          >
            {digit}
          </button>
        ))}

        {/* Row 3: 7, 8, 9 */}
        {['7', '8', '9'].map((digit) => (
          <button
            key={digit}
            type="button"
            disabled={disabled}
            onClick={() => handleDigit(digit)}
            className="keypad-btn h-14 sm:h-16 bg-white hover:bg-slate-50 text-brand-dark border-b-4 border-slate-200 active:border-b-0 active:translate-y-1"
          >
            {digit}
          </button>
        ))}

        {/* Row 4: Backspace (⌫), 0, Enter (↵) */}
        <button
          type="button"
          disabled={disabled}
          onClick={handleBack}
          className="keypad-btn h-14 sm:h-16 bg-rose-50 hover:bg-rose-100 text-rose-600 border-b-4 border-rose-200 active:border-b-0 active:translate-y-1"
          aria-label="حذف"
        >
          <Delete className="w-6 h-6" />
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => handleDigit('0')}
          className="keypad-btn h-14 sm:h-16 bg-white hover:bg-slate-50 text-brand-dark border-b-4 border-slate-200 active:border-b-0 active:translate-y-1"
        >
          0
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={handleEnterKey}
          className="keypad-btn h-14 sm:h-16 bg-gradient-to-r from-brand-teal to-brand-darkTeal text-white border-b-4 border-teal-800 active:border-b-0 active:translate-y-1 shadow-md shadow-brand-teal/20"
          aria-label="تأكيد وانتقال"
        >
          <CornerDownLeft className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
