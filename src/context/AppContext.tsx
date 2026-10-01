import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { AppState, AthleteProfile, WorkoutProgram, NutritionProgram, SupplementProgram, WorkoutSession as BaseWorkoutSession, ProgressEntry } from '../types';
import { loadState, saveState } from '../utils/storage';
import { DEFAULT_WORKOUT_PLAN } from '../data/defaultWorkoutPlan';

export interface WorkoutSession extends BaseWorkoutSession {
  name?: string;
}

// تابع کمکی برای نرمال‌سازی برنامه (چه پیش‌فرض چه ایمپورت شده)
const normalizeProgram = (program: WorkoutProgram | null): WorkoutProgram => {
  if (!program) return DEFAULT_WORKOUT_PLAN as unknown as WorkoutProgram;
  
  // اگر برنامه ایمپورت شده فاقد days باشد یا ساختارش ناقص باشد، از پیش‌فرض استفاده کن
  if (!program.days || program.days.length === 0) {
    return DEFAULT_WORKOUT_PLAN as unknown as WorkoutProgram;
  }

  // اطمینان از وجود totalSets در هر روز (برای سازگاری با Calendar)
  const normalizedDays = program.days.map(day => ({
    ...day,
    totalSets: day.totalSets || (day.exercises?.reduce((sum: number, ex: any) => sum + (ex.sets || 0), 0) || 0)
  }));

  return { ...program, days: normalizedDays };
};

interface AppContextType {
  state: AppState;
  activeProgramData: WorkoutProgram; 
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

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeProfile = useMemo(() => {
    if (!state.activeProfileId) return null;
    return state.profiles.find(p => p.id === state.activeProfileId) || null;
  }, [state.profiles, state.activeProfileId]);

  // ✅ استفاده از تابع نرمال‌ساز برای تضمین سینک بودن داده‌ها
  const activeProgramData = useMemo(() => {
    let rawProgram: WorkoutProgram | null = null;
    if (state.activeProgram) {
      rawProgram = state.programs.find(p => p.id === state.activeProgram) || null;
    }
    return normalizeProgram(rawProgram);
  }, [state.programs, state.activeProgram]);

  const programs = useMemo(() =>
    state.programs.filter(p => p.profileId === state.activeProfileId),
    [state.programs, state.activeProfileId]
  );

  const sessions = useMemo(() =>
    state.sessions.filter(s => s.profileId === state.activeProfileId) as WorkoutSession[],
    [state.sessions, state.activeProfileId]
  );

  const progress = useMemo(() =>
    state.progress.filter(p => p.profileId === state.activeProfileId),
    [state.progress, state.activeProfileId]
  );

  const nutritionPrograms = useMemo(() =>
    state.nutritionPrograms.filter(p => p.profileId === state.activeProfileId),
    [state.nutritionPrograms, state.activeProfileId]
  );

  const supplementPrograms = useMemo(() =>
    state.supplementPrograms.filter(p => p.profileId === state.activeProfileId),
    [state.supplementPrograms, state.activeProfileId]
  );

  const setActiveProfile = useCallback((id: string | null) => {
    setState(prev => {
      if (id === prev.activeProfileId) return prev;
      const profilePrograms = prev.programs.filter(p => p.profileId === id);
      return {
        ...prev,
        activeProfileId: id,
        activeProgram: profilePrograms[0]?.id ?? null,
        activeNutritionProgram: prev.nutritionPrograms.find(p => p.profileId === id)?.id ?? null,
        activeSupplementProgram: prev.supplementPrograms.find(p => p.profileId === id)?.id ?? null,
      };
    });
  }, []);

  const saveProfile = useCallback((profile: AthleteProfile) => {
    setState(prev => {
      const existingIndex = prev.profiles.findIndex(p => p.id === profile.id);
      const newProfiles = existingIndex >= 0 
        ? prev.profiles.map((p, i) => i === existingIndex ? profile : p)
        : [...prev.profiles, profile];
      return { ...prev, profiles: newProfiles, activeProfileId: prev.activeProfileId || profile.id };
    });
  }, []);

