import { useState, useEffect } from 'react';
import { insforge } from '../lib/insforge';
import type { Database } from '../lib/insforge';

// Format date to YYYY-MM-DD in local timezone (not UTC)
function formatDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

type WorkoutLog = Database['public']['Tables']['workout_logs']['Row'];
type WorkoutLogInsert = Database['public']['Tables']['workout_logs']['Insert'];
type ExerciseLog = Database['public']['Tables']['exercise_logs']['Row'];
type ExerciseLogInsert = Database['public']['Tables']['exercise_logs']['Insert'];

export interface WorkoutLogWithExercises extends WorkoutLog {
  exercise_logs: ExerciseLog[];
  template_name?: string;
}

export function useLogs(userId: string | undefined, startDate?: Date, endDate?: Date) {
  const [logs, setLogs] = useState<WorkoutLogWithExercises[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLogs([]);
      setLoading(false);
      return;
    }

    async function fetchLogs() {
      try {
        let query = insforge.database
          .from('workout_logs')
          .select('*, workout_templates(name)')
          .eq('user_id', userId);

        if (startDate) {
          query = query.gte('date', formatDateLocal(startDate));
        }
        if (endDate) {
          query = query.lte('date', formatDateLocal(endDate));
        }

        const { data: logsData, error: logsError } = await query.order('date', { ascending: false });

        if (logsError) throw logsError;

        const logsWithExercises: WorkoutLogWithExercises[] = [];

        for (const log of logsData || []) {
          const { data: exerciseLogs } = await insforge.database
            .from('exercise_logs')
            .select('*')
            .eq('workout_log_id', log.id)
            .order('order_index', { ascending: true });

          logsWithExercises.push({
            ...log,
            exercise_logs: exerciseLogs || [],
            template_name: (log as any).workout_templates?.name,
          });
        }

        setLogs(logsWithExercises);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, [userId, startDate, endDate]);

  async function createLog(log: WorkoutLogInsert) {
    const { data, error } = await insforge.database
      .from('workout_logs')
      .insert(log)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async function updateLog(id: string, updates: Partial<WorkoutLogInsert>) {
    const { data, error } = await insforge.database
      .from('workout_logs')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async function deleteLog(id: string) {
    const { error } = await insforge.database
      .from('workout_logs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async function addExerciseLog(exerciseLog: ExerciseLogInsert) {
    const { data, error } = await insforge.database
      .from('exercise_logs')
      .insert(exerciseLog)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async function updateExerciseLog(id: string, updates: Partial<ExerciseLogInsert>) {
    const { data, error } = await insforge.database
      .from('exercise_logs')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async function deleteExerciseLog(id: string) {
    const { error } = await insforge.database
      .from('exercise_logs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async function getPreviousLog(templateId: string | null, exerciseName: string, currentDate: string) {
    if (!userId) return null;

    const { data } = await insforge.database
      .from('workout_logs')
      .select('id, date')
      .eq('user_id', userId)
      .eq('template_id', templateId)
      .lt('date', currentDate)
      .order('date', { ascending: false })
      .limit(1)
      .single();

    if (!data) return null;

    const { data: exerciseLogs } = await insforge.database
      .from('exercise_logs')
      .select('*')
      .eq('workout_log_id', data.id)
      .eq('exercise_name', exerciseName)
      .order('set_number', { ascending: true });

    return { ...data, exercise_logs: exerciseLogs || [] };
  }

  return {
    logs,
    loading,
    error,
    createLog,
    updateLog,
    deleteLog,
    addExerciseLog,
    updateExerciseLog,
    deleteExerciseLog,
    getPreviousLog,
    refresh: () => {
      setLoading(true);
      setError(null);
    },
  };
}
