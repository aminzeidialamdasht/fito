import { useState, useEffect, useCallback } from 'react';

export interface ActiveSession {
  programId: string;
  dayId: string;
  startTime: number;
  completedExercises: string[];
  setsLog: Record<string, any[]>;
}

const STORAGE_KEY = 'coachino_active_session';

export function useActiveWorkout() {
  const [session, setSession] = useState<ActiveSession | null>(null);

  // بارگذاری از حافظه هنگام شروع برنامه
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

  // ذخیره خودکار در حافظه هر بار که وضعیت تغییر کند
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
      completedExercises: [],
      setsLog: {},
    });
  }, []);

  const endSession = useCallback(() => {
    setSession(null);
  }, []);

  return {
    session,
    isActive: !!session,
    startSession,
    endSession,
    setSession,
  };
}