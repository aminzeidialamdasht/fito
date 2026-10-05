import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

interface FormFieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

export function FormField({ label, hint, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold opacity-70 block">{label}</label>
      {children}
      {hint && <p className="text-[10px] opacity-50 mt-1">{hint}</p>}
    </div>
  );
}

interface InputProps {
  value: any;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  isDark?: boolean;
  min?: number;
  max?: number;
  step?: number;
  showButtons?: boolean;
}


export function Input({ value, onChange, type = 'text', placeholder, isDark, min, max, step = 1, showButtons = false }: InputProps) {
  const isNumber = type === 'number';

  const toPersian = (s: string) => s.replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

  const handleIncrement = () => {
    const current = Number(value) || 0;
    const next = Math.min(current + step, max ?? Infinity);
    onChange(String(next));
  };

  const handleDecrement = () => {
    const current = Number(value) || 0;
    const next = Math.max(current - step, min ?? 0);
    onChange(String(next));
  };

  const baseInputClass = isDark
    ? 'bg-white/5 border-white/10 text-white focus:border-violet-500 placeholder:text-gray-600'
    : 'bg-white border-gray-200 text-gray-900 focus:border-violet-500 placeholder:text-gray-400';

  const handleNumericChange = (raw: string) => {
    const englishDigits = raw.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
    const cleaned = englishDigits.replace(/[^0-9]/g, '');
    onChange(cleaned);
  };

  if (isNumber && showButtons) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDecrement}
          className={`w-12 h-12 shrink-0 rounded-xl border text-xl font-black flex items-center justify-center transition-all active:scale-95 ${baseInputClass}`}
          aria-label="کاهش"
        >
          −
        </button>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={toPersian(String(value ?? ''))}
          onChange={(e) => handleNumericChange(e.target.value)}
          onFocus={(e) => e.target.select()}
          placeholder={placeholder}
          className={`flex-1 min-w-0 text-center px-4 py-3 rounded-xl border text-lg font-black outline-none transition-colors ${baseInputClass}`}
        />
        <button
          type="button"
          onClick={handleIncrement}
          className={`w-12 h-12 shrink-0 rounded-xl border text-xl font-black flex items-center justify-center transition-all active:scale-95 ${baseInputClass}`}
          aria-label="افزایش"
        >
          +
        </button>
      </div>
    );
  }

  return (
    <input
      type={isNumber ? 'text' : type}
      inputMode={isNumber ? 'numeric' : undefined}
      pattern={isNumber ? '[0-9]*' : undefined}
      value={isNumber ? toPersian(String(value ?? '')) : (value ?? '')}
      onChange={(e) => isNumber ? handleNumericChange(e.target.value) : onChange(e.target.value)}
      onFocus={(e) => isNumber && e.target.select()}
      placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-xl border text-sm font-bold outline-none transition-colors ${baseInputClass}`}
    />
  );
}

interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  isDark?: boolean;
}

export function Select({ value, onChange, options, placeholder, isDark }: SelectProps) {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-3 rounded-xl border text-sm font-bold outline-none transition-colors ${
        isDark
          ? 'bg-white/5 border-white/10 text-white focus:border-violet-500'
          : 'bg-white border-gray-200 text-gray-900 focus:border-violet-500'
      }`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

interface TextAreaProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  isDark?: boolean;
}

