import { AppState, AthleteProfile, WorkoutProgram, NutritionProgram, SupplementProgram, WorkoutSession, ProgressEntry } from '../types';

const STORAGE_KEY = 'fito_state_v2';

function getInitialState(): AppState {
  return {
    profiles: [],
    activeProfileId: null,
    programs: [],
    nutritionPrograms: [],
    supplementPrograms: [],
    sessions: [],
    progress: [],
    activeProgram: null,
    activeNutritionProgram: null,
    activeSupplementProgram: null,
  };
}

// Migration: convert old single-profile format to new multi-profile format

// Migration: drop legacy `strengthRecords: Record<string,string>` from a profile.
// It was superseded by `strengthRecordsExtended`. If legacy string entries exist and
// extended records are missing, best-effort conversion (e.g. "100" or "100x5") is done
// so nothing breaks; the legacy key is then removed.
function migrateProfile(p: any): AthleteProfile {
  if (!p || typeof p !== 'object') return p;
  const legacy = p.strengthRecords;
  if (legacy && typeof legacy === 'object' && Object.keys(legacy).length > 0) {
    const ext = { ...(p.strengthRecordsExtended || {}) };
    for (const [key, value] of Object.entries(legacy as Record<string, unknown>)) {
      if (key === 'lastUpdated' || typeof value !== 'string' || !value.trim()) continue;
      if (ext[key]) continue; // extended record wins
      const m = value.trim().match(/^(\d+(?:[.,]\d+)?)(?:\s*[x×]\s*(\d+))?$/);
      if (m) {
        const weight = parseFloat(m[1].replace(',', '.'));
        const reps = m[2] ? parseInt(m[2], 10) : 1;
        (ext as any)[key] = { weight, reps };
      }
    }
    p.strengthRecordsExtended = ext;
  }
  delete p.strengthRecords;
  return p;
}

function migrateState(data: any): AppState {
  // Old format had `profile` (single) instead of `profiles` (array)
  if (data.profile && !data.profiles) {
    return {
      profiles: [migrateProfile(data.profile)],
      activeProfileId: data.profile.id,
      programs: (data.programs || []).map((p: any) => ({
        ...p,
        profileId: data.profile.id,
      })),
      nutritionPrograms: (data.nutritionPrograms || []).map((p: any) => ({
        ...p,
        profileId: data.profile.id,
      })),
      supplementPrograms: (data.supplementPrograms || []).map((p: any) => ({
        ...p,
        profileId: data.profile.id,
      })),
      sessions: (data.sessions || []).map((s: any) => ({
        ...s,
        profileId: data.profile.id,
      })),
      progress: (data.progress || []).map((p: any) => ({
        ...p,
        profileId: data.profile.id,
      })),
      activeProgram: data.activeProgram || null,
      activeNutritionProgram: data.activeNutritionProgram || null,
      activeSupplementProgram: data.activeSupplementProgram || null,
    };
  }
  return { 
    ...data, 
    // Drop legacy `strengthRecords` from stored profiles (superseded by strengthRecordsExtended)
    profiles: Array.isArray(data.profiles) ? data.profiles.map(migrateProfile) : [],
    activeProgram: data.activeProgram || null,
    nutritionPrograms: data.nutritionPrograms || [],
    supplementPrograms: data.supplementPrograms || [],
    activeNutritionProgram: data.activeNutritionProgram || null,
    activeSupplementProgram: data.activeSupplementProgram || null,
  };
}

export function loadState(): AppState {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return migrateState(parsed);
    }
  } catch (e) {
    console.error('Error loading state:', e);
  }
  return getInitialState();
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving state:', e);
  }
}

export function saveProfile(profile: AthleteProfile): void {
  const state = loadState();
  const existingIndex = state.profiles.findIndex(p => p.id === profile.id);
  if (existingIndex >= 0) {
    state.profiles[existingIndex] = profile;
  } else {
    state.profiles.push(profile);
  }
  if (!state.activeProfileId) {
    state.activeProfileId = profile.id;
  }
  saveState(state);
}

export function deleteProfile(profileId: string): void {
  const state = loadState();
  state.profiles = state.profiles.filter(p => p.id !== profileId);
  state.programs = state.programs.filter(p => p.profileId !== profileId);
  state.nutritionPrograms = state.nutritionPrograms.filter(p => p.profileId !== profileId);
  state.supplementPrograms = state.supplementPrograms.filter(p => p.profileId !== profileId);
  state.sessions = state.sessions.filter(s => s.profileId !== profileId);
  state.progress = state.progress.filter(p => p.profileId !== profileId);
  if (state.activeProfileId === profileId) {
    state.activeProfileId = state.profiles.length > 0 ? state.profiles[0].id : null;
  }
  saveState(state);
}

export function saveProgram(program: WorkoutProgram): void {
  const state = loadState();
  const existingIndex = state.programs.findIndex(p => p.id === program.id);
  if (existingIndex >= 0) {
    state.programs[existingIndex] = program;
  } else {
    state.programs.push(program);
  }
  saveState(state);
}

export function deleteProgram(programId: string): void {
  const state = loadState();
  state.programs = state.programs.filter(p => p.id !== programId);
  saveState(state);
}

export function saveNutritionProgram(program: NutritionProgram): void {
  const state = loadState();
  const existingIndex = state.nutritionPrograms.findIndex(p => p.id === program.id);
  if (existingIndex >= 0) {
    state.nutritionPrograms[existingIndex] = program;
  } else {
    state.nutritionPrograms.push(program);
  }
  saveState(state);
}

export function deleteNutritionProgram(programId: string): void {
  const state = loadState();
  state.nutritionPrograms = state.nutritionPrograms.filter(p => p.id !== programId);
  if (state.activeNutritionProgram === programId) {
    state.activeNutritionProgram = null;
  }
  saveState(state);
}

export function saveSupplementProgram(program: SupplementProgram): void {
  const state = loadState();
  const existingIndex = state.supplementPrograms.findIndex(p => p.id === program.id);
  if (existingIndex >= 0) {
    state.supplementPrograms[existingIndex] = program;
  } else {
    state.supplementPrograms.push(program);
  }
  saveState(state);
}

export function deleteSupplementProgram(programId: string): void {
  const state = loadState();
  state.supplementPrograms = state.supplementPrograms.filter(p => p.id !== programId);
  if (state.activeSupplementProgram === programId) {
    state.activeSupplementProgram = null;
  }
  saveState(state);
}

export function saveSession(session: WorkoutSession): void {
  const state = loadState();
  const existingIndex = state.sessions.findIndex(s => s.id === session.id);
  if (existingIndex >= 0) {
    state.sessions[existingIndex] = session;
  } else {
    state.sessions.push(session);
  }
  saveState(state);
}

export function saveProgress(entry: ProgressEntry): void {
  const state = loadState();
  state.progress.push(entry);
  saveState(state);
}

export function setActiveProfile(profileId: string | null): void {
  const state = loadState();
  state.activeProfileId = profileId;
  saveState(state);
}
