import { AthleteProfile, GOAL_LABELS, EXPERIENCE_LABELS, getGoalLabel } from '../types';

const GOAL_TRANSLATIONS: Record<string, string> = {
  'hypertrophy': 'Hypertrophy (Muscle Building)',
  'strength': 'Strength Gain',
  'fat_loss': 'Fat Loss',
  'recomposition': 'Body Recomposition',
  'competition': 'Competition Prep',
  'general_fitness': 'General Fitness',
};

const EXPERIENCE_TRANSLATIONS: Record<string, string> = {
  'beginner': 'Beginner',
  'intermediate': 'Intermediate',
  'advanced': 'Advanced',
  'professional': 'Professional',
};

const LOCATION_TRANSLATIONS: Record<string, string> = {
  'gym': 'Commercial Gym',
  'home': 'Home Gym',
  'both': 'Both Gym and Home',
  'park': 'Outdoor/Park',
};

const PROGRAM_TYPE_TRANSLATIONS: Record<string, string> = {
  'full_body': 'Full Body',
  'split': 'Body Part Split',
  'push_pull_legs': 'Push/Pull/Legs',
  'upper_lower': 'Upper/Lower',
  'ai_suggested': 'AI Suggested (based on athlete profile)',
};

const EQUIPMENT_TYPE_TRANSLATIONS: Record<string, string> = {
  'full_gym': 'Full Commercial Gym',
  'home': 'Home Gym',
  'park': 'Outdoor / Park',
  'custom': 'Custom Equipment List',
};

const MUSCLE_TRANSLATIONS: Record<string, string> = {
  'سینه': 'Chest',
  'پشت': 'Back',
  'سرشانه': 'Shoulders',
  'جلوبازو': 'Biceps',
  'پشت‌بازو': 'Triceps',
  'چهارسر ران': 'Quadriceps',
  'همسترینگ': 'Hamstrings',
  'باسن': 'Glutes',
  'ساق پا': 'Calves',
  'شکم': 'Abs',
  'کول': 'Traps',
  'ساعد': 'Forearms',
};

function translateGoal(goal: string): string {
  return GOAL_TRANSLATIONS[goal] || goal;
}

function translateExperience(exp: string): string {
  return EXPERIENCE_TRANSLATIONS[exp] || exp;
}

function translateLocation(loc: string): string {
  return LOCATION_TRANSLATIONS[loc] || loc;
}

function translateProgramType(type: string): string {
  return PROGRAM_TYPE_TRANSLATIONS[type] || type;
}

function translateMuscle(muscle: string): string {
  return MUSCLE_TRANSLATIONS[muscle] || muscle;
}

/** Strip markdown fences and extract outermost JSON object */
function cleanJsonInput(json: string): string {
  let clean = (json || '').trim();
  clean = clean.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    clean = clean.substring(firstBrace, lastBrace + 1);
  }
  return clean;
}