export function TextArea({ value, onChange, placeholder, rows = 3, isDark }: TextAreaProps) {
  return (
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-4 py-3 rounded-xl border text-sm font-bold outline-none transition-colors resize-none ${
        isDark
          ? 'bg-white/5 border-white/10 text-white focus:border-violet-500 placeholder:text-gray-600'
          : 'bg-white border-gray-200 text-gray-900 focus:border-violet-500 placeholder:text-gray-400'
      }`}
    />
  );
}

/**
 * ورودی آرایه‌ای — با دکمه افزودن و برچسب‌های قابل حذف
 * کاربر می‌تواند فاصله و کاما تایپ کند، در onBlur یا Enter تبدیل می‌شود
 */
interface ArrayInputProps {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  isDark?: boolean;
}

export function ArrayInput({ value, onChange, placeholder, isDark }: ArrayInputProps) {
  const [text, setText] = useState('');

  // اگر مقدار از بیرون تغییر کرد، متن را پاک کن
  useEffect(() => {
    setText('');
  }, [value.length]);

  const commit = () => {
    if (!text.trim()) return;
    // جدا کردن با کاما، ویرگول فارسی، یا خط جدید
    const newItems = text
      .split(/[,،\n]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !value.includes(s));

    if (newItems.length > 0) {
      onChange([...value, ...newItems]);
    }
    setText('');
  };

  const remove = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commit();
    }
    // اگر کاما زد، خودکار اضافه کن
    if (e.key === ',' || e.key === '،') {
      e.preventDefault();
      commit();
    }
  };

  return (
    <div className="space-y-2">
      {/* Tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((item, idx) => (
            <span
              key={idx}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
                isDark
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  : 'bg-violet-50 text-violet-700 border border-violet-200'
              }`}
            >
              {item}
              <button
                type="button"
                onClick={() => remove(idx)}
                className="hover:bg-black/10 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input + Add button */}
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          placeholder={placeholder}
          className={`flex-1 px-4 py-3 rounded-xl border text-sm font-bold outline-none transition-colors ${
            isDark
              ? 'bg-white/5 border-white/10 text-white focus:border-violet-500 placeholder:text-gray-600'
              : 'bg-white border-gray-200 text-gray-900 focus:border-violet-500 placeholder:text-gray-400'
          }`}
        />
        <button
          type="button"
          onClick={commit}
          disabled={!text.trim()}
          className={`px-4 rounded-xl font-bold text-sm flex items-center gap-1 disabled:opacity-30 transition-all ${
            isDark ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-50 text-violet-700'
          }`}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

/**
 * انتخاب چندگانه از لیست با اولویت‌بندی
 */
interface PrioritySelectProps {
  value: string[];
  onChange: (v: string[]) => void;
  options: string[];
  isDark?: boolean;
  maxItems?: number;
}

export function PrioritySelect({ value, onChange, options, isDark, maxItems = 5 }: PrioritySelectProps) {
  const toggle = (item: string) => {
    if (value.includes(item)) {
      onChange(value.filter((v) => v !== item));
    } else {
      if (value.length >= maxItems) {
        // جایگزینی آخرین
        onChange([...value.slice(0, maxItems - 1), item]);
      } else {
        onChange([...value, item]);
      }
    }
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const newArr = [...value];
    [newArr[idx - 1], newArr[idx]] = [newArr[idx], newArr[idx - 1]];
    onChange(newArr);
  };

  const moveDown = (idx: number) => {
    if (idx === value.length - 1) return;
    const newArr = [...value];
    [newArr[idx], newArr[idx + 1]] = [newArr[idx + 1], newArr[idx]];
    onChange(newArr);
  };

  return (
    <div className="space-y-3">
      {/* Selected with priority */}
      {value.length > 0 && (
        <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
          <p className={`text-[10px] font-bold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            اولویت‌بندی (بالا = مهم‌تر)
          </p>
          <div className="space-y-1.5">
            {value.map((item, idx) => (
              <div
                key={item}
                className={`flex items-center gap-2 p-2 rounded-lg ${
                  isDark ? 'bg-violet-500/10' : 'bg-violet-50'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black ${
                    isDark ? 'bg-violet-500/30 text-violet-200' : 'bg-violet-200 text-violet-800'
                  }`}
                >
                  {idx + 1}
                </span>
                <span className={`flex-1 text-xs font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {item}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className={`w-6 h-6 rounded flex items-center justify-center text-xs disabled:opacity-30 ${
                      isDark ? 'bg-white/10' : 'bg-white'
                    }`}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(idx)}
                    disabled={idx === value.length - 1}
                    className={`w-6 h-6 rounded flex items-center justify-center text-xs disabled:opacity-30 ${
                      isDark ? 'bg-white/10' : 'bg-white'
                    }`}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => toggle(item)}
                    className={`w-6 h-6 rounded flex items-center justify-center ${
                      isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-500'
                    }`}
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available options */}
      <div className="flex flex-wrap gap-2">
        {options
          .filter((o) => !value.includes(o))
          .map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all active:scale-95 ${
                isDark
                  ? 'bg-white/5 border-white/10 text-gray-300 hover:border-violet-500/50 hover:text-white'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-violet-300 hover:bg-violet-50'
              }`}
            >
              + {opt}
            </button>
          ))}
      </div>

      <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
        حداکثر {maxItems} مورد — با فلش‌ها اولویت را تغییر دهید
      </p>
    </div>
  );
}
