'use client';

import React, { useRef, useEffect } from 'react';

interface OtpInputProps {
  value: string;
  onChange: (otp: string) => void;
  disabled?: boolean;
  length?: number;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  disabled = false,
  length = 6,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const rawVal = e.target.value;
    const digitsOnly = rawVal.replace(/\D/g, '');

    if (!digitsOnly) {
      // Clear current digit
      const chars = value.split('');
      chars[idx] = '';
      onChange(chars.join(''));
      return;
    }

    // Handle single character typed
    if (digitsOnly.length === 1) {
      const chars = value.padEnd(length, ' ').split('');
      chars[idx] = digitsOnly;
      const nextValue = chars.join('').trimEnd();
      onChange(nextValue);

      // Auto-advance to next input
      if (idx < length - 1) {
        inputRefs.current[idx + 1]?.focus();
      }
      return;
    }

    // Handle multiple digits (pasted or autofilled)
    const pastedDigits = digitsOnly.slice(0, length);
    onChange(pastedDigits);

    // Focus last filled index or next empty
    const nextFocusIdx = Math.min(pastedDigits.length, length - 1);
    inputRefs.current[nextFocusIdx]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace') {
      if (!value[idx] && idx > 0) {
        // Move to previous box if current is empty
        inputRefs.current[idx - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowRight' && idx < length - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text/plain');
    const digitsOnly = pastedText.replace(/\D/g, '').slice(0, length);
    if (digitsOnly) {
      onChange(digitsOnly);
      const nextFocusIdx = Math.min(digitsOnly.length, length - 1);
      inputRefs.current[nextFocusIdx]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-2.5">
      {Array.from({ length }).map((_, idx) => {
        const digit = value[idx] || '';

        return (
          <input
            key={idx}
            ref={(el) => {
              inputRefs.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            onPaste={handlePaste}
            disabled={disabled}
            autoFocus={idx === 0}
            className={`w-11 sm:w-12 h-13 sm:h-14 text-center text-lg sm:text-xl font-black rounded-2xl bg-[#F8FAFC] border transition-all duration-200 focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#0F766E]/15 ${
              digit
                ? 'border-[#031B2A] text-[#031B2A]'
                : 'border-[#E2E8F0] text-[#031B2A] focus:border-[#0F766E]'
            } disabled:opacity-50`}
          />
        );
      })}
    </div>
  );
};
