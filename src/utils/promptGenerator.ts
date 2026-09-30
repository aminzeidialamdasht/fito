import { AthleteProfile } from '../types';

const GOAL_TRANSLATIONS: Record<string, string> = {
  hypertrophy: 'Hypertrophy / Muscle Building',
  strength: 'Strength',
  fat_loss: 'Fat Loss',
  recomposition: 'Body Recomposition',
  competition: 'Competition Preparation',
  general_fitness: 'General Fitness',
};

const EXPERIENCE_TRANSLATIONS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  professional: 'Professional',
};

const LOCATION_TRANSLATIONS: Record<string, string> = {
  gym: 'Commercial Gym',
  home: 'Home',
  both: 'Gym and Home',
  park: 'Park / Outdoor',
};

const PROGRAM_TYPE_TRANSLATIONS: Record<string, string> = {
  full_body: 'Full Body',
  split: 'Body Part Split',
  push_pull_legs: 'Push/Pull/Legs',
  upper_lower: 'Upper/Lower',
  ai_suggested: 'AI Suggested (based on athlete profile)',
};

const EQUIPMENT_TYPE_TRANSLATIONS: Record<string, string> = {
  full_gym: 'Commercial Gym',
  home: 'Home Gym',
  park: 'Park / Outdoor',
  custom: 'Custom Equipment',
};

const MUSCLE_TRANSLATIONS: Record<string, string> = {
  'سینه': 'Chest',
  'پشت': 'Back',
  'سرشانه': 'Shoulders',
  'جلوبازو': 'Biceps',
  'پشت‌بازو': 'Triceps',
  'پشت بازو': 'Triceps',
  'چهارسر ران': 'Quadriceps',
  'چهارسر': 'Quadriceps',
  'همسترینگ': 'Hamstrings',
  'باسن': 'Glutes',
  'سرینی': 'Glutes',
  'ساق پا': 'Calves',
  'شکم': 'Abs',
  'کول': 'Lower Back',
  'ساعد': 'Forearms',
  'زیربغل': 'Lats / Upper Back',
  'پشت سرشانه': 'Rear Delts',
  'پشت‌سرشانه': 'Rear Delts',
};

const PERSIAN_WEEKDAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

function translateGoal(goal?: string): string {
  if (!goal) return 'General Fitness';
  return GOAL_TRANSLATIONS[goal] || goal;
}

function translateExperience(exp?: string): string {
  if (!exp) return 'Intermediate';
  return EXPERIENCE_TRANSLATIONS[exp] || exp;
}

function translateLocation(loc?: string): string {
  if (!loc) return 'Commercial Gym';
  return LOCATION_TRANSLATIONS[loc] || loc;
}

function translateProgramType(type?: string): string {
  if (!type) return 'AI Suggested (based on athlete profile)';
  return PROGRAM_TYPE_TRANSLATIONS[type] || type;
}

function translateMuscle(muscle?: string): string {
  if (!muscle) return '';
  return MUSCLE_TRANSLATIONS[muscle] || muscle;
}

export function cleanJsonInput(input: string): string {
  let clean = String(input || '').trim();

  clean = clean
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const first = clean.indexOf('{');
  const last = clean.lastIndexOf('}');

  if (first !== -1 && last !== -1 && last > first) {
    clean = clean.slice(first, last + 1);
  }

  return clean;
}

