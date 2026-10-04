import { useState, useEffect, useCallback } from 'react';

export interface SetRecord {
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  targetReps: string;
  completed: boolean;
  actualReps: number; // همیشه عدد است
  weight: number;     // همیشه عدد است
}

export interface ActiveSession {
  programId: string;
  dayId: string;
  startTime: number;
  setsLog?: SetRecord[];
}

const STORAGE_KEY = 'fito_active_session';

export function useActiveWorkout() {
  const [session, setSession] = useState<ActiveSession | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSession(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load active session', e);
    }
  }, []);

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [session]);

  const startSession = useCallback((programId: string, dayId: string) => {
    setSession({
      programId,
      dayId,
      startTime: Date.now(),
      setsLog: [],
    });
  }, []);

  const endSession = useCallback(() => {
    setSession(null);
  }, []);

  const updateSession = useCallback((updates: Partial<ActiveSession>) => {
    setSession(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  return {
    session,
    isActive: !!session,
    startSession,
    endSession,
    updateSession,
    setSession,
  };
}
