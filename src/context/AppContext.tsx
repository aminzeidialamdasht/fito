import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { AppState, AthleteProfile, WorkoutProgram, NutritionProgram, SupplementProgram, WorkoutSession as BaseWorkoutSession, ProgressEntry } from '../types';
import { loadState, saveState } from '../utils/storage';
import { DEFAULT_WORKOUT_PLAN } from '../data/defaultWorkoutPlan';

export const APP_VERSION = 'v1.5.0';
export interface WorkoutSession extends BaseWorkoutSession { name?: string; }

// ==========================================
// LAYER 1: SMART NORMALIZATION ENGINE
// ==========================================
const DAY_MAP: Record<string, string> = {
  'saturday': 'شنبه', 'sat': 'شنبه', '0': 'شنبه',
  'sunday': 'یکشنبه', 'sun': 'یکشنبه', '1': 'یکشنبه',
  'monday': 'دوشنبه', 'mon': 'دوشنبه', '2': 'دوشنبه',
  'tuesday': 'سه‌شنبه', 'tue': 'سه‌شنبه', '3': 'سه‌شنبه',
  'wednesday': 'چهارشنبه', 'wed': 'چهارشنبه', '4': 'چهارشنبه',
  'thursday': 'پنجشنبه', 'thu': 'پنجشنبه', '5': 'پنجشنبه',
  'friday': 'جمعه', 'fri': 'جمعه', '6': 'جمعه',
  'شنبه': 'شنبه', 'یکشنبه': 'یکشنبه', 'دوشنبه': 'دوشنبه', 
  'سه‌شنبه': 'سه‌شنبه', 'چهارشنبه': 'چهارشنبه', 'پنجشنبه': 'پنجشنبه', 'جمعه': 'جمعه'
};

const normalizeDays = (days: any[]) => {
  if (!days || !Array.isArray(days)) return [];
  
  return days.map((day, index) => {
    let persianDay = day.day;
    
    // تطبیق هوشمند نام روزها (Case-insensitive + Fallback)
    if (day.day) {
      const lowerKey = String(day.day).toLowerCase().trim();
      if (DAY_MAP[lowerKey]) persianDay = DAY_MAP[lowerKey];
      else if (DAY_MAP[day.day]) persianDay = day.day;
    } else if (index >= 0 && index < 7) {
       // فال‌بک بر اساس ایندکس اگر نام روز موجود نبود
       const fallbackDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
       persianDay = fallbackDays[index];
    }

    // محاسبه خودکار totalSets در صورت فقدان
    const sets = day.exercises?.reduce((sum: number, ex: any) => sum + (Number(ex.sets) || 0), 0) || 0;
    
    return {
      ...day,
      day: persianDay,
      totalSets: day.totalSets || sets,
      exercises: day.exercises || []
    };
  });
};

const normalizeProgram = (program: WorkoutProgram | null): WorkoutProgram => {
  if (!program || !program.days || program.days.length === 0) {
    return DEFAULT_WORKOUT_PLAN as unknown as WorkoutProgram;
  }
  return { ...program, days: normalizeDays(program.days as any) };
};