export function generateSupersetPrompt(profile: AthleteProfile, durationMinutes: number = 30): string {
  const goalEn = translateGoal(profile.primaryGoal);
  const experienceEn = translateExperience(profile.experience);
  const locationEn = translateLocation(profile.location);
  const equipmentStr = (profile.equipment || []).join(', ');
  const customEquipmentStr = (profile.customEquipment || []).join(', ');
  const injuriesStr = (profile.injuries || []).join(', ') || 'None';
  const avoidedExercisesStr = (profile.avoidedExercises || []).join(', ') || 'None';
  const limitationsStr = (profile.limitations || []).join(', ') || 'None';
  const targetMusclesEn = (profile.targetMuscles || [])
    .map((m) => translateMuscle(m))
    .filter(Boolean)
    .join(', ');

  const prompt = `You are an expert strength and conditioning coach. Create a FAST, INTENSE, SUPERSET-DRIVEN WORKOUT for an athlete who has limited time or motivation for a long routine.

## HARD TIME CONSTRAINT
The entire session MUST be completed within **${durationMinutes} minutes maximum**, including warm-up, work, and rest.
Use short rest periods, supersets, giant sets, circuit-style blocks, or density training when appropriate.
Do not create a long traditional bodybuilding session.

## ATHLETE PROFILE
- **Name**: ${profile.name}
- **Age**: ${profile.age} years old
- **Gender**: ${profile.gender === 'male' ? 'Male' : 'Female'}
- **Height**: ${profile.height} cm
- **Current Weight**: ${profile.weight} kg
- **Primary Goal**: ${goalEn}
- **Experience Level**: ${experienceEn}
- **Location**: ${locationEn}
- **Available Equipment**: ${equipmentStr || 'Standard gym equipment'}
- **Custom Equipment**: ${customEquipmentStr || 'None'}
- **Priority Muscle Groups**: ${targetMusclesEn || 'None'}
- **Injuries**: ${injuriesStr}
- **Limitations**: ${limitationsStr}
- **Avoided Exercises**: ${avoidedExercisesStr}

## SESSION REQUIREMENTS
1. General warm-up: 3-5 minutes maximum.
2. Main work must be superset-driven or circuit-driven.
3. Keep rest short but safe: usually 30-75 seconds.
4. Prioritize compound movements and metabolic efficiency.
5. Include a brief cool-down/stretch if time allows.
6. Every exercise must include:
   - name
   - sets
   - reps or work time
   - rest
   - tempo or cadence
   - target muscle
   - substitute exercise
   - stopping criterion
   - safety note

## SAFETY RULES
Stop immediately if there is:
- sharp pain
- radiating pain
- numbness or tingling
- weakness or loss of motor control
- sustained worsening of symptoms

For spine-sensitive movements, provide safer alternatives.

## OUTPUT FORMAT
You MUST respond with ONLY valid JSON. No markdown, no explanations outside JSON.

{
  "program_name": "جلسه فشرده سوپرست (${durationMinutes} دقیقه‌ای)",
  "duration": "${durationMinutes} دقیقه",
  "days": [
    {
      "day": "جلسه فشرده سوپرست",
      "muscle_groups": ["گروه‌های عضلانی درگیر به فارسی"],
      "warm_up": "گرم‌کردن سریع و مشخص به فارسی",
      "exercises": [
        {
          "name": "نام تمرین به فارسی",
          "sets": "تعداد ست یا rounds",
          "reps": "تکرار یا زمان کار",
          "rest": "استراحت به ثانیه",
          "tempo": "تمپو یا cadence",
          "target_muscle": "عضله هدف به فارسی",
          "substitute": "حرکت جایگزین به فارسی",
          "stopping_criterion": "معیار توقف ایمن",
          "safety_note": "نکته ایمنی به فارسی"
        }
      ],
      "core_work": "هسته/شکم در صورت زمان مناسب به فارسی",
      "cardio": "هوازی فشرده در صورت مناسب بودن به فارسی",
      "cool_down": "سرد کردن کوتاه به فارسی"
    }
  ]
}

Important:
- All text values in JSON must be in Persian (Farsi), except common exercise names may include English.
- The session must truly fit inside ${durationMinutes} minutes.
- Do not add unnecessary exercises.
- Make it intense, efficient, and practical.
`;

  return prompt;
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
    : 'Not specified';

  const preferredExercisesStr = (profile.preferredExercises || []).filter(Boolean).join(', ') || 'None';
  const equipmentStr = (profile.equipment || []).join(', ') || 'Standard gym equipment';
  const customEquipmentStr = (profile.customEquipment || []).join(', ') || 'None';
  const avoidedExercisesStr = (profile.avoidedExercises || []).join(', ') || 'None';
  const limitationsStr = (profile.limitations || []).join(', ') || 'None';
  const injuriesStr = (profile.injuries || []).join(', ') || 'None';

  const strengthRecordsEntries = profile.strengthRecords
    ? Object.entries(profile.strengthRecords).filter(([, val]) => Boolean(val))
    : [];

  const strengthRecordsStr = strengthRecordsEntries.length > 0
    ? strengthRecordsEntries.map(([k, v]) => `${k}: ${v}`).join(', ')
    : 'None';

  const requestedTrainingDays = Number(profile.trainingDays);
  const trainingDays = Number.isFinite(requestedTrainingDays) && requestedTrainingDays > 0
    ? Math.min(7, Math.round(requestedTrainingDays))
    : 4;

  const restDaysCount = 7 - trainingDays;
  const weekdayList = PERSIAN_WEEKDAYS.join('، ');

  const timeline = (profile.timeline || '').trim() || '۱ ماه';
  const safeTimeline = timeline.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const sessionDuration = Number(profile.sessionDuration) || 60;

  const pt = (profile.programType || '').toLowerCase();
  let programSpecificRules = '';

  if (pt === 'split') {
    programSpecificRules = `- **STRICT MUSCLE SPLIT MANDATE**: Cover ALL major muscle groups across the week: Chest, Back, Quadriceps, Hamstrings/Glutes, Shoulders, Biceps, Triceps, Calves, and Abs. It is STRICTLY FORBIDDEN to omit any major muscle group. Do not schedule the same muscle group on consecutive days for heavy compounds unless recovery is explicitly managed. Adapt the split to exactly ${trainingDays} training days.`;
  } else if (pt === 'push_pull_legs') {
    if (trainingDays === 3) {
      programSpecificRules = `- **STRICT PPL MANDATE**: Use a 3-day Push / Pull / Legs rotation. Legs day MUST include both Quadriceps (knee-dominant) and Hamstrings/Glutes (hip-dominant) movements.`;
    } else if (trainingDays === 6) {
      programSpecificRules = `- **STRICT PPL MANDATE**: Use a 6-day Push / Pull / Legs / Push / Pull / Legs rotation. Legs days MUST include both Quadriceps and Hamstrings/Glutes movements.`;
    } else {
      programSpecificRules = `- **ADAPTIVE PPL MANDATE**: The athlete requested ${trainingDays} days. Do NOT force a pure 3-day PPL if it violates the requested frequency. Use a hybrid such as PPL + Upper/Lower, PPL + Full Body, or PPL with repeated priority days, while preserving Push/Pull/Legs movement patterns and producing exactly ${trainingDays} sessions.`;
    }
  } else if (pt === 'upper_lower') {
    programSpecificRules = `- **STRICT UPPER/LOWER MANDATE**: Balance volume between Upper and Lower days. Every Lower day must include knee-dominant and hip-dominant movements. Adapt the Upper/Lower sequence to exactly ${trainingDays} sessions with intelligent recovery.`;
  } else if (pt === 'full_body') {
    programSpecificRules = `- **STRICT FULL BODY MANDATE**: Every session must include at least one lower-body compound (squat/hinge) and one upper-body push/pull pattern. Generate exactly ${trainingDays} full-body sessions with undulating emphasis to manage fatigue.`;
  } else {
    programSpecificRules = `- **AI-SELECTED SPLIT MANDATE**: Choose the most evidence-based split for ${trainingDays} days/week, goal, experience, equipment, and recovery. The split must produce exactly ${trainingDays} sessions and cover all major muscle groups weekly.`;
  }

  let priorityRule = '';
  if (targetMusclesEn) {
    priorityRule = `- **PRIORITY MUSCLE RULE**: Priority muscles must receive optimal frequency/volume (usually 2x/week when possible) without omitting non-priority muscles. Non-priority muscles need at least maintenance volume once per week. Fit this inside exactly ${trainingDays} sessions.`;
  }

  let secondaryGoalRule = '';
  if (secondaryGoalEn) {
    secondaryGoalRule = `- **SECONDARY GOAL INTEGRATION**: Explicitly include exercises/protocols for Secondary Goal (${secondaryGoalEn}) without compromising Primary Goal or the ${trainingDays}-day frequency mandate.`;
  }

  const sessionDurationSummaryExample = Array.from({ length: trainingDays }, (_, i) =>
    `      "Day ${i + 1}": "XX minutes"`
  ).join(',\n');

  const prompt = `You are an expert strength and conditioning coach, certified by NSCA and ACSM, with 20+ years of experience designing evidence-based training programs. You specialize in ${goalEn.toLowerCase()} and use the latest scientific research from Schoenfeld, Helms, and Israetel.

## CRITICAL TRAINING DAYS MANDATE
The athlete requested exactly ${trainingDays} training days per week.
The JSON "days" array MUST contain exactly ${trainingDays} objects.
Do not generate fewer or more days.
If injuries, equipment, or recovery require changes, substitute safer exercises or redistribute volume, but keep exactly ${trainingDays} sessions.

## CRITICAL WEEKLY SCHEDULE, REST DAYS, AND RECOVERY MANDATE
- The Iranian week starts on "شنبه" and ends on "جمعه".
- You MUST choose exactly ${trainingDays} training weekdays from this list: ${weekdayList}.
- Each object in "days" MUST include a "weekday" field with one of those Persian weekday names.
- The "weekday" values in "days" MUST be unique. No weekday may appear twice.
- You MUST include a top-level "rest_days" array containing the remaining ${restDaysCount} weekdays that are not used for training.
- "rest_days" MUST NOT overlap with any "weekday" in "days".
- Order the "days" array by the natural Iranian weekday order: ${weekdayList}.
- Recovery placement is mandatory: do not schedule heavy compound movements for the same major muscle group on consecutive calendar days unless the requested split explicitly requires it and volume is carefully managed.
- Priority muscles should usually be trained 2x/week when compatible with ${trainingDays} days, separated by enough recovery time, often 48-72 hours.
- For ${trainingDays} days, choose a sustainable weekly pattern. Do not dump all sessions at the beginning of the week unless scientifically justified. Distribute stimulus and fatigue across the week.
- If injuries, equipment, or recovery issues require changes, substitute safer exercises or redistribute volume, but keep exactly ${trainingDays} training weekdays and ${restDaysCount} rest weekdays.

## CRITICAL DURATION MANDATE
The athlete explicitly requested a program timeframe / duration of: "${timeline}".
You MUST set the JSON "duration" field strictly to match this exact requested timeframe in Persian.
DO NOT DEFAULT TO 4, 8, OR 12 WEEKS.
Design a weekly template that can be progressed over this requested timeframe.

## ATHLETE PROFILE
- **Name**: ${profile.name}
- **Age**: ${profile.age} years old
- **Gender**: ${profile.gender === 'male' ? 'Male' : 'Female'}
- **Height**: ${profile.height} cm
- **Current Weight**: ${profile.weight} kg
- **Target Weight**: ${profile.targetWeight ? profile.targetWeight + ' kg' : 'Not specified'}
- **Primary Goal**: ${goalEn}
- **Secondary Goal**: ${secondaryGoalEn || 'Not specified'}
- **Experience Level**: ${experienceEn}
- **Program Type Requested**: ${programTypeEn}
- **Training Days Per Week**: ${trainingDays} (HARD CONSTRAINT)
- **Rest Days Per Week**: ${restDaysCount} (HARD CONSTRAINT)
- **Session Duration Target**: ${sessionDuration} minutes (max 90 minutes)
- **Location**: ${locationEn}
- **Equipment Type**: ${equipmentTypeEn}
- **Available Equipment**: ${equipmentStr}
- **Custom Equipment**: ${customEquipmentStr}
- **Preferred Exercises**: ${preferredExercisesStr}
- **Exercise Preferences**: ${profile.exercisePreferences || 'None'}
- **Avoided Exercises**: ${avoidedExercisesStr}
- **Limitations**: ${limitationsStr}
- **Target Muscles / Priority**: ${targetMusclesEn || 'None'}
- **Body Measurements**: ${bodyMeasStr}
- **Strength Records**: ${strengthRecordsStr}
- **Sleep Quality**: ${profile.sleepHours || 'Not specified'} hours/night
- **Job Stress**: ${profile.jobStress || 'Not specified'}
- **Work Shift**: ${profile.workShift || 'Not specified'}
- **Activity Level**: ${profile.activityLevel || 'Moderately Active'}
- **Recovery Quality**: ${profile.recoveryQuality || 'Not specified'}
- **Injuries**: ${injuriesStr}
- **Injury Details**: ${profile.injuryDetails || 'None'}
- **Hormone / Medication Notes**: ${profile.hormoneMedNotes || 'None'}
- **Competition Date / Deadline**: ${profile.competitionDate || 'None'}

## PRE-PROGRAMMING ANALYSIS (MANDATORY)
Before selecting exercises, analyze:
1. Primary Goal
2. Experience Level vs recovery capacity
3. Age
4. Sleep Quality
5. Job Stress
6. Activity Level
7. Target Weight
8. Recovery Quality
9. Injuries/Limitations
10. Exactly ${trainingDays} available training days per week
11. Optimal placement of those ${trainingDays} training days across the Iranian week to maximize recovery and adherence

## VOLUME CALCULATION (MANDATORY)
For each muscle group, calculate direct and indirect weekly volume across exactly ${trainingDays} sessions.
- Priority muscles: usually 2x/week when compatible with ${trainingDays} days.
- Non-priority muscles: at least 1x/week with maintenance volume.
- Start near MEV and progress only with adequate recovery.

## RIR/RPE PRESCRIPTION (MANDATORY)
For EVERY exercise, specify RIR (Reps In Reserve):
- **Compound Multi-Joint**: RIR 2-3 (e.g., Squat, Bench Press, Deadlift)
- **Machine Exercises**: RIR 1-2
- **Isolation Exercises**: RIR 0-2
- **Spine-Sensitive Movements**: NEVER allow forced muscular failure (maintain RIR 2+)

## EXERCISE SPECIFICATION (MANDATORY FOR EACH EXERCISE)
For each exercise, you MUST provide:
1. **Load Selection Method**: (e.g., "% of 1RM", "RPE-based", "Last successful session + 2.5%")
2. **Sets**: Number of working sets
3. **Rep Range**: (e.g., "6-8", "8-12", "12-15")
4. **Rest**: Seconds between sets
5. **Tempo**: (e.g., "3-1-1-0" - eccentric-pause-concentric-pause)
6. **Target Muscle**: Primary muscle being trained
7. **Substitute**: Alternative exercise if equipment unavailable or injury flare-up
8. **Stopping Criterion**: When to stop the set (e.g., "RIR 2 reached", "Form breakdown", "Pain")
9. **Progression Method**: How to progress (e.g., "Double progression: when all sets hit top of rep range with target RIR, increase load 2-5% next session")

## DOUBLE PROGRESSION MODEL (MANDATORY)
Use double progression: When the athlete completes all sets at the TOP of the rep range while maintaining the prescribed RIR, increase the load by 2-5% in the next session.

## SESSION STRUCTURE (MANDATORY)
Each of the ${trainingDays} sessions MUST include:
1. **General Warm-up**: 5-10 minutes (light cardio, mobility)
2. **Preparation Sets**: 2-3 warm-up sets for first compound movement
3. **Main Exercises**: Compound movements first
4. **Accessory Exercises**: Isolation and machine work
5. **Core Work**: If appropriate for goal
6. **Low-Intensity Cardio**: If compatible with goal (e.g., fat loss)

**Total Session Time**: MUST fit within ${sessionDuration} minutes and MUST NOT exceed 90 minutes (including warm-up and rest).

## SAFETY & INJURY PROTOCOL (MANDATORY)
If any of these occur, STOP the exercise and substitute:
- Sharp pain
- Pain radiating down the leg
- Numbness or tingling
- Weakness or loss of motor control
- Sustained worsening of symptoms

For EVERY spine-sensitive exercise (e.g., Barbell Squat, Deadlift, Bent-Over Row), you MUST provide a spine-friendly alternative (e.g., Leg Press, Hip Thrust, Chest-Supported Row).

## AESTHETIC GOALS (IF SPECIFIED)
- **"Broad Shoulders"**: Emphasize lateral and rear deltoids (e.g., Lateral Raises, Face Pulls, Reverse Flyes)
- **"Chest/Back Separation"**: Focus on muscle hypertrophy, proper angles, and overall fat reduction (NOT spot reduction)

## SCIENTIFIC FRAMEWORK
Apply these evidence-based principles:
1. **Volume Landmarks**: Follow RP MEV, MAV, MRV for each muscle based on experience level
2. **Frequency**: Distribute frequency intelligently across exactly ${trainingDays} sessions
3. **Progressive Overload**: Double progression model
4. **Exercise Selection**: Biomechanically appropriate with proper movement patterns
5. **Rest Periods**: 2-5min for heavy compounds, 1-2min for isolation
6. **Tempo**: Include tempo prescriptions for key exercises
7. **Periodization**: Weekly undulation if appropriate
8. **Recovery Programming**: Place training days and rest days strategically to manage systemic fatigue, muscle damage, and soreness.

## STRICT PROGRAMMING RULES (MANDATORY - VIOLATION WILL RESULT IN REJECTION)
${programSpecificRules}
${priorityRule}
${secondaryGoalRule}
- **Recovery Rule**: Never schedule heavy compound movements for the same muscle group on consecutive days unless the chosen split explicitly requires it and volume is managed.
- **Weekly Calendar Rule**: The program must be usable inside a real 7-day Iranian week, with explicit training weekdays and explicit rest weekdays.

## OUTPUT REQUIREMENTS
You MUST respond with ONLY valid JSON. No markdown, no explanations outside JSON.

The JSON must follow this EXACT structure. The "days" array MUST contain exactly ${trainingDays} day objects.
{
  "program_name": "نام برنامه به فارسی",
  "duration": "${safeTimeline}",
  "training_days": ${trainingDays},
  "rest_days": ["روزهای استراحت به فارسی، دقیقاً ${restDaysCount} مورد"],
  "weekly_volume_summary": {
    "Chest": "X sets direct, Y sets indirect",
    "Back": "X sets direct, Y sets indirect",
    "Quadriceps": "X sets direct, Y sets indirect",
    "Hamstrings": "X sets direct, Y sets indirect",
    "Shoulders": "X sets direct, Y sets indirect",
    "Biceps": "X sets direct, Y sets indirect",
    "Triceps": "X sets direct, Y sets indirect",
    "Calves": "X sets direct, Y sets indirect",
    "Abs": "X sets direct"
  },
  "session_duration_summary": {
${sessionDurationSummaryExample}
  },
  "adjustment_rules": "قوانین تعدیل برنامه بر اساس خواب، استرس، درد و افت عملکرد به فارسی",
  "days": [
    {
      "weekday": "نام روز هفته به فارسی (مثلاً: شنبه)",
      "order": 1,
      "day": "نام روز به فارسی (مثلاً: روز ۱: ...)",
      "muscle_groups": ["گروه عضلانی به فارسی"],
      "warm_up": "توضیح گرم‌کردن عمومی و ست‌های آماده‌سازی به فارسی",
      "exercises": [
        {
          "name": "نام تمرین به فارسی",
          "sets": "تعداد ست (عدد)",
          "reps": "محدوده تکرار (مثلاً: 6-8)",
          "rest": "زمان استراحت به ثانیه (عدد)",
          "tempo": "تمپو (مثلاً: 3-1-1-0)",
          "rir": "RIR (مثلاً: 2-3)",
          "load_method": "روش انتخاب بار",
          "target_muscle": "عضله هدف به فارسی",
          "substitute": "حرکت جایگزین به فارسی",
          "stopping_criterion": "معیار توقف",
          "progression": "روش پیشرفت",
          "notes": "نکات مهم به فارسی"
        }
      ],
      "core_work": "تمرین مرکزی (در صورت وجود) به فارسی",
      "cardio": "هوازی کم‌فشار (در صورت وجود) به فارسی"
    }
  ]
}

Important:
- All text values in JSON must be in Persian (Farsi), except exercise names may include English if common.
- "days" MUST have exactly ${trainingDays} elements.
- "days"[].weekday MUST be unique and MUST be from this list: ${weekdayList}.
- "rest_days" MUST have exactly ${restDaysCount} elements and MUST contain the unused weekdays.
- "session_duration_summary" MUST have keys Day 1 through Day ${trainingDays}.
- "duration" MUST be exactly "${safeTimeline}".
- Ensure total session time fits within ${sessionDuration} minutes (max 90 minutes).
- Respect injuries, limitations, and avoided exercises strictly.
- EVERY exercise must have RIR, substitute, stopping criterion, and progression method.
- Include weekly volume summary and adjustment rules.
`;

  return prompt;
}

