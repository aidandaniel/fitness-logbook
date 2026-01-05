import { useState, useEffect } from 'react';
import { insforge } from '../lib/insforge';
import type { Database } from '../lib/insforge';

type UserSettings = Database['public']['Tables']['user_settings']['Row'];

export type WorkoutDayType = 'push' | 'pull' | 'legs' | 'rest' | 'cardio' | 'upper' | 'lower' | 'full_body';

export interface WorkoutSchedule {
  id: string;
  user_id: string;
  name: string;
  pattern: string[];
  start_date: string;
  created_at: string;
  updated_at: string;
}

export const WORKOUT_DAY_LABELS: Record<WorkoutDayType, string> = {
  push: 'Push',
  pull: 'Pull',
  legs: 'Legs',
  rest: 'Rest',
  cardio: 'Cardio',
  upper: 'Upper Body',
  lower: 'Lower Body',
  full_body: 'Full Body',
};

export const DEFAULT_WORKOUT_COLORS: Record<WorkoutDayType, string> = {
  push: '#3B82F6',    // blue-500
  pull: '#A855F7',    // purple-500
  legs: '#F97316',    // orange-500
  rest: '#9CA3AF',    // gray-400
  cardio: '#22C55E',  // green-500
  upper: '#6366F1',   // indigo-500
  lower: '#14B8A6',   // teal-500
  full_body: '#EF4444', // red-500
};

export const DEFAULT_WORKOUT_BG_CLASSES: Record<WorkoutDayType, string> = {
  push: 'bg-blue-500',
  pull: 'bg-purple-500',
  legs: 'bg-orange-500',
  rest: 'bg-gray-400',
  cardio: 'bg-green-500',
  upper: 'bg-indigo-500',
  lower: 'bg-teal-500',
  full_body: 'bg-red-500',
};

// Local storage key for schedules
const SCHEDULES_STORAGE_KEY = 'workout_schedules';

