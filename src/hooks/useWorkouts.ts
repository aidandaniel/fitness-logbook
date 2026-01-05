import { useState, useEffect } from 'react';
import { insforge } from '../lib/insforge';
import type { Database } from '../lib/insforge';

type WorkoutTemplate = Database['public']['Tables']['workout_templates']['Row'];
type WorkoutTemplateInsert = Database['public']['Tables']['workout_templates']['Insert'];
type Exercise = Database['public']['Tables']['exercises']['Row'];
type ExerciseInsert = Database['public']['Tables']['exercises']['Insert'];

export interface WorkoutWithExercises extends WorkoutTemplate {
  exercises: Exercise[];
}

export function useWorkouts(userId: string | undefined) {
  const [workouts, setWorkouts] = useState<WorkoutWithExercises[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setWorkouts([]);
      setLoading(false);
      return;
    }

    async function fetchWorkouts() {
      try {
        const { data: templates, error: templatesError } = await insforge.database
          .from('workout_templates')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (templatesError) throw templatesError;

        const workoutsWithExercises: WorkoutWithExercises[] = [];

        for (const template of templates || []) {
          const { data: exercises } = await insforge.database
            .from('exercises')
            .select('*')
            .eq('template_id', template.id)
            .order('order_index', { ascending: true });

          workoutsWithExercises.push({
            ...template,
            exercises: exercises || [],
          });
        }

        setWorkouts(workoutsWithExercises);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkouts();
  }, [userId]);

  async function createWorkout(workout: WorkoutTemplateInsert) {
    console.log('🔵 createWorkout called with:', workout);
    console.log('🔵 insforge client:', { 
      hasDatabase: !!insforge.database,
      hasStorage: !!insforge.storage
    });
    
    try {
      console.log('📡 Making database insert request...');
      const { data, error } = await insforge.database
        .from('workout_templates')
        .insert(workout)
        .select()
        .single();

      console.log('📥 Database response:', { data, error });

      if (error) {
        console.error('❌ Database insert error:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      
      console.log('✅ Workout created:', data);
      
      // Fetch exercises for the new workout
      const { data: exercises } = await insforge.database
        .from('exercises')
        .select('*')
        .eq('template_id', data.id)
        .order('order_index', { ascending: true });
      
      // Add to local state
      setWorkouts(prev => [{
        ...data,
        exercises: exercises || [],
      }, ...prev]);
      
      return data;
    } catch (err) {
      console.error('❌ createWorkout error:', err);
      console.error('Error type:', err?.constructor?.name);
      console.error('Error stack:', err instanceof Error ? err.stack : 'No stack');
      throw err;
    }
  }

  async function updateWorkout(id: string, updates: Partial<WorkoutTemplateInsert>) {
    const { data, error } = await insforge.database
      .from('workout_templates')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async function deleteWorkout(id: string) {
    const { error } = await insforge.database
      .from('workout_templates')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    // Remove from local state
    setWorkouts(prev => prev.filter(w => w.id !== id));
  }

  async function addExercise(exercise: ExerciseInsert) {
    const { data, error } = await insforge.database
      .from('exercises')
      .insert(exercise)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async function updateExercise(id: string, updates: Partial<ExerciseInsert>) {
    const { data, error } = await insforge.database
      .from('exercises')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async function deleteExercise(id: string) {
    const { error } = await insforge.database
      .from('exercises')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  return {
    workouts,
    loading,
    error,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    addExercise,
    updateExercise,
    deleteExercise,
    refresh: () => {
      setLoading(true);
      setError(null);
    },
  };
}