export function generateNutritionPrompt(profile: AthleteProfile): string {
  const goalEn = translateGoal(profile.dietaryGoal || profile.primaryGoal);
  const timeline = (profile.timeline || '').trim() || '۱ ماه';
  const safeTimeline = timeline.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const mealsPerDay = Number(profile.mealsPerDay) || 3;

  const favoriteFoodsStr = (profile.favoriteFoods || []).join(', ') || 'None';
  const dislikedFoodsStr = (profile.dislikedFoods || []).join(', ') || 'None';
  const allergiesStr = (profile.foodAllergies || []).join(', ') || 'None';
  const healthConditionsStr = (profile.healthConditions || []).join(', ') || 'None';
  const injuriesStr = (profile.injuries || []).join(', ') || 'None';

  const cookingSkillText =
    profile.cookingSkill === 'none'
      ? 'No cooking skills - needs very simple recipes'
      : profile.cookingSkill === 'basic'
      ? 'Basic - can prepare simple meals'
      : profile.cookingSkill === 'intermediate'
      ? 'Intermediate - can prepare diverse meals'
      : 'Advanced - can prepare complex meals';

  const prompt = `You are an expert sports nutritionist and dietitian. Create a practical, culturally appropriate, evidence-based nutrition plan for this athlete.

## CRITICAL DURATION MANDATE
The athlete requested a program timeframe / duration of: "${timeline}".
You MUST set the JSON "duration" field strictly to match this exact requested timeframe in Persian.
DO NOT DEFAULT TO 4, 8, OR 12 WEEKS.

## ATHLETE PROFILE
- **Name**: ${profile.name}
- **Age**: ${profile.age} years old
- **Gender**: ${profile.gender === 'male' ? 'Male' : 'Female'}
- **Height**: ${profile.height} cm
- **Current Weight**: ${profile.weight} kg
- **Target Weight**: ${profile.targetWeight ? profile.targetWeight + ' kg' : 'Not specified'}
- **Body Fat Percent**: ${profile.bodyFatPercent != null ? profile.bodyFatPercent + '%' : 'Not specified'}
- **Body Composition**: ${profile.bodyComposition || 'Not specified'}
- **Primary Goal**: ${goalEn}
- **Dietary Goal**: ${profile.dietaryGoal || goalEn}
- **Activity Level**: ${profile.activityLevel || 'Moderately Active'}
- **Training Days Per Week**: ${profile.trainingDays || 4}
- **Sleep**: ${profile.sleepHours != null ? profile.sleepHours + ' hours/night' : 'Not specified'}
- **Job Stress**: ${profile.jobStress || 'Not specified'}
- **Diet Type**: ${profile.dietType || 'Balanced'}
- **Meals Per Day**: ${mealsPerDay}
- **Calorie Target**: ${profile.calorieTarget ? profile.calorieTarget + ' kcal/day' : 'You must calculate appropriately'}
- **Favorite Foods**: ${favoriteFoodsStr}
- **Disliked Foods**: ${dislikedFoodsStr}
- **Food Allergies**: ${allergiesStr}
- **Health Conditions**: ${healthConditionsStr}
- **Injuries**: ${injuriesStr}
- **Cooking Skill**: ${cookingSkillText}
- **Hormone / Medication Notes**: ${profile.hormoneMedNotes || 'None'}

## NUTRITION REQUIREMENTS
1. Create a 7-day repeatable meal plan with exactly ${mealsPerDay} meals per day.
2. Prioritize protein intake appropriate for the goal and body weight.
3. Use Iranian/Middle Eastern foods where appropriate.
4. Respect allergies, disliked foods, health conditions, and cooking skill.
5. Provide realistic portions in household measures and grams when possible.
6. Include hydration guidance.
7. Include supplement notes only if evidence-based and appropriate.
8. Do not promote extreme or unsafe diets.
9. If calorie target is provided, respect it unless medically unsafe.
10. All text values in JSON must be in Persian (Farsi), except common food names may include English.

## OUTPUT FORMAT
You MUST respond with ONLY valid JSON. No markdown, no explanations outside JSON.

{
  "plan_name": "نام برنامه تغذیه به فارسی",
  "duration": "${safeTimeline}",
  "daily_calories": 0,
  "macros": {
    "protein": 0,
    "carbs": 0,
    "fats": 0
  },
  "days": [
    {
      "day": "روز ۱",
      "meals": [
        {
          "meal_name": "نام وعده به فارسی",
          "time": "HH:MM",
          "foods": [
            {
              "name": "نام غذا به فارسی",
              "portion": "مقدار مصرف",
              "calories": 0,
              "protein": 0,
              "carbs": 0,
              "fats": 0
            }
          ],
          "preparation": "نحوه تهیه ساده به فارسی"
        }
      ],
      "total_calories": 0,
      "notes": "نکات روز به فارسی"
    }
  ],
  "hydration": "راهنمای نوشیدن آب به فارسی",
  "supplements": "توصیه مکمل غذایی در صورت نیاز به فارسی"
}

Important:
- "days" MUST contain exactly 7 day objects.
- Each day MUST contain exactly ${mealsPerDay} meals.
- Macros must roughly match daily_calories: protein 4 kcal/g, carbs 4 kcal/g, fats 9 kcal/g.
- Keep the plan practical and sustainable.
`;

  return prompt;
}