// Get schedules from localStorage
function getSchedulesFromStorage(userId: string): WorkoutSchedule[] {
  try {
    const stored = localStorage.getItem(`${SCHEDULES_STORAGE_KEY}_${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading schedules from storage:', e);
  }
  return [];
}

// Save schedules to localStorage
function saveSchedulesToStorage(userId: string, schedules: WorkoutSchedule[]) {
  try {
    localStorage.setItem(`${SCHEDULES_STORAGE_KEY}_${userId}`, JSON.stringify(schedules));
  } catch (e) {
    console.error('Error saving schedules to storage:', e);
  }
}

export function useSchedules(userId: string | undefined) {
  const [schedules, setSchedules] = useState<WorkoutSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);

  useEffect(() => {
    if (!userId) {
      setSchedules([]);
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        // Load schedules from localStorage
        if (userId) {
          const storedSchedules = getSchedulesFromStorage(userId);
          setSchedules(storedSchedules);

          // Fetch user settings for custom colors
          const { data: settingsData, error: settingsError } = await insforge.database
            .from('user_settings')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

          if (settingsError) throw settingsError;
          setUserSettings(settingsData);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userId]);

  async function createSchedule(schedule: Omit<WorkoutSchedule, 'user_id' | 'id' | 'created_at' | 'updated_at'>) {
    if (!userId) throw new Error('User not authenticated');

    const newSchedule: WorkoutSchedule = {
      ...schedule,
      id: crypto.randomUUID(),
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Update localStorage
    const updatedSchedules = [newSchedule, ...schedules];
    setSchedules(updatedSchedules);
    if (userId) {
      saveSchedulesToStorage(userId, updatedSchedules);
    }

    return newSchedule;
  }

  async function updateSchedule(id: string, updates: Partial<Omit<WorkoutSchedule, 'user_id' | 'id'>>) {
    const updatedSchedules = schedules.map(s => {
      if (s.id === id) {
        return {
          ...s,
          ...updates,
          updated_at: new Date().toISOString(),
        };
      }
      return s;
    });

    setSchedules(updatedSchedules);
    if (userId) {
      saveSchedulesToStorage(userId, updatedSchedules);
    }

    return updatedSchedules.find(s => s.id === id)!;
  }

  async function deleteSchedule(id: string) {
    const updatedSchedules = schedules.filter(s => s.id !== id);
    setSchedules(updatedSchedules);
    if (userId) {
      saveSchedulesToStorage(userId, updatedSchedules);
    }
  }

  async function updateWorkoutColors(colors: Record<string, string>) {
    if (!userId) throw new Error('User not authenticated');

    // Check if user settings exist
    if (!userSettings) {
      // Create settings
      const { data, error } = await insforge.database
        .from('user_settings')
        .insert([{ user_id: userId, weight_unit: 'kg', workout_colors: colors }])
        .select()
        .single();

      if (error) throw error;
      setUserSettings(data);
    } else {
      // Update settings
      const { data, error } = await insforge.database
        .from('user_settings')
        .update({ workout_colors: colors, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      setUserSettings(data);
    }
  }

  // Get the color for a workout type
  function getWorkoutColor(dayType: WorkoutDayType): { hex: string; tailwind: string } {
    const customColors = userSettings?.workout_colors as Record<string, string> | undefined;

    if (customColors && customColors[dayType]) {
      return {
        hex: customColors[dayType],
        tailwind: getTailwindClass(customColors[dayType]),
      };
    }

    return {
      hex: DEFAULT_WORKOUT_COLORS[dayType],
      tailwind: DEFAULT_WORKOUT_BG_CLASSES[dayType],
    };
  }

  // Convert hex color to tailwind class (simplified mapping)
  function getTailwindClass(hexColor: string): string {
    // Map common colors to tailwind classes
    const colorMap: Record<string, string> = {
      '#3B82F6': 'bg-blue-500',
      '#A855F7': 'bg-purple-500',
      '#F97316': 'bg-orange-500',
      '#9CA3AF': 'bg-gray-400',
      '#22C55E': 'bg-green-500',
      '#6366F1': 'bg-indigo-500',
      '#14B8A6': 'bg-teal-500',
      '#EF4444': 'bg-red-500',
      '#EC4899': 'bg-pink-500',
      '#F59E0B': 'bg-amber-500',
      '#84CC16': 'bg-lime-500',
      '#06B6D4': 'bg-cyan-500',
      '#8B5CF6': 'bg-violet-500',
      '#F43F5E': 'bg-rose-500',
    };

    // Normalize hex to uppercase
    const normalized = hexColor.toUpperCase();

    for (const [hex, className] of Object.entries(colorMap)) {
      if (normalized === hex.toUpperCase()) {
        return className;
      }
    }

    // Return a default if not found
    return 'bg-blue-500';
  }

  // Normalize date to start of day (midnight) to avoid timezone issues
  function normalizeDate(date: Date): Date {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }

  // Get the workout type for a specific date based on the active schedule
  function getWorkoutForDate(date: Date): WorkoutDayType | null {
    if (schedules.length === 0) return null;

    const activeSchedule = schedules[0]; // Use most recent schedule
    const startDate = normalizeDate(new Date(activeSchedule.start_date));
    const normalizedDate = normalizeDate(date);
    const pattern = activeSchedule.pattern as WorkoutDayType[];

    // Calculate days difference using normalized dates
    const daysDiff = Math.floor((normalizedDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff < 0) return null; // Date is before start date

    const patternIndex = daysDiff % pattern.length;
    return pattern[patternIndex];
  }

  // Get the next 7 days of workouts
  function getUpcomingWorkouts(startDate: Date = new Date()): Array<{ date: Date; type: WorkoutDayType | null }> {
    const workouts = [];
    const normalizedStart = normalizeDate(startDate);
    for (let i = 0; i < 7; i++) {
      const date = new Date(normalizedStart);
      date.setDate(date.getDate() + i);
      workouts.push({
        date,
        type: getWorkoutForDate(date),
      });
    }
    return workouts;
  }

  return {
    schedules,
    loading,
    error,
    userSettings,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    updateWorkoutColors,
    getWorkoutForDate,
    getWorkoutColor,
    getUpcomingWorkouts,
  };
}
