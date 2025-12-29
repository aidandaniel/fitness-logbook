import { useState, useEffect } from 'react';
import { insforge } from '../lib/insforge';
import type { Database } from '../lib/insforge';

type FitnessGoal = Database['public']['Tables']['fitness_goals']['Row'];
type FitnessGoalInsert = Database['public']['Tables']['fitness_goals']['Insert'];

export function useGoals(userId: string | undefined) {
  const [goals, setGoals] = useState<FitnessGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setGoals([]);
      setLoading(false);
      return;
    }

    fetchGoals();
  }, [userId]);

  const fetchGoals = async () => {
    try {
      const { data, error } = await insforge.database
        .from('fitness_goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (goal: Omit<FitnessGoalInsert, 'user_id' | 'achieved' | 'achieved_date'>) => {
    if (!userId) throw new Error('User not authenticated');

    const { data, error } = await insforge.database
      .from('fitness_goals')
      .insert({
        user_id: userId,
        title: goal.title,
        description: goal.description,
        category: goal.category,
        target_value: goal.target_value,
        target_unit: goal.target_unit,
      })
      .select()
      .single();

    if (error) throw error;
    setGoals(prev => [data, ...prev]);
    return data;
  };

  const updateGoal = async (id: string, updates: Partial<FitnessGoal>) => {
    const { data, error } = await insforge.database
      .from('fitness_goals')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    setGoals(prev => prev.map(g => g.id === id ? data : g));
    return data;
  };

  const deleteGoal = async (id: string) => {
    const { error } = await insforge.database
      .from('fitness_goals')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const toggleAchieved = async (id: string, achieved: boolean) => {
    return updateGoal(id, {
      achieved,
      achieved_date: achieved ? new Date().toISOString().split('T')[0] : null,
    });
  };

  return {
    goals,
    loading,
    createGoal,
    updateGoal,
    deleteGoal,
    toggleAchieved,
    refetch: fetchGoals,
  };
}
