import { useState, useEffect } from 'react';
import { insforge } from '../lib/insforge';
import type { Database } from '../lib/insforge';

type UserSettings = Database['public']['Tables']['user_settings']['Row'];
type UserSettingsInsert = Database['public']['Tables']['user_settings']['Insert'];

export function useSettings(userId: string | undefined) {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setSettings(null);
      setLoading(false);
      return;
    }

    async function fetchSettings() {
      try {
        const { data, error: settingsError } = await insforge.database
          .from('user_settings')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (settingsError) throw settingsError;

        // Create default settings if none exist
        if (!data) {
          const { data: newSettings, error: insertError } = await insforge.database
            .from('user_settings')
            .insert([{ user_id: userId, weight_unit: 'kg' }])
            .select()
            .single();

          if (insertError) throw insertError;
          setSettings(newSettings);
        } else {
          setSettings(data);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, [userId]);

  async function updateSettings(updates: Partial<UserSettingsInsert>) {
    if (!userId) throw new Error('User not authenticated');

    const { data, error } = await insforge.database
      .from('user_settings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    setSettings(data);
    return data;
  }

  return {
    settings,
    loading,
    error,
    updateSettings,
  };
}

// Unit conversion utilities
export function convertWeight(weight: number, from: 'kg' | 'lbs', to: 'kg' | 'lbs'): number {
  if (from === to) return weight;

  // lbs to kg: divide by 2.205
  // kg to lbs: multiply by 2.205
  if (from === 'kg' && to === 'lbs') {
    return Math.round(weight * 2.205 * 10) / 10;
  }
  return Math.round(weight / 2.205 * 10) / 10;
}
