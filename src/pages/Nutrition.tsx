import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Apple, AlertTriangle, Target, Utensils, Plus, Trash2, Droplets, Clock } from 'lucide-react';
import { toPersianNumber, getWeekdayName } from '../utils/jalali';
import { useNavigate } from 'react-router-dom';

const WEEKDAY_NAMES = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

export default function Nutrition() {
  const { state, activeProfile, nutritionPrograms, removeNutritionProgram, setActiveNutritionProgram } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  if (!activeProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
          isDark ? 'bg-[#14b8a6]/10' : 'bg-[#14b8a6]/10'
        }`}>
          <Apple size={48} className={isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'} />
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

  const hasNutritionInfo = activeProfile.dietaryGoal || activeProfile.dietType || activeProfile.favoriteFoods.length > 0;
  const activeProgram = nutritionPrograms.find(p => p.id === state.activeNutritionProgram) || nutritionPrograms[0];

  // Today's day name in Persian
  const today = new Date();
  const dayOfWeek = (today.getDay() + 1) % 7; // Saturday = 0
  const todayName = WEEKDAY_NAMES[dayOfWeek];
  const todayMeals = activeProgram?.days?.find(d => 
    d.day.includes(todayName) || d.day === todayName || d.day.includes(getWeekdayName(today))
  ) || activeProgram?.days?.[dayOfWeek % (activeProgram?.days?.length || 1)];

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
        <Apple size={24} className={isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'} />
        تغذیه و رژیم غذایی
      </h2>

      {/* Today's Meal Plan */}
      {activeProgram && todayMeals && (
        <div className={`rounded-2xl p-5 border theme-transition ${
          isDark 
            ? 'bg-gradient-to-l from-[#1a1a2e] to-[#16213e] border-[#14b8a6]/20' 
            : 'bg-gradient-to-l from-white to-[#f0fdfa] border-[#14b8a6]/30'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-[#14b8a6]/20' : 'bg-[#14b8a6]/15'
              }`}>
                <Utensils size={20} className={isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'} />
              </div>
              <div>
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                  برنامه غذایی امروز
                </h3>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
                  {todayMeals.day} • {activeProgram.plan_name}
                </p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              isDark ? 'bg-[#14b8a6]/20 text-[#14b8a6]' : 'bg-[#14b8a6]/15 text-[#0d9488]'
            }`}>
              {toPersianNumber(todayMeals.total_calories)} کالری
            </div>
          </div>

          <div className="space-y-3">
            {(todayMeals.meals || []).map((meal, idx) => (
              <div key={idx} className={`rounded-xl p-4 ${
                isDark ? 'bg-[#0d0d1a]/70' : 'bg-white/80'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-bold text-sm ${isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'}`}>
                    {meal.meal_name}
                  </h4>
                  {meal.time && (
                    <span className={`flex items-center gap-1 text-xs ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
                      <Clock size={12} />
                      {meal.time}
                    </span>
                  )}
                </div>
                <div className="space-y-1.5">
                  {(meal.foods || []).map((food, fi) => (
                    <div key={fi} className="flex items-center justify-between text-xs">
                      <span className={isDark ? 'text-gray-300' : 'text-[#134e4a]'}>
                        • {food.name} <span className={isDark ? 'text-gray-500' : 'text-[#0f766e]/60'}>({food.portion})</span>
                      </span>
                      <span className={`font-bold ${isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'}`}>
                        {toPersianNumber(food.calories)} کال
                      </span>
                    </div>
                  ))}
                </div>
                {meal.preparation && (
                  <p className={`text-[11px] mt-2 ${isDark ? 'text-gray-500' : 'text-[#0f766e]/50'}`}>
                    📝 {meal.preparation}
                  </p>
                )}
              </div>
            ))}
          </div>

          {todayMeals.notes && (
            <p className={`text-xs mt-3 ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
              💡 {todayMeals.notes}
            </p>
          )}

          {activeProgram.hydration && (
            <div className={`flex items-center gap-2 mt-3 pt-3 border-t ${
              isDark ? 'border-gray-700' : 'border-[#14b8a6]/20'
            }`}>
              <Droplets size={14} className={isDark ? 'text-[#4a90d9]' : 'text-[#0d9488]'} />
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
                {activeProgram.hydration}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Full Program Days */}
      {activeProgram && activeProgram.days && activeProgram.days.length > 0 && (
        <div className={`rounded-2xl p-5 border theme-transition ${
          isDark ? 'bg-[#1a1a2e] border-[#14b8a6]/10' : 'bg-white border-[#14b8a6]/15'
        }`}>
          <h3 className={`font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'}`}>
            <Utensils size={18} />
            برنامه کامل — {activeProgram.plan_name}
          </h3>

          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
            <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]' : 'bg-[#f0fdfa]'}`}>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-[#0f766e]/60'}`}>کالری روزانه</p>
              <p className={`font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                {toPersianNumber(activeProgram.daily_calories)}
              </p>
            </div>
            <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]' : 'bg-[#f0fdfa]'}`}>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-[#0f766e]/60'}`}>پروتئین</p>
              <p className={`font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                {toPersianNumber(activeProgram.macros.protein)}g
              </p>
            </div>
            <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]' : 'bg-[#f0fdfa]'}`}>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-[#0f766e]/60'}`}>کربوهیدرات</p>
              <p className={`font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                {toPersianNumber(activeProgram.macros.carbs)}g
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {activeProgram.days.map((day, di) => (
              <div key={di} className={`rounded-xl p-4 border ${
                isDark ? 'bg-[#0d0d1a] border-gray-800' : 'bg-[#f0fdfa] border-[#14b8a6]/20'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-bold ${isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'}`}>
                    {day.day}
                  </h4>
                  <span className={`text-xs font-bold ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
                    {toPersianNumber(day.total_calories)} کالری
                  </span>
                </div>
                {(day.meals || []).map((meal, mi) => (
                  <div key={mi} className={`mb-3 last:mb-0 pb-3 last:pb-0 border-b last:border-0 ${
                    isDark ? 'border-gray-800' : 'border-[#14b8a6]/10'
                  }`}>
                    <p className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                      {meal.meal_name} {meal.time && <span className={`font-normal text-xs ${isDark ? 'text-gray-500' : 'text-[#0f766e]/50'}`}>({meal.time})</span>}
                    </p>
                    {(meal.foods || []).map((food, fi) => (
                      <p key={fi} className={`text-xs ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
                        • {food.name} — {food.portion} ({toPersianNumber(food.calories)} کالری | P:{toPersianNumber(food.protein)} C:{toPersianNumber(food.carbs)} F:{toPersianNumber(food.fats)})
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nutrition Summary (profile info) */}
      <div className={`rounded-2xl p-6 border theme-transition ${
        isDark 
          ? 'bg-gradient-to-l from-[#1a1a2e] to-[#16213e] border-[#14b8a6]/20' 
          : 'bg-gradient-to-l from-white to-[#f0fdfa] border-[#14b8a6]/30'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isDark ? 'bg-[#14b8a6]/20' : 'bg-[#14b8a6]/15'
          }`}>
            <Target size={24} className={isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'} />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
              خلاصه تغذیه پروفایل
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
              {activeProfile.name}
            </p>
          </div>
        </div>

        {!hasNutritionInfo ? (
          <div className={`rounded-xl p-4 text-center ${
            isDark ? 'bg-[#0d0d1a]/50' : 'bg-[#f0fdfa]'
          }`}>
            <AlertTriangle size={32} className={`mx-auto mb-2 ${isDark ? 'text-[#f59e0b]' : 'text-[#d97706]'}`} />
            <p className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
              اطلاعات تغذیه تکمیل نشده
            </p>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
              لطفاً به بخش پروفایل رفته و اطلاعات تغذیه را تکمیل کنید
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {activeProfile.dietaryGoal && (
              <InfoCard label="هدف رژیم" value={activeProfile.dietaryGoal} isDark={isDark} />
            )}
            {activeProfile.dietType && (
              <InfoCard label="نوع رژیم" value={activeProfile.dietType} isDark={isDark} />
            )}
            <InfoCard label="وعده‌های روزانه" value={`${toPersianNumber(activeProfile.mealsPerDay || 3)} وعده`} isDark={isDark} />
            {activeProfile.calorieTarget && (
              <InfoCard label="کالری هدف" value={`${toPersianNumber(activeProfile.calorieTarget)} کالری`} isDark={isDark} />
            )}
          </div>
        )}
      </div>

      {/* Favorite / Disliked / Allergies */}
      {activeProfile.favoriteFoods.length > 0 && (
        <div className={`rounded-2xl p-5 border theme-transition ${
          isDark ? 'bg-[#1a1a2e] border-[#14b8a6]/10' : 'bg-white border-[#14b8a6]/15'
        }`}>
          <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'}`}>
            <Utensils size={18} />
            غذاهای مورد علاقه
          </h3>
          <div className="flex flex-wrap gap-2">
            {activeProfile.favoriteFoods.map((food, idx) => (
              <span key={idx} className={`px-3 py-1.5 rounded-lg text-sm ${
                isDark ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#10b981]/15 text-[#059669]'
              }`}>
                {food}
              </span>
            ))}
          </div>
        </div>
      )}

      {activeProfile.dislikedFoods.length > 0 && (
        <div className={`rounded-2xl p-5 border theme-transition ${
          isDark ? 'bg-[#1a1a2e] border-[#14b8a6]/10' : 'bg-white border-[#14b8a6]/15'
        }`}>
          <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-[#ef4444]' : 'text-[#dc2626]'}`}>
            <AlertTriangle size={18} />
            غذاهای مورد عدم علاقه
          </h3>
          <div className="flex flex-wrap gap-2">
            {activeProfile.dislikedFoods.map((food, idx) => (
              <span key={idx} className={`px-3 py-1.5 rounded-lg text-sm ${
                isDark ? 'bg-[#ef4444]/20 text-[#ef4444]' : 'bg-red-50 text-red-700'
              }`}>
                {food}
              </span>
            ))}
          </div>
        </div>
      )}

      {activeProfile.foodAllergies.length > 0 && (
        <div className={`rounded-2xl p-5 border theme-transition ${
          isDark ? 'bg-[#1a1a2e] border-[#ef4444]/20' : 'bg-white border-red-200'
        }`}>
          <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-[#ef4444]' : 'text-[#dc2626]'}`}>
            <AlertTriangle size={18} />
            آلرژی‌های غذایی
          </h3>
          <div className="flex flex-wrap gap-2">
            {activeProfile.foodAllergies.map((allergy, idx) => (
              <span key={idx} className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                isDark ? 'bg-[#ef4444]/20 text-[#ef4444]' : 'bg-red-50 text-red-700'
              }`}>
                ⚠️ {allergy}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Nutrition Programs List */}
      <div className={`rounded-2xl p-5 border theme-transition ${
        isDark ? 'bg-[#1a1a2e] border-[#14b8a6]/10' : 'bg-white border-[#14b8a6]/15'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'}`}>
            <Utensils size={18} />
            برنامه‌های غذایی
          </h3>
          <button
            onClick={() => navigate('/nutrition-import')}
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

        {nutritionPrograms.length === 0 ? (
          <p className={`text-sm text-center py-4 ${isDark ? 'text-gray-500' : 'text-[#0f766e]/50'}`}>
            هنوز برنامه غذایی وارد نشده است
          </p>
        ) : (
          <div className="space-y-3">
            {nutritionPrograms.map(program => (
              <div
                key={program.id}
                onClick={() => setActiveNutritionProgram(program.id)}
                className={`rounded-xl p-4 border cursor-pointer transition-all ${
                  program.id === (state.activeNutritionProgram || nutritionPrograms[0]?.id)
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
                    {program.plan_name}
                    {program.id === (state.activeNutritionProgram || nutritionPrograms[0]?.id) && (
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
                        removeNutritionProgram(program.id);
                      }
                    }}
                    className="text-red-500 hover:bg-red-500/10 p-1 rounded transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
                  {program.duration}
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>
                    کالری: <span className={`font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                      {toPersianNumber(program.daily_calories)}
                    </span>
                  </div>
                  <div className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>
                    پروتئین: <span className={`font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                      {toPersianNumber(program.macros.protein)}g
                    </span>
                  </div>
                  <div className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>
                    روزها: <span className={`font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                      {toPersianNumber(program.days.length)}
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