export function generateSupplementPrompt(profile: AthleteProfile): string {
  const goalEn = translateGoal(profile.supplementGoal || profile.primaryGoal);
  const currentSupplementsStr = (profile.currentSupplements || []).join(', ') || 'None';
  const healthConditionsStr = (profile.healthConditions || []).join(', ') || 'None';
  const injuriesStr = (profile.injuries || []).join(', ') || 'None';

  const prompt = `You are an evidence-based sports nutrition and supplementation advisor.

## TASK
Create a safe, prioritized, budget-aware supplement recommendation for this athlete.

## ATHLETE PROFILE
- **Name**: ${profile.name}
- **Age**: ${profile.age} years old
- **Gender**: ${profile.gender === 'male' ? 'Male' : 'Female'}
- **Weight**: ${profile.weight} kg
- **Experience Level**: ${translateExperience(profile.experience)}
- **Primary Goal**: ${goalEn}
- **Supplement Goal**: ${profile.supplementGoal || goalEn}
- **Current Supplements**: ${currentSupplementsStr}
- **Monthly Budget**: ${profile.supplementBudget || 'Not specified'}
- **Health Conditions**: ${healthConditionsStr}
- **Injuries**: ${injuriesStr}
- **Injury Details**: ${profile.injuryDetails || 'None'}
- **Hormone / Medication Notes**: ${profile.hormoneMedNotes || 'None'}
- **Sleep**: ${profile.sleepHours != null ? profile.sleepHours + ' hours/night' : 'Not specified'}
- **Recovery Quality**: ${profile.recoveryQuality || 'Not specified'}

## RULES
1. Only recommend supplements with reasonable evidence for the stated goal.
2. Prioritize basics before exotic supplements.
3. Respect health conditions, medications, and hormone-related notes.
4. Do not recommend unsafe, banned, or medical treatments.
5. Include dosage, timing, benefits, side effects, cost estimate, and notes.
6. Make clear that supplements do not replace food, training, sleep, or medical care.
7. All text values in JSON must be in Persian (Farsi), except English supplement names may be included.

## OUTPUT FORMAT
You MUST respond with ONLY valid JSON. No markdown, no explanations outside JSON.

{
  "recommendation_title": "عنوان توصیه مکمل به فارسی",
  "summary": "خلاصه کوتاه و علمی به فارسی",
  "supplements": [
    {
      "name": "نام مکمل به فارسی",
      "english_name": "English name",
      "priority": "بالا / متوسط / پایین",
      "dosage": "دوز پیشنهادی",
      "timing": "زمان مصرف",
      "benefits": "فواید احتمالی به فارسی",
      "side_effects": "عوارض احتمالی به فارسی",
      "estimated_cost": "برآورد هزینه به فارسی",
      "recommended_brands": "برندهای معتبر یا معیار کیفیت",
      "notes": "نکات مهم به فارسی"
    }
  ],
  "total_estimated_cost": "برآورد هزینه کلی به فارسی",
  "important_notes": "نکات مهم به فارسی",
  "warnings": "هشدارهای ایمنی به فارسی"
}

Important:
- "supplements" must be a non-empty array.
- Keep recommendations conservative and evidence-based.
- If medication or hormone notes exist, advise consulting a physician before use.
`;

  return prompt;
}

