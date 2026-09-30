import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { validateSupplementJSON } from '../utils/promptGenerator';
import { SupplementProgram } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Pill, Save, Eye, AlertCircle, Check } from 'lucide-react';
import { toPersianNumber } from '../utils/jalali';
import { useNavigate } from 'react-router-dom';

export default function SupplementImport() {
  const { activeProfile, addSupplementProgram, setActiveSupplementProgram } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [jsonInput, setJsonInput] = useState('');
  const [validationResult, setValidationResult] = useState<{ valid: boolean; data?: any; error?: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [imported, setImported] = useState(false);

  const handleValidate = () => {
    try {
      const result = validateSupplementJSON(jsonInput);
      setValidationResult(result);
      setShowPreview(!!(result.valid && result.data && Array.isArray(result.data.supplements)));
    } catch (e: any) {
      setShowPreview(false);
      setValidationResult({
        valid: false,
        error: 'خطا در اعتبارسنجی: ' + (e?.message || 'نامشخص'),
      });
    }
  };

  const handleImport = () => {
    if (!validationResult?.valid || !validationResult.data || !activeProfile) return;
    const supplements = Array.isArray(validationResult.data.supplements)
      ? validationResult.data.supplements
      : [];
    if (!supplements.length) return;

    const programId = uuidv4();
    const program: SupplementProgram = {
      id: programId,
      profileId: activeProfile.id,
      recommendation_title: validationResult.data.recommendation_title || 'برنامه مکمل',
      summary: validationResult.data.summary || '',
      supplements,
      total_estimated_cost: validationResult.data.total_estimated_cost || '',
      important_notes: validationResult.data.important_notes || '',
      warnings: validationResult.data.warnings || '',
      createdAt: new Date().toISOString(),
    };

    addSupplementProgram(program);
    setActiveSupplementProgram(programId);
    setImported(true);
    setJsonInput('');
    setValidationResult(null);
    setShowPreview(false);
    setTimeout(() => {
      setImported(false);
      navigate('/supplements');
    }, 1500);
  };

  const sampleJSON = JSON.stringify({
    "recommendation_title": "توصیه مکمل برای عضله‌سازی",
    "summary": "مکمل‌های پیشنهادی برای افزایش حجم عضلانی",
    "supplements": [
      {
        "name": "پودر پروتئین وی",
        "english_name": "Whey Protein",
        "priority": "بالا",
        "dosage": "۳۰ گرم بعد از تمرین",
        "timing": "بلافاصله بعد از تمرین",
        "benefits": "افزایش سنتز پروتئین، ریکاوری سریع‌تر",
        "side_effects": "در صورت مصرف بیش از حد ممکن است باعث ناراحتی گوارشی شود",
        "estimated_cost": "۳۰۰ هزار تومان",
        "recommended_brands": "اپتیمم نوتریشن، ماسل‌تک",
        "notes": "با آب یا شیر مخلوط کنید"
      }
    ],
    "total_estimated_cost": "۵۰۰ هزار تومان در ماه",
    "important_notes": "مکمل‌ها جایگزین رژیم غذایی مناسب نیستند",
    "warnings": "در صورت داشتن بیماری کلیوی با پزشک مشورت کنید"
  }, null, 2);

  if (!activeProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle size={48} className={isDark ? 'text-[#f59e0b]' : 'text-[#d97706]'} />
        <h2 className={'text-xl font-bold mt-4 mb-2 ' + (isDark ? 'text-white' : 'text-[#134e4a]')}>
          پروفایل انتخاب نشده
        </h2>
        <p className={'text-center ' + (isDark ? 'text-gray-400' : 'text-[#0f766e]/70')}>
          لطفاً ابتدا یک پروفایل را انتخاب کنید
        </p>
      </div>
    );
  }

  const previewSupplements = Array.isArray(validationResult?.data?.supplements)
    ? validationResult!.data.supplements
    : [];

  return (
    <div className="space-y-6">
      <h2 className={'text-2xl font-bold flex items-center gap-2 ' + (isDark ? 'text-white' : 'text-[#134e4a]')}>
        <Pill size={24} className={isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'} />
        ورود برنامه مکمل
      </h2>

      {imported && (
        <div className={'rounded-xl p-4 flex items-center gap-3 animate-slide-up ' + (isDark ? 'bg-[#22c55e]/20 border border-[#22c55e]/30' : 'bg-[#10b981]/15 border border-[#10b981]/30')}>
          <Check size={20} className={isDark ? 'text-[#22c55e]' : 'text-[#059669]'} />
          <span className={'font-bold ' + (isDark ? 'text-[#22c55e]' : 'text-[#059669]')}>
            برنامه مکمل با موفقیت وارد شد! در حال انتقال به صفحه مکمل...
          </span>
        </div>
      )}

      <div className={'rounded-2xl p-5 border theme-transition ' + (isDark ? 'bg-[#1a1a2e] border-[#14b8a6]/10' : 'bg-white border-[#14b8a6]/15')}>
        <h3 className={'font-bold mb-3 ' + (isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]')}>
          JSON برنامه مکمل
        </h3>
        <p className={'text-sm mb-3 ' + (isDark ? 'text-gray-400' : 'text-[#0f766e]/70')}>
          خروجی هوش مصنوعی را در قالب JSON وارد کنید:
        </p>
        <textarea
          value={jsonInput}
          onChange={e => { setJsonInput(e.target.value); setValidationResult(null); setShowPreview(false); }}
          className={'w-full border rounded-xl px-4 py-3 text-sm font-mono focus:outline-none resize-none ' + (
            isDark
              ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#14b8a6]'
              : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]'
          )}
          rows={10}
          dir="ltr"
          placeholder='{"recommendation_title": "...", "supplements": [...]}'
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleValidate}
            disabled={!jsonInput.trim()}
            className={'flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ' + (
              isDark
                ? 'bg-[#4a90d9] text-white hover:bg-[#6bb5ff] disabled:opacity-50'
                : 'bg-[#14b8a6] text-white hover:bg-[#0d9488] disabled:opacity-50'
            )}
          >
            <Eye size={16} />
            اعتبارسنجی و پیش‌نمایش
          </button>
          <button
            onClick={() => setJsonInput(sampleJSON)}
            className={'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all ' + (
              isDark
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            )}
          >
            نمونه JSON
          </button>
        </div>
      </div>

      {validationResult && !validationResult.valid && (
        <div className={'rounded-xl p-4 flex items-start gap-3 ' + (isDark ? 'bg-[#ef4444]/10 border border-[#ef4444]/30' : 'bg-red-50 border border-red-200')}>
          <AlertCircle size={20} className={isDark ? 'text-[#ef4444]' : 'text-[#dc2626]'} />
          <div>
            <p className={'font-bold ' + (isDark ? 'text-[#ef4444]' : 'text-[#dc2626]')}>خطا در اعتبارسنجی</p>
            <p className={'text-sm mt-1 ' + (isDark ? 'text-gray-400' : 'text-[#0f766e]/70')}>
              {validationResult.error}
            </p>
          </div>
        </div>
      )}

      {showPreview && validationResult?.valid && previewSupplements.length > 0 && (
        <div className={'rounded-2xl p-5 border animate-slide-up ' + (isDark ? 'bg-[#1a1a2e] border-[#22c55e]/20' : 'bg-white border-[#10b981]/30')}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={'font-bold flex items-center gap-2 ' + (isDark ? 'text-[#22c55e]' : 'text-[#059669]')}>
              <Check size={18} />
              پیش‌نمایش برنامه
            </h3>
            <button
              onClick={handleImport}
              className={'flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ' + (
                isDark
                  ? 'bg-[#22c55e] text-white hover:bg-[#16a34a]'
                  : 'bg-[#10b981] text-white hover:bg-[#059669]'
              )}
            >
              <Save size={16} />
              ذخیره برنامه
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm">
              <span className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>عنوان:</span>
              <span className={'font-bold ' + (isDark ? 'text-white' : 'text-[#134e4a]')}>
                {validationResult.data?.recommendation_title || '—'}
              </span>
            </div>
            {validationResult.data?.summary && (
              <div className="flex items-center gap-4 text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>خلاصه:</span>
                <span className={isDark ? 'text-white' : 'text-[#134e4a]'}>
                  {validationResult.data.summary}
                </span>
              </div>
            )}
            <div className="flex items-center gap-4 text-sm">
              <span className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>تعداد مکمل:</span>
              <span className={'font-bold ' + (isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]')}>
                {toPersianNumber(previewSupplements.length)} مورد
              </span>
            </div>
            {validationResult.data?.total_estimated_cost && (
              <div className="flex items-center gap-4 text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>هزینه ماهانه:</span>
                <span className={isDark ? 'text-white' : 'text-[#134e4a]'}>
                  {validationResult.data.total_estimated_cost}
                </span>
              </div>
            )}

            <div className={'border-t pt-4 mt-4 ' + (isDark ? 'border-gray-700' : 'border-[#14b8a6]/20')}>
              <h4 className={'font-bold mb-3 ' + (isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]')}>
                مکمل‌های پیشنهادی
              </h4>
              <div className="space-y-3">
                {previewSupplements.map((supp: any, i: number) => (
                  <div key={i} className={'rounded-xl p-4 ' + (isDark ? 'bg-[#0d0d1a]' : 'bg-[#f0fdfa]')}>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className={'font-bold ' + (isDark ? 'text-white' : 'text-[#134e4a]')}>
                        {supp?.name || ('مکمل ' + (i + 1))}
                      </h5>
                      {supp?.priority && (
                        <span className={'text-xs px-2 py-1 rounded-full ' + (
                          supp.priority === 'بالا'
                            ? (isDark ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#10b981]/15 text-[#059669]')
                            : (isDark ? 'bg-[#f59e0b]/20 text-[#f59e0b]' : 'bg-amber-50 text-amber-700')
                        )}>
                          اولویت: {supp.priority}
                        </span>
                      )}
                    </div>
                    {supp?.dosage && (
                      <p className={'text-xs mb-1 ' + (isDark ? 'text-gray-400' : 'text-[#0f766e]/70')}>
                        دوز: {supp.dosage}
                      </p>
                    )}
                    {supp?.timing && (
                      <p className={'text-xs mb-1 ' + (isDark ? 'text-gray-400' : 'text-[#0f766e]/70')}>
                        زمان مصرف: {supp.timing}
                      </p>
                    )}
                    {supp?.estimated_cost && (
                      <p className={'text-xs ' + (isDark ? 'text-gray-400' : 'text-[#0f766e]/70')}>
                        هزینه: {supp.estimated_cost}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
