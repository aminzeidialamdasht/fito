import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Pill, AlertTriangle, Plus, Trash2, Clock, DollarSign, Shield } from 'lucide-react';
import { toPersianNumber } from '../utils/jalali';
import { useNavigate } from 'react-router-dom';

export default function Supplements() {
  const { state, activeProfile, supplementPrograms, removeSupplementProgram, setActiveSupplementProgram } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  if (!activeProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
          isDark ? 'bg-[#14b8a6]/10' : 'bg-[#14b8a6]/10'
        }`}>
          <Pill size={48} className={isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'} />
        </div>
        <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
          پروفایل انتخاب نشده
        </h2>
        <p className={`text-center max-w-md ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
          لطفاً ابتدا یک پروفایل را از داشبورد انتخاب کنید
        </p>
      </div>
    );
  }

  const activeProgram = supplementPrograms.find(p => p.id === state.activeSupplementProgram) || supplementPrograms[0];

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
        <Pill size={24} className={isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'} />
        مکمل‌های ورزشی
      </h2>

      {/* Daily Supplement Intake */}
      {activeProgram && activeProgram.supplements && activeProgram.supplements.length > 0 && (
        <div className={`rounded-2xl p-5 border theme-transition ${
          isDark 
            ? 'bg-gradient-to-l from-[#1a1a2e] to-[#16213e] border-[#14b8a6]/20' 
            : 'bg-gradient-to-l from-white to-[#f0fdfa] border-[#14b8a6]/30'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              isDark ? 'bg-[#14b8a6]/20' : 'bg-[#14b8a6]/15'
            }`}>
              <Pill size={20} className={isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'} />
            </div>
            <div>
              <h3 className={`font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                مصرف روزانه مکمل‌ها
              </h3>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
                {activeProgram.recommendation_title}
              </p>
            </div>
          </div>

          {activeProgram.summary && (
            <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-[#0f766e]/80'}`}>
              {activeProgram.summary}
            </p>
          )}

          <div className="space-y-3">
            {activeProgram.supplements.map((supp, idx) => (
              <div key={idx} className={`rounded-xl p-4 ${
                isDark ? 'bg-[#0d0d1a]/70' : 'bg-white/80'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                      {supp.name}
                    </h4>
                    {supp.english_name && (
                      <p className={`text-[11px] ${isDark ? 'text-gray-500' : 'text-[#0f766e]/50'}`}>
                        {supp.english_name}
                      </p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                    supp.priority === 'بالا' || supp.priority === 'high'
                      ? isDark ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#10b981]/15 text-[#059669]'
                      : isDark ? 'bg-[#f59e0b]/20 text-[#f59e0b]' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {supp.priority}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`flex items-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
                    <Clock size={12} />
                    <span>{supp.timing || supp.dosage}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
                    <Pill size={12} />
                    <span>{supp.dosage}</span>
                  </div>
                </div>

                {supp.benefits && (
                  <p className={`text-[11px] mt-2 ${isDark ? 'text-gray-500' : 'text-[#0f766e]/50'}`}>
                    ✅ {supp.benefits}
                  </p>
                )}
                {supp.notes && (
                  <p className={`text-[11px] mt-1 ${isDark ? 'text-gray-500' : 'text-[#0f766e]/50'}`}>
                    📝 {supp.notes}
                  </p>
                )}
              </div>
            ))}
          </div>

          {activeProgram.total_estimated_cost && (
            <div className={`flex items-center gap-2 mt-4 pt-3 border-t ${
              isDark ? 'border-gray-700' : 'border-[#14b8a6]/20'
            }`}>
              <DollarSign size={14} className={isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'} />
              <span className={`text-xs font-bold ${isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'}`}>
                هزینه ماهانه: {activeProgram.total_estimated_cost}
              </span>
            </div>
          )}

          {activeProgram.important_notes && (
            <div className={`mt-3 rounded-lg p-3 ${
              isDark ? 'bg-[#4a90d9]/10' : 'bg-blue-50'
            }`}>
              <p className={`text-xs ${isDark ? 'text-[#6bb5ff]' : 'text-blue-700'}`}>
                💡 {activeProgram.important_notes}
              </p>
            </div>
          )}

          {activeProgram.warnings && (
            <div className={`mt-2 rounded-lg p-3 ${
              isDark ? 'bg-[#ef4444]/10' : 'bg-red-50'
            }`}>
              <p className={`text-xs flex items-start gap-1 ${isDark ? 'text-[#ef4444]' : 'text-red-700'}`}>
                <Shield size={12} className="mt-0.5 flex-shrink-0" />
                {activeProgram.warnings}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Detailed Supplement Cards */}
      {activeProgram && activeProgram.supplements && activeProgram.supplements.length > 0 && (
        <div className={`rounded-2xl p-5 border theme-transition ${
          isDark ? 'bg-[#1a1a2e] border-[#14b8a6]/10' : 'bg-white border-[#14b8a6]/15'
        }`}>
          <h3 className={`font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'}`}>
            <Pill size={18} />
            جزئیات مکمل‌ها
          </h3>
          <div className="space-y-4">
            {activeProgram.supplements.map((supp, idx) => (
              <div key={idx} className={`rounded-xl p-4 border ${
                isDark ? 'bg-[#0d0d1a] border-gray-800' : 'bg-[#f0fdfa] border-[#14b8a6]/20'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className={`font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                      {supp.name}
                    </h4>
                    {supp.english_name && (
                      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-[#0f766e]/50'}`}>
                        {supp.english_name}
                      </p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                    supp.priority === 'بالا' || supp.priority === 'high'
                      ? isDark ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#10b981]/15 text-[#059669]'
                      : isDark ? 'bg-[#f59e0b]/20 text-[#f59e0b]' : 'bg-amber-50 text-amber-700'
                  }`}>
                    اولویت: {supp.priority}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                  <div>
                    <p className={isDark ? 'text-gray-500' : 'text-[#0f766e]/50'}>دوز مصرف</p>
                    <p className={`font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>{supp.dosage}</p>
                  </div>
                  <div>
                    <p className={isDark ? 'text-gray-500' : 'text-[#0f766e]/50'}>زمان مصرف</p>
                    <p className={`font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>{supp.timing}</p>
                  </div>
                  {supp.estimated_cost && (
                    <div>
                      <p className={isDark ? 'text-gray-500' : 'text-[#0f766e]/50'}>هزینه تقریبی</p>
                      <p className={`font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>{supp.estimated_cost}</p>
                    </div>
                  )}
                  {supp.recommended_brands && (
                    <div>
                      <p className={isDark ? 'text-gray-500' : 'text-[#0f766e]/50'}>برندهای پیشنهادی</p>
                      <p className={`font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>{supp.recommended_brands}</p>
                    </div>
                  )}
                </div>

                {supp.benefits && (
                  <p className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
                    <span className="font-bold">فواید:</span> {supp.benefits}
                  </p>
                )}
                {supp.side_effects && (
                  <p className={`text-xs mb-1 ${isDark ? 'text-[#f59e0b]' : 'text-amber-700'}`}>
                    <span className="font-bold">عوارض احتمالی:</span> {supp.side_effects}
                  </p>
                )}
                {supp.notes && (
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-[#0f766e]/50'}`}>
                    <span className="font-bold">نکته:</span> {supp.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Supplement Info from Profile */}
      <div className={`rounded-2xl p-6 border theme-transition ${
        isDark 
          ? 'bg-gradient-to-l from-[#1a1a2e] to-[#16213e] border-[#14b8a6]/20' 
          : 'bg-gradient-to-l from-white to-[#f0fdfa] border-[#14b8a6]/30'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isDark ? 'bg-[#14b8a6]/20' : 'bg-[#14b8a6]/15'
          }`}>
            <Pill size={24} className={isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'} />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
              اطلاعات مکمل پروفایل
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
              {activeProfile.name}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {activeProfile.supplementGoal && (
            <InfoCard label="هدف مصرف" value={activeProfile.supplementGoal} isDark={isDark} />
          )}
          {activeProfile.supplementBudget && (
            <InfoCard label="بودجه ماهانه" value={activeProfile.supplementBudget} isDark={isDark} />
          )}
          <InfoCard 
            label="مکمل‌های فعلی" 
            value={activeProfile.currentSupplements.length > 0 
              ? `${toPersianNumber(activeProfile.currentSupplements.length)} مورد` 
              : 'هیچ'} 
            isDark={isDark} 
          />
        </div>
      </div>

      {/* Current Supplements */}
      {activeProfile.currentSupplements.length > 0 && (
        <div className={`rounded-2xl p-5 border theme-transition ${
          isDark ? 'bg-[#1a1a2e] border-[#14b8a6]/10' : 'bg-white border-[#14b8a6]/15'
        }`}>
          <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'}`}>
            مکمل‌های فعلی
          </h3>
          <div className="flex flex-wrap gap-2">
            {activeProfile.currentSupplements.map((supp, idx) => (
              <span key={idx} className={`px-3 py-1.5 rounded-lg text-sm ${
                isDark ? 'bg-[#4a90d9]/20 text-[#6bb5ff]' : 'bg-[#14b8a6]/15 text-[#0d9488]'
              }`}>
                {supp}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Health Conditions */}
      {activeProfile.healthConditions.length > 0 && (
        <div className={`rounded-2xl p-5 border theme-transition ${
          isDark ? 'bg-[#1a1a2e] border-[#ef4444]/20' : 'bg-white border-red-200'
        }`}>
          <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-[#ef4444]' : 'text-[#dc2626]'}`}>
            <AlertTriangle size={18} />
            شرایط پزشکی
          </h3>
          <div className="flex flex-wrap gap-2">
            {activeProfile.healthConditions.map((condition, idx) => (
              <span key={idx} className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                isDark ? 'bg-[#ef4444]/20 text-[#ef4444]' : 'bg-red-50 text-red-700'
              }`}>
                ⚠️ {condition}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Supplement Programs List */}
      <div className={`rounded-2xl p-5 border theme-transition ${
        isDark ? 'bg-[#1a1a2e] border-[#14b8a6]/10' : 'bg-white border-[#14b8a6]/15'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'}`}>
            <Pill size={18} />
            برنامه‌های مکمل
          </h3>
          <button
            onClick={() => navigate('/supplement-import')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
              isDark
                ? 'bg-[#14b8a6]/20 text-[#14b8a6] hover:bg-[#14b8a6]/30'
                : 'bg-[#14b8a6]/15 text-[#0d9488] hover:bg-[#14b8a6]/25'
            }`}
          >
            <Plus size={14} />
            ورود برنامه
          </button>
        </div>

        {supplementPrograms.length === 0 ? (
          <p className={`text-sm text-center py-4 ${isDark ? 'text-gray-500' : 'text-[#0f766e]/50'}`}>
            هنوز برنامه مکملی وارد نشده است
          </p>
        ) : (
          <div className="space-y-3">
            {supplementPrograms.map(program => (
              <div
                key={program.id}
                onClick={() => setActiveSupplementProgram(program.id)}
                className={`rounded-xl p-4 border cursor-pointer transition-all ${
                  program.id === (state.activeSupplementProgram || supplementPrograms[0]?.id)
                    ? isDark
                      ? 'bg-[#14b8a6]/10 border-[#14b8a6]/40'
                      : 'bg-[#14b8a6]/10 border-[#14b8a6]/40'
                    : isDark
                      ? 'bg-[#0d0d1a] border-gray-800 hover:border-gray-600'
                      : 'bg-[#f0fdfa] border-[#14b8a6]/20 hover:border-[#14b8a6]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                    {program.recommendation_title}
                    {program.id === (state.activeSupplementProgram || supplementPrograms[0]?.id) && (
                      <span className={`mr-2 text-[10px] px-2 py-0.5 rounded-full ${
                        isDark ? 'bg-[#14b8a6]/30 text-[#14b8a6]' : 'bg-[#14b8a6]/20 text-[#0d9488]'
                      }`}>
                        فعال
                      </span>
                    )}
                  </h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('آیا مطمئن هستید؟')) {
                        removeSupplementProgram(program.id);
                      }
                    }}
                    className="text-red-500 hover:bg-red-500/10 p-1 rounded transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
                  {program.summary}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>
                    تعداد مکمل: <span className={`font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                      {toPersianNumber(program.supplements.length)}
                    </span>
                  </div>
                  <div className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>
                    هزینه ماهانه: <span className={`font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                      {program.total_estimated_cost}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ label, value, isDark }: { label: string; value: string; isDark: boolean }) {
  return (
    <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]' : 'bg-[#f0fdfa]'}`}>
      <p className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-[#0f766e]/60'}`}>{label}</p>
      <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>{value}</p>
    </div>
  );
}
