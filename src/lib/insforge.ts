import { createClient } from '@insforge/sdk';

const baseUrl = import.meta.env.VITE_INSFORGE_BASE_URL;
const anonKey = import.meta.env.VITE_INSFORGE_ANON_KEY;

if (!baseUrl) {
  throw new Error('VITE_INSFORGE_BASE_URL is not defined');
}

if (!anonKey) {
  throw new Error('VITE_INSFORGE_ANON_KEY is not defined');
}

export const insforge = createClient({
  baseUrl,
  anonKey,
});

export type Database = {
  public: {
    Tables: {
      workout_templates: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          updated_at?: string;
        };
      };
      exercises: {
        Row: {
          id: string;
          template_id: string;
          name: string;
          default_weight: number | null;
          default_reps: number | null;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          template_id: string;
          name: string;
          default_weight?: number | null;
          default_reps?: number | null;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          default_weight?: number | null;
          default_reps?: number | null;
          order_index?: number;
        };
      };
      workout_logs: {
        Row: {
          id: string;
          user_id: string;
          template_id: string | null;
          date: string;
          notes: string | null;
          duration_minutes: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          template_id?: string | null;
          date: string;
          notes?: string | null;
          duration_minutes?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          template_id?: string | null;
          date?: string;
          notes?: string | null;
          duration_minutes?: number | null;
          updated_at?: string;
        };
      };
      exercise_logs: {
        Row: {
          id: string;
          workout_log_id: string;
          exercise_id: string | null;
          exercise_name: string;
          weight: number;
          reps: number;
          set_number: number;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workout_log_id: string;
          exercise_id?: string | null;
          exercise_name: string;
          weight: number;
          reps: number;
          set_number: number;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          exercise_id?: string | null;
          exercise_name?: string;
          weight?: number;
          reps?: number;
          set_number?: number;
          order_index?: number;
          updated_at?: string;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          weight_unit: 'kg' | 'lbs';
          workout_colors: Record<string, string> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          weight_unit?: 'kg' | 'lbs';
          workout_colors?: Record<string, string> | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          weight_unit?: 'kg' | 'lbs';
          workout_colors?: Record<string, string> | null;
          updated_at?: string;
        };
      };
      progress_photos: {
        Row: {
          id: string;
          user_id: string;
          photo_url: string;
          photo_key: string;
          week_date: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          photo_url: string;
          photo_key: string;
          week_date: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          photo_url?: string;
          photo_key?: string;
          week_date?: string;
          notes?: string | null;
        };
      };
      fitness_goals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          category: string | null;
          target_value: number | null;
          target_unit: string | null;
          achieved: boolean;
          achieved_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          category?: string | null;
          target_value?: number | null;
          target_unit?: string | null;
          achieved?: boolean;
          achieved_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          category?: string | null;
          target_value?: number | null;
          target_unit?: string | null;
          achieved?: boolean;
          achieved_date?: string | null;
          updated_at?: string;
        };
      };
      personal_records: {
        Row: {
          id: string;
          user_id: string;
          exercise_name: string;
          weight: number;
          unit: string;
          reps: number;
          date: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exercise_name: string;
          weight: number;
          unit?: string;
          reps?: number;
          date: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          exercise_name?: string;
          weight?: number;
          unit?: string;
          reps?: number;
          date?: string;
          notes?: string | null;
          updated_at?: string;
        };
      };
      workout_schedules: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          pattern: string[];
          start_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          pattern: string[];
          start_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          pattern?: string[];
          start_date?: string;
          updated_at?: string;
        };
      };
    };
  };
};
