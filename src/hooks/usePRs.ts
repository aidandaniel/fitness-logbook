import { useState, useEffect } from 'react';
import { insforge } from '../lib/insforge';
import type { Database } from '../lib/insforge';

type PersonalRecord = Database['public']['Tables']['personal_records']['Row'];
type PersonalRecordInsert = Database['public']['Tables']['personal_records']['Insert'];

export function usePRs(userId: string | undefined) {
  const [prs, setPrs] = useState<PersonalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setPrs([]);
      setLoading(false);
      return;
    }

    fetchPRs();
  }, [userId]);

  const fetchPRs = async () => {
    try {
      const { data, error } = await insforge.database
        .from('personal_records')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;
      setPrs(data || []);
    } catch (error) {
      console.error('Error fetching PRs:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPR = async (pr: Omit<PersonalRecordInsert, 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!userId) throw new Error('User not authenticated');

    const { data, error } = await insforge.database
      .from('personal_records')
      .insert({
        user_id: userId,
        exercise_name: pr.exercise_name,
        weight: pr.weight,
        unit: pr.unit,
        reps: pr.reps || 1,
        date: pr.date,
        notes: pr.notes,
      })
      .select()
      .single();

    if (error) throw error;
    setPrs(prev => [data, ...prev]);
    return data;
  };

  const updatePR = async (id: string, updates: Partial<PersonalRecord>) => {
    const { data, error } = await insforge.database
      .from('personal_records')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    setPrs(prev => prev.map(p => p.id === id ? data : p));
    return data;
  };

  const deletePR = async (id: string) => {
    const { error } = await insforge.database
      .from('personal_records')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setPrs(prev => prev.filter(p => p.id !== id));
  };

  // Get PRs grouped by exercise name
  const getPrsByExercise = () => {
    const grouped: Record<string, PersonalRecord[]> = {};
    prs.forEach(pr => {
      if (!grouped[pr.exercise_name]) {
        grouped[pr.exercise_name] = [];
      }
      grouped[pr.exercise_name].push(pr);
    });
    // Sort each group by weight descending
    Object.keys(grouped).forEach(exercise => {
      grouped[exercise].sort((a, b) => b.weight - a.weight);
    });
    return grouped;
  };

  // Get the highest PR for each exercise
  const getTopPRs = () => {
    const grouped = getPrsByExercise();
    return Object.entries(grouped).map(([exercise, records]) => ({
      exercise,
      topPR: records[0], // Already sorted by weight descending
    }));
  };

  return {
    prs,
    loading,
    createPR,
    updatePR,
    deletePR,
    getPrsByExercise,
    getTopPRs,
    refetch: fetchPRs,
  };
}
