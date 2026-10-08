import React, { useState } from 'react';

/**
 * تعریف گزینه‌های استاندارد آسیب‌دیدگی
 * value: کلمه کلیدی انگلیسی که موتور ایمنی (injurySafetyEngine) می‌فهمد
 * label: متن فارسی که کاربر می‌بیند
 */
const INJURY_OPTIONS = [
  { value: 'none', label: 'هیچ‌کدام (سالم)' },
  { value: 'lowerBack', label: 'کمردرد / دیسک کمر' },
  { value: 'upperBack', label: 'درد پشت بالایی / گردنی' },
  { value: 'neck', label: 'درد گردن' },
  { value: 'shoulder', label: 'شانه (روتاتور کاف / ضربه)' },
  { value: 'elbow', label: 'آرنج (تنیس آرم / گلفر آرم)' },
  { value: 'wrist', label: 'مچ دست' },
  { value: 'hip', label: 'لگن / مفصل ران' },
  { value: 'knee', label: 'زانو (مینیسک / رباط صلیبی)' },
  { value: 'ankle', label: 'مچ پا / تاندون آشیل' },
  { value: 'hamstring', label: 'همسترینگ (پشت پا)' },
  { value: 'quad', label: 'چهارسر (جلوپا)' },
  { value: 'glute', label: 'سرینی / باسن' },
];

interface InjurySelectorProps {
  selectedValues: string[];
  onChange: (values: string[]) => void;
  isDark?: boolean;
}

export const InjurySelector: React.FC<InjurySelectorProps> = ({ 
  selectedValues, 
  onChange,
  isDark = false 
}) => {
  // مدیریت لوکال استیت برای انیمیشن یا تعامل لحظه‌ای اگر نیاز بود
  // اما اینجا مستقیماً با props کار می‌کنیم تا همگام بمانیم
  
  const handleToggle = (val: string) => {
    if (val === 'none') {
      // اگر "هیچکدام" انتخاب شد، همه چیز پاک شود و فقط none بماند
      onChange(['none']);
    } else {
      let next = selectedValues.filter(v => v !== 'none');
      
      if (next.includes(val)) {
        // حذف اگر قبلاً انتخاب شده بود
        next = next.filter(v => v !== val);
      } else {
        // اضافه کردن
        next.push(val);
      }
      
      // اگر هیچکدام نماند، آیا خودکار "none" برگردد؟ 
      // خیر، بهتر است خالی بماند تا کاربر متوجه شود چیزی انتخاب نکرده،
      // اما در ذخیره‌سازی نهایی، اگر خالی بود، موتور فرض می‌کند سالم است.
      // برای UX بهتر، اگر خالی شد، می‌توانیم warning بدهیم ولی state را خالی نگه داریم.
      onChange(next);
    }
  };

  const isSelected = (val: string) => selectedValues.includes(val);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium theme-transition">
        محدودیت‌های جسمانی و آسیب‌دیدگی‌ها
      </label>
      <p className="text-xs opacity-70 mb-2 theme-transition">
        لطفاً نواحی آسیب‌دیده یا حساس را انتخاب کنید. این اطلاعات مستقیماً در ایمنی برنامه شما تأثیر دارد.
      </p>

      <div className={`flex flex-wrap gap-2 p-4 border rounded-xl transition-all duration-200 ${
        isDark 
          ? 'bg-[#0f0e1f] border-gray-700' 
          : 'bg-[#f5f3ff] border-[#a78bfa]/30'
      }`}>
        {INJURY_OPTIONS.map((opt) => {
          const active = isSelected(opt.value);
          
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleToggle(opt.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                active
                  ? 'bg-violet-600 text-white border-violet-600 shadow-md scale-105'
                  : isDark
                    ? 'bg-transparent text-gray-400 border-gray-600 hover:border-violet-500 hover:text-violet-400'
                    : 'bg-transparent text-gray-600 border-gray-300 hover:border-violet-500 hover:text-violet-600'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* راهنمای سریع برای کاربر */}
      {selectedValues.length > 0 && !selectedValues.includes('none') && (
        <div className={`mt-2 text-xs p-2 rounded-lg ${
          isDark ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-600'
        }`}>
          ⚠️ حرکاتی که فشار زیادی به این نواحی وارد کنند، به صورت خودکار حذف و با جایگزین‌های ایمن تعویض خواهند شد.
        </div>
      )}
    </div>
  );
};