export function generateWorkoutPrompt(profile: AthleteProfile): string {
  const goalEn = translateGoal(profile.primaryGoal);
  const secondaryGoalEn = profile.secondaryGoal ? translateGoal(profile.secondaryGoal) : null;
  const experienceEn = translateExperience(profile.experience);
  const locationEn = translateLocation(profile.location);
  const equipmentTypeEn = EQUIPMENT_TYPE_TRANSLATIONS[profile.equipmentType] || profile.equipmentType || 'Commercial Gym';
  const programTypeEn = translateProgramType(profile.programType || 'ai_suggested');
  const targetMusclesEn = (profile.targetMuscles || [])
    .map((m, i) => `${i + 1}. ${translateMuscle(m)}`)
    .join(', ');

  const bodyMeasEntries = profile.bodyMeasurements
    ? Object.entries(profile.bodyMeasurements).filter(([, val]) => val != null && Number(val) > 0)
    : [];
  const bodyMeasStr = bodyMeasEntries.length > 0
    ? bodyMeasEntries.map(([k, v]) => `${k}: ${v} cm`).join(', ')
    : '';

  const preferredExercisesStr = (profile.preferredExercises || []).filter(Boolean).join(', ');

  const prompt = `You are an expert strength and conditioning coach, certified by NSCA and ACSM, with 20+ years of experience designing evidence-based training programs for athletes of all levels. You specialize in ${goalEn.toLowerCase()} and use the latest scientific research from Schoenfeld, Helms, and Israetel.

## CRITICAL DURATION MANDATE
The athlete explicitly requested a program timeframe / duration of: **"${profile.timeline || '4 weeks'}"**.
You MUST set the JSON "duration" field strictly to match this exact requested timeframe (e.g. if requested timeframe is "1 ماه" or "1 month" or "4 هفته", the JSON "duration" MUST be "۱ ماه" or "۴ هفته" / "4 weeks"). DO NOT DEFAULT TO 8 WEEKS OR 12 WEEKS! Pay strict attention to all athlete profile parameters.

## Athlete Profile
- **Name**: ${profile.name}
- **Age**: ${profile.age} years old
- **Gender**: ${profile.gender === 'male' ? 'Male' : 'Female'}
- **Height**: ${profile.height} cm
- **Current Weight**: ${profile.weight} kg${profile.targetWeight ? `\n- **Target Weight**: ${profile.targetWeight} kg` : ''}
- **Experience Level**: ${experienceEn}
- **Activity Level**: ${profile.activityLevel || 'Moderately Active'}
${profile.bodyFatPercent != null ? `- **Body Fat**: ~${profile.bodyFatPercent}%` : ''}
${profile.bodyComposition ? `- **Body Composition**: ${profile.bodyComposition}` : ''}
${bodyMeasStr ? `- **Body Measurements**: ${bodyMeasStr}` : ''}
${profile.sleepHours != null ? `- **Sleep**: ${profile.sleepHours} hours/night` : ''}
${profile.jobStress ? `- **Job Stress**: ${profile.jobStress}` : ''}

## Training Parameters
- **Primary Goal**: ${goalEn}
${secondaryGoalEn ? `- **Secondary Goal**: ${secondaryGoalEn}` : ''}
- **Program Duration / Timeline (STRICT)**: **${profile.timeline || '4 weeks'}**
- **Training Days per Week**: ${profile.trainingDays} days
- **Session Duration**: ${profile.sessionDuration} minutes
- **Training Location**: ${locationEn}
- **Equipment Setup**: ${equipmentTypeEn}
- **Program Type**: ${programTypeEn}
${targetMusclesEn ? `- **Priority Muscle Groups (ordered, 1 = highest priority)**: ${targetMusclesEn}` : ''}
${profile.competitionDate ? `- **Competition / Deadline**: ${profile.competitionDate}` : ''}
${profile.trainingHistory ? `- **Training History**: ${profile.trainingHistory}` : ''}

## Available Equipment
${(profile.equipment || []).length > 0 ? profile.equipment.join(', ') : 'Standard gym equipment'}
${(profile.customEquipment || []).length > 0 ? `\n## Custom Equipment\n${profile.customEquipment.join(', ')}` : ''}

## Body Composition & Recovery
${profile.bodyFatPercent != null ? `- **Body Fat**: ~${profile.bodyFatPercent}%` : ''}
${profile.bodyComposition ? `- **Body Composition**: ${profile.bodyComposition}` : ''}
${profile.sleepHours != null ? `- **Sleep**: ${profile.sleepHours} hours/night` : ''}
${profile.recoveryQuality ? `- **Recovery Quality**: ${profile.recoveryQuality}` : ''}
${profile.jobStress ? `- **Job Stress**: ${profile.jobStress}` : ''}
${profile.workShift ? `- **Work Schedule**: ${profile.workShift}` : ''}

## Health Considerations & Exercise Preferences
${(profile.injuries || []).length > 0 ? `- **Injuries**: ${profile.injuries.join(', ')}` : '- No reported injuries'}
${profile.injuryDetails ? `- **Injury History Details**: ${profile.injuryDetails}` : ''}
${(profile.limitations || []).length > 0 ? `- **Medical Limitations**: ${profile.limitations.join(', ')}` : '- No medical limitations'}
${(profile.avoidedExercises || []).length > 0 ? `- **Exercises to Avoid**: ${profile.avoidedExercises.join(', ')}` : '- No exercises to avoid'}
${preferredExercisesStr ? `- **Preferred Exercises**: ${preferredExercisesStr}` : ''}
${profile.exercisePreferences ? `- **Exercise Preferences / Style**: ${profile.exercisePreferences}` : ''}
${profile.hormoneMedNotes ? `- **Medication / Hormone Notes**: ${profile.hormoneMedNotes}` : ''}

## Strength Records
${Object.keys(profile.strengthRecords || {}).length > 0
  ? Object.entries(profile.strengthRecords).map(([ex, w]) => `- ${ex}: ${w}`).join('\n')
  : '- No recorded strength data'}

## Scientific Framework
Apply these evidence-based principles:
1. **Volume**: Follow RP volume landmarks (MEV, MAV, MRV) appropriate for experience level
2. **Frequency**: Optimize training frequency (2x/week per muscle group minimum for ${experienceEn.toLowerCase()})
3. **Progressive Overload**: Include clear progression scheme
4. **Exercise Selection**: Biomechanically appropriate exercises with proper movement patterns
5. **Rest Periods**: Science-based rest intervals (2-5min for compounds, 1-2min for isolation)
6. **Tempo**: Include tempo prescriptions for key exercises
7. **Periodization**: Include weekly undulation if appropriate
8. **Muscle Priority**: Allocate more volume and better placement to higher-priority muscle groups listed above

## Output Requirements
You MUST respond with ONLY valid JSON. No markdown, no explanations outside JSON.

The JSON must follow this EXACT structure:
{
  "program_name": "نام برنامه به فارسی",
  "duration": "مدت برنامه به فارسی",
  "days": [
    {
      "day": "نام روز به فارسی",
      "muscle_groups": ["گروه عضلانی به فارسی"],
      "exercises": [
        {
          "name": "نام تمرین به فارسی",
          "sets": "تعداد ست (عدد)",
          "reps": "محدوده تکرار (مثلاً: 8-12)",
          "rest": "زمان استراحت به ثانیه (عدد)",
          "tempo": "تمپو (مثلاً: 3-1-1-0)",
          "notes": "نکات مهم به فارسی"
        }
      ]
    }
  ]
}

Important:
- All text values in JSON must be in Persian (Farsi)
- **duration** in JSON MUST be strictly set to Persian string matching requested timeframe: "${profile.timeline || '۴ هفته'}" (e.g. if 1 month: "۱ ماه" or "۴ هفته")
- Ensure total session time fits within ${profile.sessionDuration} minutes
- Respect injuries, limitations, and avoided exercises strictly
- Prioritize muscle groups in the order given (1 = highest priority)
`;

  return prompt;
}

export function generateNutritionPrompt(profile: AthleteProfile): string {
  const goalEn = translateGoal(profile.dietaryGoal || profile.primaryGoal);

  const prompt = `You are a registered sports dietitian (RD) with a PhD in sports nutrition and 15+ years of experience creating evidence-based meal plans for athletes.

## Athlete Profile
- **Name**: ${profile.name}
- **Age**: ${profile.age} years old
- **Gender**: ${profile.gender === 'male' ? 'Male' : 'Female'}
- **Height**: ${profile.height} cm
- **Current Weight**: ${profile.weight} kg${profile.targetWeight ? `\n- **Target Weight**: ${profile.targetWeight} kg` : ''}
- **Activity Level**: ${profile.activityLevel || 'Moderately Active'}
${profile.bodyFatPercent != null ? `- **Body Fat**: ~${profile.bodyFatPercent}%` : ''}
${profile.bodyComposition ? `- **Body Composition**: ${profile.bodyComposition}` : ''}
${profile.sleepHours != null ? `- **Sleep**: ${profile.sleepHours} hours/night` : ''}
${profile.jobStress ? `- **Job Stress**: ${profile.jobStress}` : ''}

## Nutrition Parameters
- **Primary Goal**: ${goalEn}
${profile.dietType ? `- **Diet Type**: ${profile.dietType}` : ''}
- **Meals per Day**: ${profile.mealsPerDay || 3}
${profile.calorieTarget ? `- **Calorie Target**: ${profile.calorieTarget} kcal/day` : ''}
${(profile.favoriteFoods || []).length > 0 ? `- **Favorite Foods**: ${profile.favoriteFoods.join(', ')}` : ''}
${(profile.dislikedFoods || []).length > 0 ? `- **Disliked Foods**: ${profile.dislikedFoods.join(', ')}` : ''}
${(profile.foodAllergies || []).length > 0 ? `- **Food Allergies**: ${profile.foodAllergies.join(', ')}` : ''}

## Cooking Ability
${profile.cookingSkill === 'none' ? 'No cooking skills - needs very simple recipes' :
  profile.cookingSkill === 'basic' ? 'Basic - can prepare simple meals' :
  profile.cookingSkill === 'intermediate' ? 'Intermediate - can prepare diverse meals' :
  'Advanced - can prepare complex meals'}

## Health
${(profile.healthConditions || []).length > 0 ? `- **Health Conditions**: ${profile.healthConditions.join(', ')}` : '- No specific health conditions'}
${(profile.injuries || []).length > 0 ? `- **Injuries**: ${profile.injuries.join(', ')}` : ''}

## Requirements
1. Create a 7-day meal plan with ${profile.mealsPerDay || 3} meals per day
2. Calculate appropriate calories and macros for the goal
3. Use culturally appropriate Iranian foods when possible
4. Include meal times and portions
5. Provide preparation notes
6. Respect food allergies and dislikes

## Output Requirements
You MUST respond with ONLY valid JSON. No markdown, no explanations outside JSON.

{
  "plan_name": "نام برنامه به فارسی",
  "duration": "مدت برنامه",
  "daily_calories": "کالری روزانه (عدد)",
  "macros": {
    "protein": "پروتئین به گرم (عدد)",
    "carbs": "کربوهیدرات به گرم (عدد)",
    "fats": "چربی به گرم (عدد)"
  },
  "days": [
    {
      "day": "نام روز به فارسی",
      "meals": [
        {
          "meal_name": "نام وعده",
          "time": "ساعت",
          "foods": [
            {
              "name": "نام غذا",
              "portion": "مقدار",
              "calories": "کالری (عدد)",
              "protein": "پروتئین (عدد)",
              "carbs": "کربوهیدرات (عدد)",
              "fats": "چربی (عدد)"
            }
          ],
          "preparation": "نحوه آماده‌سازی"
        }
      ],
      "total_calories": "مجموع کالری روز (عدد)",
      "notes": "نکات"
    }
  ],
  "hydration": "توصیه آب",
  "supplements": "توصیه‌های مکمل به فارسی (در صورت نیاز)"
}

Important:
- All text in Persian
- Respect all allergies and dislikes
`;

  return prompt;
}

export function generateSupplementPrompt(profile: AthleteProfile): string {
  const goalEn = translateGoal(profile.supplementGoal || profile.primaryGoal);

  const prompt = `You are a sports nutrition PhD and certified supplement specialist (ISSN) with expertise in evidence-based supplementation. You provide personalized supplement recommendations based on scientific research.

## Athlete Profile
- **Name**: ${profile.name}
- **Age**: ${profile.age} years old
- **Gender**: ${profile.gender === 'male' ? 'Male' : 'Female'}
- **Weight**: ${profile.weight} kg
- **Experience Level**: ${translateExperience(profile.experience)}
${profile.supplementGoal ? `- **Supplement Goal**: ${profile.supplementGoal}` : ''}
${(profile.currentSupplements || []).length > 0 ? `- **Current Supplements**: ${profile.currentSupplements.join(', ')}` : '- Not currently taking any supplements'}
${profile.supplementBudget ? `- **Monthly Budget**: ${profile.supplementBudget}` : ''}

## Health
${(profile.healthConditions || []).length > 0 ? `- **Health Conditions**: ${profile.healthConditions.join(', ')}` : '- No specific health conditions'}
${(profile.injuries || []).length > 0 ? `- **Injuries**: ${profile.injuries.join(', ')}` : ''}
${profile.injuryDetails ? `- **Injury Details**: ${profile.injuryDetails}` : ''}
${profile.hormoneMedNotes ? `- **Medication / Hormone Notes**: ${profile.hormoneMedNotes}` : ''}
${(profile.foodAllergies || []).length > 0 ? `- **Food Allergies**: ${profile.foodAllergies.join(', ')}` : ''}
${profile.sleepHours != null ? `- **Sleep**: ${profile.sleepHours} hours/night` : ''}
${profile.recoveryQuality ? `- **Recovery Quality**: ${profile.recoveryQuality}` : ''}

## Requirements
1. Recommend evidence-based supplements only
2. Prioritize supplements with strong scientific backing (Level A evidence)
3. Consider potential interactions with current supplements
4. Respect health conditions and allergies
5. Stay within budget if specified

## Output Requirements
You MUST respond with ONLY valid JSON. No markdown, no explanations outside JSON.

{
  "recommendation_title": "عنوان توصیه به فارسی",
  "summary": "خلاصه کوتاه به فارسی",
  "supplements": [
    {
      "name": "نام مکمل به فارسی",
      "english_name": "English name",
      "priority": "بالا",
      "dosage": "دوز مصرف",
      "timing": "زمان مصرف",
      "benefits": "فواید",
      "side_effects": "عوارض احتمالی",
      "estimated_cost": "هزینه تقریبی ماهانه",
      "recommended_brands": "برندهای پیشنهادی",
      "notes": "نکات"
    }
  ],
  "total_estimated_cost": "هزینه کل ماهانه",
  "important_notes": "نکات مهم",
  "warnings": "هشدارها"
}

Important: All text in Persian. Safety first. Use recommendation_title and supplements (not plan_name / daily_supplements).
`;

  return prompt;
}

export function validateWorkoutJSON(json: string): { valid: boolean; data?: any; error?: string } {
  try {
    const data = JSON.parse(cleanJsonInput(json));
    if (!data.program_name || !data.days || !Array.isArray(data.days)) {
      return { valid: false, error: 'ساختار JSON ناقص است (program_name یا days وجود ندارد)' };
    }
    return { valid: true, data };
  } catch (e) {
    return { valid: false, error: 'فرمت JSON نامعتبر است: ' + (e as Error).message };
  }
}

export function validateNutritionJSON(json: string): { valid: boolean; data?: any; error?: string } {
  try {
    const data = JSON.parse(cleanJsonInput(json));
    if (!data.plan_name || !data.days || !Array.isArray(data.days)) {
      return { valid: false, error: 'ساختار JSON ناقص است (plan_name یا days وجود ندارد)' };
    }
    return { valid: true, data };
  } catch (e) {
    return { valid: false, error: 'فرمت JSON نامعتبر است: ' + (e as Error).message };
  }
}

export function validateSupplementJSON(json: string): { valid: boolean; data?: any; error?: string } {
  try {
    const raw = JSON.parse(cleanJsonInput(json));
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      return { valid: false, error: 'JSON باید یک آبجکت باشد' };
    }

    // Normalize both schemas:
    // UI schema: recommendation_title + supplements
    // legacy/prompt schema: plan_name + daily_supplements
    const title =
      (typeof raw.recommendation_title === 'string' && raw.recommendation_title) ||
      (typeof raw.plan_name === 'string' && raw.plan_name) ||
      '';

    let list: any[] = [];
    if (Array.isArray(raw.supplements)) list = raw.supplements;
    else if (Array.isArray(raw.daily_supplements)) list = raw.daily_supplements;

    if (!title) {
      return { valid: false, error: 'فیلد recommendation_title (یا plan_name) الزامی است' };
    }
    if (!list.length) {
      return { valid: false, error: 'فیلد supplements باید آرایه‌ای غیرخالی از مکمل‌ها باشد' };
    }

    const supplements = list.map((s: any, i: number) => {
      if (!s || typeof s !== 'object') {
        throw new Error(`مکمل ${i + 1} نامعتبر است`);
      }
      const name = s.name || s.supplement_name || '';
      if (!name) {
        throw new Error(`مکمل ${i + 1}: فیلد name الزامی است`);
      }
      return {
        name: String(name),
        english_name: s.english_name ? String(s.english_name) : '',
        priority: s.priority ? String(s.priority) : 'متوسط',
        dosage: s.dosage ? String(s.dosage) : '',
        timing: s.timing ? String(s.timing) : '',
        benefits: s.benefits ? String(s.benefits) : '',
        side_effects: s.side_effects ? String(s.side_effects) : '',
        estimated_cost: s.estimated_cost ? String(s.estimated_cost) : '',
        recommended_brands: s.recommended_brands ? String(s.recommended_brands) : '',
        notes: s.notes ? String(s.notes) : '',
      };
    });

    const data = {
      recommendation_title: title,
      summary: raw.summary ? String(raw.summary) : '',
      supplements,
      total_estimated_cost: raw.total_estimated_cost ? String(raw.total_estimated_cost) : '',
      important_notes: raw.important_notes ? String(raw.important_notes) : '',
      warnings: raw.warnings ? String(raw.warnings) : '',
    };

    return { valid: true, data };
  } catch (e) {
    return { valid: false, error: 'فرمت JSON نامعتبر است: ' + (e as Error).message };
  }
}