  const deleteProfile = useCallback((id: string) => {
    setState(prev => {
      const newProfiles = prev.profiles.filter(p => p.id !== id);
      const nextId = prev.activeProfileId === id ? (newProfiles[0]?.id ?? null) : prev.activeProfileId;
      return {
        ...prev,
        profiles: newProfiles,
        programs: prev.programs.filter(p => p.profileId !== id),
        nutritionPrograms: prev.nutritionPrograms.filter(p => p.profileId !== id),
        supplementPrograms: prev.supplementPrograms.filter(p => p.profileId !== id),
        sessions: prev.sessions.filter(s => s.profileId !== id),
        progress: prev.progress.filter(p => p.profileId !== id),
        activeProfileId: nextId,
        activeProgram: nextId ? null : null,
      };
    });
  }, []);

  const addProgram = useCallback((program: WorkoutProgram) => {
    setState(prev => ({ ...prev, programs: [...prev.programs, program], activeProgram: prev.activeProgram || program.id }));
  }, []);

  const updateProgram = useCallback((program: WorkoutProgram) => {
    setState(prev => ({ ...prev, programs: prev.programs.map(p => p.id === program.id ? program : p) }));
  }, []);

  const removeProgram = useCallback((id: string) => {
    setState(prev => {
      const remaining = prev.programs.filter(p => p.id !== id);
      return {
        ...prev,
        programs: remaining,
        activeProgram: prev.activeProgram === id ? (remaining.find(p => p.profileId === prev.activeProfileId)?.id ?? null) : prev.activeProgram,
      };
    });
  }, []);

  const setActiveProgram = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, activeProgram: id }));
  }, []);

  const addNutritionProgram = useCallback((program: NutritionProgram) => {
    setState(prev => ({ ...prev, nutritionPrograms: [...prev.nutritionPrograms, program], activeNutritionProgram: prev.activeNutritionProgram || program.id }));
  }, []);

  const removeNutritionProgram = useCallback((id: string) => {
    setState(prev => {
      const remaining = prev.nutritionPrograms.filter(p => p.id !== id);
      return { ...prev, nutritionPrograms: remaining, activeNutritionProgram: prev.activeNutritionProgram === id ? (remaining[0]?.id ?? null) : prev.activeNutritionProgram };
    });
  }, []);

  const setActiveNutritionProgram = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, activeNutritionProgram: id }));
  }, []);

  const addSupplementProgram = useCallback((program: SupplementProgram) => {
    setState(prev => ({ ...prev, supplementPrograms: [...prev.supplementPrograms, program], activeSupplementProgram: prev.activeSupplementProgram || program.id }));
  }, []);

  const removeSupplementProgram = useCallback((id: string) => {
    setState(prev => {
      const remaining = prev.supplementPrograms.filter(p => p.id !== id);
      return { ...prev, supplementPrograms: remaining, activeSupplementProgram: prev.activeSupplementProgram === id ? (remaining[0]?.id ?? null) : prev.activeSupplementProgram };
    });
  }, []);

  const setActiveSupplementProgram = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, activeSupplementProgram: id }));
  }, []);

  const addSession = useCallback((session: WorkoutSession) => {
    setState(prev => ({ ...prev, sessions: [...prev.sessions, session] }));
  }, []);

  const updateSession = useCallback((session: WorkoutSession) => {
    setState(prev => ({ ...prev, sessions: prev.sessions.map(s => s.id === session.id ? session : s) }));
  }, []);

  const addProgress = useCallback((entry: ProgressEntry) => {
    setState(prev => ({ ...prev, progress: [...prev.progress, entry] }));
  }, []);

  return (
    <AppContext.Provider value={{
      state, activeProgramData, profiles: state.profiles, activeProfile, setActiveProfile, saveProfile, deleteProfile,
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