export function validateWorkoutJSON(json: string, expectedDays?: number): { valid: boolean; data?: any; error?: string } {
  try {
    const data = JSON.parse(cleanJsonInput(json));

    if (!data.program_name || typeof data.program_name !== 'string') {
      return { valid: false, error: 'فیلد program_name یک رشته معتبر نیست' };
    }

    if (!data.duration || typeof data.duration !== 'string') {
      return { valid: false, error: 'فیلد duration یک رشته معتبر نیست' };
    }

    if (!data.days || !Array.isArray(data.days)) {
      return { valid: false, error: 'ساختار JSON ناقص است (days وجود ندارد یا آرایه نیست)' };
    }

    if (data.days.length === 0) {
      return { valid: false, error: 'آرایه days خالی است' };
    }

    if (typeof expectedDays === 'number' && Number.isFinite(expectedDays) && expectedDays > 0) {
      const normalizedExpected = Math.min(7, Math.round(expectedDays));
      if (data.days.length !== normalizedExpected) {
        return {
          valid: false,
          error: `تعداد روزهای برنامه (${data.days.length}) با تعداد روزهای درخواستی پروفایل (${normalizedExpected}) مطابقت ندارد.`,
        };
      }
    }

    for (let i = 0; i < data.days.length; i++) {
      const day = data.days[i];

      if (!day || typeof day !== 'object') {
        return { valid: false, error: `عنصر شماره ${i + 1} در days یک آبجکت نیست` };
      }

      if (!day.day || typeof day.day !== 'string') {
        return { valid: false, error: `فیلد day در روز ${i + 1} معتبر نیست` };
      }

      if (!Array.isArray(day.exercises)) {
        return { valid: false, error: `فیلد exercises در روز ${i + 1} آرایه نیست` };
      }

      if (day.exercises.length === 0) {
        return { valid: false, error: `روز ${i + 1} هیچ حرکتی ندارد` };
      }
    }

    return { valid: true, data };
  } catch (e) {
    return { valid: false, error: 'فرمت JSON نامعتبر است: ' + (e as Error).message };
  }
}

