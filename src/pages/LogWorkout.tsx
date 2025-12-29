import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@insforge/react';
import { useWorkouts } from '../hooks/useWorkouts';
import { useLogs } from '../hooks/useLogs';
import { useSettings } from '../hooks/useSettings';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';

interface ExerciseSet {
  set_number: number;
  weight: string;
  reps: string;
}

interface ExerciseWithSets {
  exercise_id: string | null;
  exercise_name: string;
  sets: ExerciseSet[];
}

export function LogWorkout() {
  const { templateId } = useParams<{ templateId: string }>();
  const { user } = useUser();
  const navigate = useNavigate();
  const { workouts } = useWorkouts(user?.id);
  const { createLog, addExerciseLog } = useLogs(user?.id);
  const { settings } = useSettings(user?.id);

  const template = workouts.find(w => w.id === templateId);
  const unit = settings?.weight_unit || 'kg';

  const [exercises, setExercises] = useState<ExerciseWithSets[]>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (template) {
      setExercises(template.exercises.map(ex => ({
        exercise_id: ex.id,
        exercise_name: ex.name,
        sets: [
          {
            set_number: 1,
            weight: ex.default_weight?.toString() || '',
            reps: ex.default_reps?.toString() || '',
          },
        ],
      })));
    }
  }, [template]);

  const addSet = (exerciseIndex: number) => {
    const newExercises = [...exercises];
    const lastSetNumber = newExercises[exerciseIndex].sets.length;
    newExercises[exerciseIndex].sets.push({
      set_number: lastSetNumber + 1,
      weight: newExercises[exerciseIndex].sets[lastSetNumber - 1]?.weight || '',
      reps: newExercises[exerciseIndex].sets[lastSetNumber - 1]?.reps || '',
    });
    setExercises(newExercises);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets.splice(setIndex, 1);
    // Renumber sets
    newExercises[exerciseIndex].sets = newExercises[exerciseIndex].sets.map((set, i) => ({
      ...set,
      set_number: i + 1,
    }));
    setExercises(newExercises);
  };

  const updateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: 'weight' | 'reps',
    value: string
  ) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets[setIndex][field] = value;
    setExercises(newExercises);
  };

  const handleSave = async () => {
    if (!user || !template) return;

    // Validate all sets have values
    for (const exercise of exercises) {
      for (const set of exercise.sets) {
        if (!set.weight || !set.reps) {
          alert('Please fill in all weight and rep values');
          return;
        }
      }
    }

    setLoading(true);

    try {
      // Create workout log
      const workoutLog = await createLog({
        user_id: user.id,
        template_id: template.id,
        date: new Date().toISOString().split('T')[0],
        notes: notes.trim() || null,
      });

      // Add exercise logs
      for (const exercise of exercises) {
        for (const set of exercise.sets) {
          await addExerciseLog({
            workout_log_id: workoutLog.id,
            exercise_id: exercise.exercise_id,
            exercise_name: exercise.exercise_name,
            weight: parseFloat(set.weight),
            reps: parseInt(set.reps),
            set_number: set.set_number,
            order_index: exercises.indexOf(exercise),
          });
        }
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Failed to save workout');
    } finally {
      setLoading(false);
    }
  };

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Workout template not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{template.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-base">Log your workout</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 pb-20 md:pb-8">
        {exercises.map((exercise, exerciseIndex) => (
          <Card key={exercise.exercise_id || exerciseIndex}>
            <CardHeader>
              <h3 className="font-semibold text-xl text-gray-900 dark:text-white">{exercise.exercise_name}</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-2">
                <div className="col-span-1 text-center">Set</div>
                <div className="col-span-5">Weight ({unit})</div>
                <div className="col-span-5">Reps</div>
                <div className="col-span-1"></div>
              </div>
              {exercise.sets.map((set, setIndex) => (
                <div key={set.set_number} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-1 text-center py-2 bg-gray-100 dark:bg-gray-700 rounded-lg font-medium text-gray-600 dark:text-gray-300">
                    {set.set_number}
                  </div>
                  <div className="col-span-5">
                    <Input
                      type="number"
                      placeholder="Weight"
                      value={set.weight}
                      onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', e.target.value)}
                      inputMode="decimal"
                    />
                  </div>
                  <div className="col-span-5">
                    <Input
                      type="number"
                      placeholder="Reps"
                      value={set.reps}
                      onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', e.target.value)}
                      inputMode="numeric"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {exercise.sets.length > 1 && (
                      <button
                        onClick={() => removeSet(exerciseIndex, setIndex)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => addSet(exerciseIndex)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Set
              </Button>
            </CardBody>
          </Card>
        ))}

        {/* Notes */}
        <Card>
          <CardBody>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes (optional)
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={3}
              placeholder="How did the workout feel?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </CardBody>
        </Card>

        {/* Save button */}
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => navigate(-1)} className="flex-1">
            Cancel
          </Button>
          <Button size="lg" className="flex-1" onClick={handleSave} disabled={loading}>
            <Save className="w-5 h-5 mr-2" />
            {loading ? 'Saving...' : 'Save Workout'}
          </Button>
        </div>
      </main>
    </div>
  );
}