// ==========================================
// CORE CONTEXT DEFINITION
// ==========================================
interface AppContextType {
  state: AppState;
  appVersion: string;
  activeProgramData: WorkoutProgram; // همیشه نرمال‌شده و آماده مصرف
  profiles: AthleteProfile[];
  activeProfile: AthleteProfile | null;
  setActiveProfile: (id: string | null) => void;
  saveProfile: (profile: AthleteProfile) => void;
  deleteProfile: (id: string) => void;
  programs: WorkoutProgram[];
  addProgram: (program: WorkoutProgram) => void;
  updateProgram: (program: WorkoutProgram) => void;
  removeProgram: (id: string) => void;
  setActiveProgram: (id: string | null) => void;
  nutritionPrograms: NutritionProgram[];
  addNutritionProgram: (program: NutritionProgram) => void;
  removeNutritionProgram: (id: string) => void;
  setActiveNutritionProgram: (id: string | null) => void;
  supplementPrograms: SupplementProgram[];
  addSupplementProgram: (program: SupplementProgram) => void;
  removeSupplementProgram: (id: string) => void;
  setActiveSupplementProgram: (id: string | null) => void;
  sessions: WorkoutSession[];
  addSession: (session: WorkoutSession) => void;
  updateSession: (session: WorkoutSession) => void;
  progress: ProgressEntry[];
  addProgress: (entry: ProgressEntry) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);
  useEffect(() => { saveState(state); }, [state]);

  // ==========================================
  // LAYER 2 & 3: PROFILE-AWARE REACTIVE STATE
  // ==========================================
  const activeProfile = useMemo(() => 
    state.activeProfileId ? state.profiles.find(p => p.id === state.activeProfileId) || null : null, 
    [state.profiles, state.activeProfileId]
  );

  const activeProgramData = useMemo(() => {
    // پیدا کردن برنامه فعال مخصوص پروفایل جاری
    let rawProgram: WorkoutProgram | null = null;
    if (state.activeProgram && state.activeProfileId) {
      rawProgram = state.programs.find(p => p.id === state.activeProgram && p.profileId === state.activeProfileId) || null;
    }
    
    // نرمال‌سازی + Deep Clone برای شکستن کش ری‌اکت و آپدیت آنی UI
    const normalized = normalizeProgram(rawProgram);
    return JSON.parse(JSON.stringify(normalized));
  }, [state.programs, state.activeProgram, state.activeProfileId]);

  const programs = useMemo(() => state.programs.filter(p => p.profileId === state.activeProfileId), [state.programs, state.activeProfileId]);
  const sessions = useMemo(() => state.sessions.filter(s => s.profileId === state.activeProfileId) as WorkoutSession[], [state.sessions, state.activeProfileId]);
  const progress = useMemo(() => state.progress.filter(p => p.profileId === state.activeProfileId), [state.progress, state.activeProfileId]);
  const nutritionPrograms = useMemo(() => state.nutritionPrograms.filter(p => p.profileId === state.activeProfileId), [state.nutritionPrograms, state.activeProfileId]);
  const supplementPrograms = useMemo(() => state.supplementPrograms.filter(p => p.profileId === state.activeProfileId), [state.supplementPrograms, state.activeProfileId]);

  const setActiveProfile = useCallback((id: string | null) => setState(prev => prev.activeProfileId === id ? prev : ({ ...prev, activeProfileId: id, activeProgram: prev.programs.filter(p => p.profileId === id)[0]?.id ?? null })), []);
  const saveProfile = useCallback((profile: AthleteProfile) => setState(prev => { const idx = prev.profiles.findIndex(p => p.id === profile.id); return { ...prev, profiles: idx >= 0 ? prev.profiles.map((p, i) => i === idx ? profile : p) : [...prev.profiles, profile], activeProfileId: prev.activeProfileId || profile.id }; }), []);
  const deleteProfile = useCallback((id: string) => setState(prev => { const np = prev.profiles.filter(p => p.id !== id); const nid = prev.activeProfileId === id ? (np[0]?.id ?? null) : prev.activeProfileId; return { ...prev, profiles: np, programs: prev.programs.filter(p => p.profileId !== id), activeProfileId: nid, activeProgram: nid ? null : null }; }), []);
  
  const addProgram = useCallback((p: WorkoutProgram) => setState(prev => ({ ...prev, programs: [...prev.programs, p], activeProgram: prev.activeProgram || p.id })), []);
  const updateProgram = useCallback((p: WorkoutProgram) => setState(prev => ({ ...prev, programs: prev.programs.map(x => x.id === p.id ? p : x) })), []);
  const removeProgram = useCallback((id: string) => setState(prev => ({ ...prev, programs: prev.programs.filter(p => p.id !== id), activeProgram: prev.activeProgram === id ? null : prev.activeProgram })), []);
  const setActiveProgram = useCallback((id: string | null) => setState(prev => ({ ...prev, activeProgram: id })), []);
  
  const addNutritionProgram = useCallback((p: NutritionProgram) => setState(prev => ({ ...prev, nutritionPrograms: [...prev.nutritionPrograms, p] })), []);
  const removeNutritionProgram = useCallback((id: string) => setState(prev => ({ ...prev, nutritionPrograms: prev.nutritionPrograms.filter(p => p.id !== id) })), []);
  const setActiveNutritionProgram = useCallback((id: string | null) => setState(prev => ({ ...prev, activeNutritionProgram: id })), []);
  
  const addSupplementProgram = useCallback((p: SupplementProgram) => setState(prev => ({ ...prev, supplementPrograms: [...prev.supplementPrograms, p] })), []);
  const removeSupplementProgram = useCallback((id: string) => setState(prev => ({ ...prev, supplementPrograms: prev.supplementPrograms.filter(p => p.id !== id) })), []);
  const setActiveSupplementProgram = useCallback((id: string | null) => setState(prev => ({ ...prev, activeSupplementProgram: id })), []);

  const addSession = useCallback((s: WorkoutSession) => setState(prev => ({ ...prev, sessions: [...prev.sessions, s] })), []);
  const updateSession = useCallback((s: WorkoutSession) => setState(prev => ({ ...prev, sessions: prev.sessions.map(x => x.id === s.id ? s : x) })), []);
  const addProgress = useCallback((e: ProgressEntry) => setState(prev => ({ ...prev, progress: [...prev.progress, e] })), []);

  return (
    <AppContext.Provider value={{
      state, appVersion: APP_VERSION, activeProgramData, profiles: state.profiles, activeProfile, setActiveProfile, saveProfile, deleteProfile,
      programs, addProgram, updateProgram, removeProgram, setActiveProgram,
      nutritionPrograms, addNutritionProgram, removeNutritionProgram, setActiveNutritionProgram,
      supplementPrograms, addSupplementProgram, removeSupplementProgram, setActiveSupplementProgram,
      sessions, addSession, updateSession, progress, addProgress,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