export function validateNutritionJSON(json: string): { valid: boolean; data?: any; error?: string } {
  try {
    const data = JSON.parse(cleanJsonInput(json));

    if (!data.plan_name || typeof data.plan_name !== 'string') {
      return { valid: false, error: 'فیلد plan_name یک رشته معتبر نیست' };
    }

    if (!data.duration || typeof data.duration !== 'string') {
      return { valid: false, error: 'فیلد duration یک رشته معتبر نیست' };
    }

    if (!data.days || !Array.isArray(data.days)) {
      return { valid: false, error: 'ساختار JSON ناقص است (days وجود ندارد یا آرایه نیست)' };
    }

    if (data.days.length === 0) {
      return { valid: false, error: 'آرایه days خالی است' };
    }

    for (let i = 0; i < data.days.length; i++) {
      const day = data.days[i];

      if (!day || typeof day !== 'object') {
        return { valid: false, error: `عنصر شماره ${i + 1} در days یک آبجکت نیست` };
      }

      if (!day.day || typeof day.day !== 'string') {
        return { valid: false, error: `فیلد day در روز ${i + 1} معتبر نیست` };
      }

      if (!Array.isArray(day.meals)) {
        return { valid: false, error: `فیلد meals در روز ${i + 1} آرایه نیست` };
      }

      if (day.meals.length === 0) {
        return { valid: false, error: `روز ${i + 1} هیچ وعده غذایی ندارد` };
      }
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

    const title = raw.recommendation_title || raw.plan_name;

    if (!title || typeof title !== 'string') {
      return { valid: false, error: 'فیلد recommendation_title (یا plan_name) الزامی است' };
    }

    if (!raw.supplements || !Array.isArray(raw.supplements)) {
      return { valid: false, error: 'فیلد supplements باید آرایه‌ای از مکمل‌ها باشد' };
    }

    if (raw.supplements.length === 0) {
      return { valid: false, error: 'فیلد supplements نباید خالی باشد' };
    }

    for (let i = 0; i < raw.supplements.length; i++) {
      const supplement = raw.supplements[i];

      if (!supplement || typeof supplement !== 'object') {
        return { valid: false, error: `مکمل شماره ${i + 1} یک آبجکت نیست` };
      }

      if (!supplement.name || typeof supplement.name !== 'string') {
        return { valid: false, error: `فیلد name برای مکمل شماره ${i + 1} الزامی است` };
      }
    }

    return { valid: true, data: raw };
  } catch (e) {
    return { valid: false, error: 'فرمت JSON نامعتبر است: ' + (e as Error).message };
  }
}