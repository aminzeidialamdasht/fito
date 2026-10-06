import type { DeloadLevel } from '../../types';

interface FatigueData {
  fatigueLevel: number;
  needsDeload: boolean;
}

/**
 * Phase 8 — تعیین سطح deload بر اساس داده‌های خستگی
 *
 * سطوح:
 *  - heavy:  needsDeload یا fatigueLevel >= 70
 *  - medium: fatigueLevel >= 50
 *  - light:  fatigueLevel >= 30
 *  - none:   سایر
 */
export function getDeloadLevel(fatigue: FatigueData): DeloadLevel {
  if (fatigue.needsDeload || fatigue.fatigueLevel >= 70) {
    return 'heavy';
  }

  if (fatigue.fatigueLevel >= 50) {
    return 'medium';
  }

  if (fatigue.fatigueLevel >= 30) {
    return 'light';
  }

  return 'none';
}
