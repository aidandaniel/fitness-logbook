import { useState, useEffect } from 'react';
import { insforge } from '../lib/insforge';
import type { Database } from '../lib/insforge';

type ProgressPhoto = Database['public']['Tables']['progress_photos']['Row'];
type ProgressPhotoInsert = Database['public']['Tables']['progress_photos']['Insert'];

export interface PhotoWithWeek extends ProgressPhoto {
  week_number: number;
  year: number;
}

export function usePhotos(userId: string | undefined) {
  const [photos, setPhotos] = useState<PhotoWithWeek[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setPhotos([]);
      setLoading(false);
      return;
    }

    async function fetchPhotos() {
      try {
        const { data, error: photosError } = await insforge.database
          .from('progress_photos')
          .select('*')
          .eq('user_id', userId)
          .order('week_date', { ascending: false });

        if (photosError) throw photosError;

        const photosWithWeek = (data || []).map(photo => {
          const weekDate = new Date(photo.week_date);
          return {
            ...photo,
            week_number: getWeekNumber(weekDate),
            year: weekDate.getFullYear(),
          };
        });

        setPhotos(photosWithWeek);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchPhotos();
  }, [userId]);

  async function uploadPhoto(file: File, weekDate: Date, notes?: string) {
    if (!userId) throw new Error('User not authenticated');

    // Upload to storage
    const { data: uploadData, error: uploadError } = await insforge.storage
      .from('progress-photos')
      .uploadAuto(file);

    if (uploadError) throw uploadError;

    // Save to database
    const { data, error } = await insforge.database
      .from('progress_photos')
      .insert({
        user_id: userId,
        photo_url: uploadData!.url,
        photo_key: uploadData!.key,
        week_date: weekDate.toISOString().split('T')[0],
        notes: notes || null,
      })
      .select()
      .single();

    if (error) throw error;

    setPhotos(prev => [{
      ...data,
      week_number: getWeekNumber(new Date(data.week_date)),
      year: new Date(data.week_date).getFullYear(),
    }, ...prev]);

    return data;
  }

  async function deletePhoto(id: string, photoKey: string) {
    // Delete from storage
    await insforge.storage
      .from('progress-photos')
      .remove(photoKey);

    // Delete from database
    const { error } = await insforge.database
      .from('progress_photos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setPhotos(prev => prev.filter(p => p.id !== id));
  }

  async function updatePhoto(id: string, updates: Partial<ProgressPhotoInsert>) {
    const { data, error } = await insforge.database
      .from('progress_photos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    setPhotos(prev => prev.map(p =>
      p.id === id
        ? { ...data, week_number: getWeekNumber(new Date(data.week_date)), year: new Date(data.week_date).getFullYear() }
        : p
    ));

    return data;
  }

  return {
    photos,
    loading,
    error,
    uploadPhoto,
    deletePhoto,
    updatePhoto,
  };
}

// Helper to get week number (1-52)
function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// Helper to get the start of the week for a given date
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
