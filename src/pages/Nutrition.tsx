import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Apple, AlertTriangle, Target, Utensils, Plus, Trash2, Droplets, Clock } from 'lucide-react';
import { toPersianNumber, getWeekdayName } from '../utils/jalali';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_NUTRITION_PLAN, SAMPLE_PROFILE } from '../data/defaultPlans';
import type { NutritionProfile } from '../types';

const WEEKDAY_NAMES = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

export default function Nutrition() {
  const { state, activeProfile, nutritionPrograms, removeNutritionProgram, setActiveNutritionProgram } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();  const profile = activeProfile ?? SAMPLE_PROFILE;

  if (!profile) { // Bypass for non-premium to show sample data
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
          isDark ? 'bg-[#a78bfa]/10' : 'bg-[#a78bfa]/10'
        }`}>
          <Apple size={48} className={isDark ? 'text-[#a78bfa]' : 'text-[#8b5cf6]'} />
        </div>
        <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-[#312e81]'}`}>
          پروفایل انتخاب نشده
        </h2>
        <p className={`text-center max-w-md ${isDark ? 'text-gray-400' : 'text-[#7c3aed]/70'}`}>
          لطفاً ابتدا یک پروفایل را از داشبورد انتخاب کنید
        </p>
      </div>
    );
  }

  const nutrition: NutritionProfile = profile.nutrition || {
    dietaryGoal: '',
    dietType: '',
    foodAllergies: [],
    favoriteFoods: [],
    dislikedFoods: [],
    mealsPerDay: 4,
    cookingSkill: 'basic',
  };
  const hasNutritionInfo = nutrition.dietaryGoal || nutrition.dietType || (nutrition.favoriteFoods?.length || 0) > 0;
  const activeProgram = nutritionPrograms.find(p => p.id === state.activeNutritionProgram) || nutritionPrograms[0] || DEFAULT_NUTRITION_PLAN;

  // Today's day name in Persian
  const today = new Date();
  const dayOfWeek = (today.getDay() + 1) % 7; // Saturday = 0
  const todayName = WEEKDAY_NAMES[dayOfWeek];
  const todayMeals = activeProgram?.days?.find(d => 
    d.day.includes(todayName) || d.day === todayName || d.day.includes(getWeekdayName(today))
  ) || activeProgram?.days?.[dayOfWeek % (activeProgram?.days?.length || 1)];

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#312e81]'}`}>
        <Apple size={24} className={isDark ? 'text-[#a78bfa]' : 'text-[#8b5cf6]'} />
        تغذیه و رژیم غذایی
      </h2>

      {/* Today's Meal Plan */}
      {activeProgram && todayMeals && (
        <div className={`rounded-2xl p-5 border theme-transition ${
          isDark 
            ? 'bg-gradient-to-l from-[#1a1830] to-[#16213e] border-[#a78bfa]/20' 
            : 'bg-gradient-to-l from-white to-[#f5f3ff] border-[#a78bfa]/30'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-[#a78bfa]/20' : 'bg-[#a78bfa]/15'
              }`}>
                <Utensils size={20} className={isDark ? 'text-[#a78bfa]' : 'text-[#8b5cf6]'} />
              </div>
              <div>
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-[#312e81]'}`}>
                  برنامه غذایی امروز
                </h3>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-[#7c3aed]/70'}`}>
                  {todayMeals.day} • {activeProgram.plan_name}
                </p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              isDark ? 'bg-[#a78bfa]/20 text-[#a78bfa]' : 'bg-[#a78bfa]/15 text-[#8b5cf6]'
            }`}>
              {toPersianNumber(todayMeals.total_calories)} کالری
            </div>
          </div>

          <div className="space-y-3">
            {(todayMeals.meals || []).map((meal, idx) => (
              <div key={idx} className={`rounded-xl p-4 ${
                isDark ? 'bg-[#0f0e1f]/70' : 'bg-white/80'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-bold text-sm ${isDark ? 'text-[#a78bfa]' : 'text-[#8b5cf6]'}`}>
                    {meal.meal_name}
                  </h4>
                  {meal.time && (
                    <span className={`flex items-center gap-1 text-xs ${isDark ? 'text-gray-400' : 'text-[#7c3aed]/70'}`}>
                      <Clock size={12} />
                      {meal.time}
                    </span>
                  )}
                </div>
                <div className="space-y-1.5">
                  {(meal.foods || []).map((food, fi) => (
                    <div key={fi} className="flex items-center justify-between text-xs">
                      <span className={isDark ? 'text-gray-300' : 'text-[#312e81]'}>
                        • {food.name} <span className={isDark ? 'text-gray-500' : 'text-[#7c3aed]/60'}>({food.portion})</span>
                      </span>
                      <span className={`font-bold ${isDark ? 'text-[#a78bfa]' : 'text-[#8b5cf6]'}`}>
                        {toPersianNumber(food.calories)} کال
                      </span>
                    </div>
                  ))}
                </div>
                {meal.preparation && (
                  <p className={`text-[11px] mt-2 ${isDark ? 'text-gray-500' : 'text-[#7c3aed]/50'}`}>
                    📝 {meal.preparation}
                  </p>
                )}
              </div>
            ))}
          </div>

          {todayMeals.notes && (
            <p className={`text-xs mt-3 ${isDark ? 'text-gray-400' : 'text-[#7c3aed]/70'}`}>
              💡 {todayMeals.notes}
            </p>
          )}

          {activeProgram.hydration && (
            <div className={`flex items-center gap-2 mt-3 pt-3 border-t ${
              isDark ? 'border-gray-700' : 'border-[#a78bfa]/20'
            }`}>
              <Droplets size={14} className={isDark ? 'text-[#4a90d9]' : 'text-[#8b5cf6]'} />
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-[#7c3aed]/70'}`}>
                {activeProgram.hydration}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Full Program Days */}
      {activeProgram && activeProgram.days && activeProgram.days.length > 0 && (
        <div className={`rounded-2xl p-5 border theme-transition ${
          isDark ? 'bg-[#1a1830] border-[#a78bfa]/10' : 'bg-white border-[#a78bfa]/15'
        }`}>
          <h3 className={`font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-[#a78bfa]' : 'text-[#8b5cf6]'}`}>
            <Utensils size={18} />
            برنامه کامل — {activeProgram.plan_name}
          </h3>

          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
            <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0f0e1f]' : 'bg-[#f5f3ff]'}`}>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-[#7c3aed]/60'}`}>کالری روزانه</p>
              <p className={`font-bold ${isDark ? 'text-white' : 'text-[#312e81]'}`}>
                {toPersianNumber(activeProgram.daily_calories)}
              </p>
            </div>
            <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0f0e1f]' : 'bg-[#f5f3ff]'}`}>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-[#7c3aed]/60'}`}>پروتئین</p>
              <p className={`font-bold ${isDark ? 'text-white' : 'text-[#312e81]'}`}>
                {toPersianNumber(activeProgram.macros.protein)}g
              </p>
            </div>
            <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0f0e1f]' : 'bg-[#f5f3ff]'}`}>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-[#7c3aed]/60'}`}>کربوهیدرات</p>
              <p className={`font-bold ${isDark ? 'text-white' : 'text-[#312e81]'}`}>
                {toPersianNumber(activeProgram.macros.carbs)}g
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {activeProgram.days.map((day, di) => (
              <div key={di} className={`rounded-xl p-4 border ${
                isDark ? 'bg-[#0f0e1f] border-gray-800' : 'bg-[#f5f3ff] border-[#a78bfa]/20'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-bold ${isDark ? 'text-[#a78bfa]' : 'text-[#8b5cf6]'}`}>
                    {day.day}
                  </h4>
                  <span className={`text-xs font-bold ${isDark ? 'text-gray-400' : 'text-[#7c3aed]/70'}`}>
                    {toPersianNumber(day.total_calories)} کالری
                  </span>
                </div>
                {(day.meals || []).map((meal, mi) => (
                  <div key={mi} className={`mb-3 last:mb-0 pb-3 last:pb-0 border-b last:border-0 ${
                    isDark ? 'border-gray-800' : 'border-[#a78bfa]/10'
                  }`}>
                    <p className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-[#312e81]'}`}>
                      {meal.meal_name} {meal.time && <span className={`font-normal text-xs ${isDark ? 'text-gray-500' : 'text-[#7c3aed]/50'}`}>({meal.time})</span>}
                    </p>
                    {(meal.foods || []).map((food, fi) => (
                      <p key={fi} className={`text-xs ${isDark ? 'text-gray-400' : 'text-[#7c3aed]/70'}`}>
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
          ? 'bg-gradient-to-l from-[#1a1830] to-[#16213e] border-[#a78bfa]/20' 
          : 'bg-gradient-to-l from-white to-[#f5f3ff] border-[#a78bfa]/30'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isDark ? 'bg-[#a78bfa]/20' : 'bg-[#a78bfa]/15'
          }`}>
            <Target size={24} className={isDark ? 'text-[#a78bfa]' : 'text-[#8b5cf6]'} />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-[#312e81]'}`}>
              خلاصه تغذیه پروفایل
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-[#7c3aed]/70'}`}>
              {profile.name}
            </p>
          </div>
        </div>

        {!hasNutritionInfo ? (
          <div className={`rounded-xl p-4 text-center ${
            isDark ? 'bg-[#0f0e1f]/50' : 'bg-[#f5f3ff]'
          }`}>
            <AlertTriangle size={32} className={`mx-auto mb-2 ${isDark ? 'text-[#f59e0b]' : 'text-[#d97706]'}`} />
            <p className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-[#312e81]'}`}>
              اطلاعات تغذیه تکمیل نشده
            </p>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-[#7c3aed]/70'}`}>
              لطفاً به بخش پروفایل رفته و اطلاعات تغذیه را تکمیل کنید
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {nutrition.dietaryGoal && (
              <InfoCard label="هدف رژیم" value={nutrition.dietaryGoal} isDark={isDark} />
            )}
            {nutrition.dietType && (
              <InfoCard label="نوع رژیم" value={nutrition.dietType} isDark={isDark} />
            )}
            <InfoCard label="وعده‌های روزانه" value={`${toPersianNumber(nutrition.mealsPerDay || 3)} وعده`} isDark={isDark} />
            {nutrition.calorieTarget && (
              <InfoCard label="کالری هدف" value={`${toPersianNumber(nutrition.calorieTarget)} کالری`} isDark={isDark} />
            )}
          </div>
        )}
      </div>

      {/* Favorite / Disliked / Allergies */}
      {(nutrition.favoriteFoods?.length || 0) > 0 && (
        <div className={`rounded-2xl p-5 border theme-transition ${
          isDark ? 'bg-[#1a1830] border-[#a78bfa]/10' : 'bg-white border-[#a78bfa]/15'
        }`}>
          <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-[#a78bfa]' : 'text-[#8b5cf6]'}`}>
            <Utensils size={18} />
            غذاهای مورد علاقه
          </h3>
          <div className="flex flex-wrap gap-2">
            {(nutrition.favoriteFoods || []).map((food: string, idx: number) => (
              <span key={idx} className={`px-3 py-1.5 rounded-lg text-sm ${
                isDark ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#10b981]/15 text-[#059669]'
              }`}>
                {food}
              </span>
            ))}
          </div>
        </div>
      )}

      {(nutrition.dislikedFoods?.length || 0) > 0 && (
        <div className={`rounded-2xl p-5 border theme-transition ${
          isDark ? 'bg-[#1a1830] border-[#a78bfa]/10' : 'bg-white border-[#a78bfa]/15'
        }`}>
          <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-[#ef4444]' : 'text-[#dc2626]'}`}>
            <AlertTriangle size={18} />
            غذاهای مورد عدم علاقه
          </h3>
          <div className="flex flex-wrap gap-2">
            {(nutrition.dislikedFoods || []).map((food: string, idx: number) => (
              <span key={idx} className={`px-3 py-1.5 rounded-lg text-sm ${
                isDark ? 'bg-[#ef4444]/20 text-[#ef4444]' : 'bg-red-50 text-red-700'
              }`}>
                {food}
              </span>
            ))}
          </div>
        </div>
      )}

      {(nutrition.foodAllergies?.length || 0) > 0 && (
        <div className={`rounded-2xl p-5 border theme-transition ${
          isDark ? 'bg-[#1a1830] border-[#ef4444]/20' : 'bg-white border-red-200'
        }`}>
          <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-[#ef4444]' : 'text-[#dc2626]'}`}>
            <AlertTriangle size={18} />
            آلرژی‌های غذایی
          </h3>
          <div className="flex flex-wrap gap-2">
            {(nutrition.foodAllergies || []).map((allergy: string, idx: number) => (
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
        isDark ? 'bg-[#1a1830] border-[#a78bfa]/10' : 'bg-white border-[#a78bfa]/15'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-[#a78bfa]' : 'text-[#8b5cf6]'}`}>
            <Utensils size={18} />
            برنامه‌های غذایی
          </h3>
          {/* دکمه ورود JSON حذف شد — Fito آفلاین است */}
        </div>

        {nutritionPrograms.length === 0 ? (
          <p className={`text-sm text-center py-4 ${isDark ? 'text-gray-500' : 'text-[#7c3aed]/50'}`}>
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
                      ? 'bg-[#a78bfa]/10 border-[#a78bfa]/40'
                      : 'bg-[#a78bfa]/10 border-[#a78bfa]/40'
                    : isDark
                      ? 'bg-[#0f0e1f] border-gray-800 hover:border-gray-600'
                      : 'bg-[#f5f3ff] border-[#a78bfa]/20 hover:border-[#a78bfa]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-bold ${isDark ? 'text-white' : 'text-[#312e81]'}`}>
                    {program.plan_name}
                    {program.id === (state.activeNutritionProgram || nutritionPrograms[0]?.id) && (
                      <span className={`mr-2 text-[10px] px-2 py-0.5 rounded-full ${
                        isDark ? 'bg-[#a78bfa]/30 text-[#a78bfa]' : 'bg-[#a78bfa]/20 text-[#8b5cf6]'
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
                <p className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-[#7c3aed]/70'}`}>
                  {program.duration}
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className={isDark ? 'text-gray-400' : 'text-[#7c3aed]/70'}>
                    کالری: <span className={`font-bold ${isDark ? 'text-white' : 'text-[#312e81]'}`}>
                      {toPersianNumber(program.daily_calories)}
                    </span>
                  </div>
                  <div className={isDark ? 'text-gray-400' : 'text-[#7c3aed]/70'}>
                    پروتئین: <span className={`font-bold ${isDark ? 'text-white' : 'text-[#312e81]'}`}>
                      {toPersianNumber(program.macros.protein)}g
                    </span>
                  </div>
                  <div className={isDark ? 'text-gray-400' : 'text-[#7c3aed]/70'}>
                    روزها: <span className={`font-bold ${isDark ? 'text-white' : 'text-[#312e81]'}`}>
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
    <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0f0e1f]' : 'bg-[#f5f3ff]'}`}>
      <p className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-[#7c3aed]/60'}`}>{label}</p>
      <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#312e81]'}`}>{value}</p>
    </div>
  );
}
