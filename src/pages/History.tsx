import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@insforge/react';
import { useLogs } from '../hooks/useLogs';
import { useSettings } from '../hooks/useSettings';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ArrowLeft, Edit, Calendar, Trash2, Plus, Save } from 'lucide-react';
import { format } from 'date-fns';

interface ExerciseSet {
  id: string | null;
  set_number: number;
  weight: number;
  reps: number;
}

interface ExerciseWithSets {
  id: string;
  exercise_id: string | null;
  exercise_name: string;
  sets: ExerciseSet[];
}

export function History() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { logs, loading, updateLog, deleteLog, updateExerciseLog, deleteExerciseLog } = useLogs(user?.id);
  const { settings } = useSettings(user?.id);

  const [selectedLogId, setSelectedLogId] = useState<string | null>(searchParams.get('log'));
  const [viewMode, setViewMode] = useState<'view' | 'edit'>('view');
  const [editingExercises, setEditingExercises] = useState<ExerciseWithSets[]>([]);
  const [editingNotes, setEditingNotes] = useState('');

  const unit = settings?.weight_unit || 'kg';

  const selectedLog = logs.find((l: typeof logs[0]) => l.id === selectedLogId);

  useEffect(() => {
    const logId = searchParams.get('log');
    if (logId) {
      setSelectedLogId(logId);
      setViewMode('view');
    }
  }, [searchParams]);

  const handleEdit = () => {
    if (!selectedLog) return;

    // Group exercise logs by exercise name
    const grouped: { [key: string]: ExerciseWithSets } = {};

    selectedLog.exercise_logs.forEach((log: typeof selectedLog.exercise_logs[0]) => {
      if (!grouped[log.exercise_name]) {
        grouped[log.exercise_name] = {
          id: crypto.randomUUID(),
          exercise_id: log.exercise_id,
          exercise_name: log.exercise_name,
          sets: [],
        };
      }
      grouped[log.exercise_name].sets.push({
        id: log.id,
        set_number: log.set_number,
        weight: log.weight,
        reps: log.reps,
      });
    });

    // Convert to array and sort sets within each exercise
    const exercisesArray = Object.values(grouped).map(ex => ({
      ...ex,
      sets: ex.sets.sort((a, b) => a.set_number - b.set_number),
    }));

    setEditingExercises(exercisesArray);
    setEditingNotes(selectedLog.notes || '');
    setViewMode('edit');
  };

  const handleSave = async () => {
    if (!selectedLog) return;

    // Validate
    for (const exercise of editingExercises) {
      for (const set of exercise.sets) {
        if (!set.weight || !set.reps || set.weight <= 0 || set.reps <= 0) {
          alert('Please enter valid weight and reps for all sets');
          return;
        }
      }
    }

    try {
      // Update notes
      await updateLog(selectedLog.id, {
        notes: editingNotes.trim() || null,
      });

      // Delete existing exercise logs
      for (const log of selectedLog.exercise_logs) {
        await deleteExerciseLog(log.id);
      }

      // Add updated exercise logs
      for (const exercise of editingExercises) {
        for (const set of exercise.sets) {
          await updateExerciseLog(set.id || '', {
            workout_log_id: selectedLog.id,
            exercise_id: exercise.exercise_id,
            exercise_name: exercise.exercise_name,
            weight: set.weight,
            reps: set.reps,
            set_number: set.set_number,
            order_index: editingExercises.indexOf(exercise),
          });
        }
      }

      setViewMode('view');
      // Force refresh
      window.location.reload();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save changes');
    }
  };

  const handleDeleteWorkout = async () => {
    if (!selectedLog || !confirm('Delete this workout log? This cannot be undone.')) {
      return;
    }

    try {
      await deleteLog(selectedLog.id);
      navigate('/history');
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete workout');
    }
  };

  const addSet = (exerciseIndex: number) => {
    const newExercises = [...editingExercises];
    const lastSetNumber = newExercises[exerciseIndex].sets.length;
    newExercises[exerciseIndex].sets.push({
      id: null,
      set_number: lastSetNumber + 1,
      weight: newExercises[exerciseIndex].sets[lastSetNumber - 1]?.weight || 0,
      reps: newExercises[exerciseIndex].sets[lastSetNumber - 1]?.reps || 0,
    });
    setEditingExercises(newExercises);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const newExercises = [...editingExercises];
    const setToRemove = newExercises[exerciseIndex].sets[setIndex];

    // Delete from database if it exists
    if (setToRemove.id) {
      deleteExerciseLog(setToRemove.id);
    }

    newExercises[exerciseIndex].sets.splice(setIndex, 1);
    // Renumber sets
    newExercises[exerciseIndex].sets = newExercises[exerciseIndex].sets.map((set, i) => ({
      ...set,
      set_number: i + 1,
    }));
    setEditingExercises(newExercises);
  };

  const updateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: 'weight' | 'reps',
    value: number
  ) => {
    const newExercises = [...editingExercises];
    newExercises[exerciseIndex].sets[setIndex][field] = value;
    setEditingExercises(newExercises);
  };

  // Group exercises by name for view mode
  const groupedExercises = selectedLog ? selectedLog.exercise_logs.reduce((acc: Record<string, typeof selectedLog.exercise_logs>, log: typeof selectedLog.exercise_logs[0]) => {
    if (!acc[log.exercise_name]) {
      acc[log.exercise_name] = [];
    }
    acc[log.exercise_name].push(log);
    return acc;
  }, {} as Record<string, typeof selectedLog.exercise_logs>) : {};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 flex items-center gap-3">
          {selectedLog && (
            <button
              onClick={() => {
                setSelectedLogId(null);
                setSearchParams({});
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex-1">
            {selectedLog ? 'Workout Details' : 'Workout History'}
          </h1>
          {selectedLog && viewMode === 'view' && (
            <Button size="sm" variant="ghost" onClick={handleEdit}>
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-20 md:pb-8">
        {selectedLog ? (
          <>
            {viewMode === 'view' ? (
              // View Mode
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {selectedLog.template_name || 'Custom Workout'}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-2">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(selectedLog.date), 'MMMM d, yyyy')}
                        </p>
                      </div>
                      <button
                        onClick={handleDeleteWorkout}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete workout"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </CardHeader>
                  {selectedLog.notes && (
                    <CardBody>
                      <p className="text-gray-600 dark:text-gray-400">{selectedLog.notes}</p>
                    </CardBody>
                  )}
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(groupedExercises).map(([name, sets]) => (
                    <Card key={name}>
                      <CardHeader>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{name}</h3>
                      </CardHeader>
                      <CardBody>
                        <div className="space-y-2">
                          {sets.slice().sort((a: typeof sets[0], b: typeof sets[0]) => a.set_number - b.set_number).map((set) => (
                            <div key={set.id} className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                              <span className="w-12 text-center text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded py-1">Set {set.set_number}</span>
                              <span className="flex-1 text-center font-semibold text-gray-900 dark:text-white">{set.weight} {unit}</span>
                              <span className="flex-1 text-center font-semibold text-gray-900 dark:text-white">{set.reps} reps</span>
                            </div>
                          ))}
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>

                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  onClick={handleEdit}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Workout
                </Button>
              </div>
            ) : (
              // Edit Mode
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Workout</h2>
                    <p className="text-gray-500 dark:text-gray-400">{format(new Date(selectedLog.date), 'MMMM d, yyyy')}</p>
                  </CardHeader>
                  <CardBody>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notes
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={2}
                      placeholder="Workout notes"
                      value={editingNotes}
                      onChange={(e) => setEditingNotes(e.target.value)}
                    />
                  </CardBody>
                </Card>

                {editingExercises.map((exercise, exerciseIndex) => (
                  <Card key={exercise.id}>
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
                        <div key={set.id || set.set_number} className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-1 text-center py-2 bg-gray-100 dark:bg-gray-700 rounded-lg font-medium text-gray-600 dark:text-gray-300">
                            {set.set_number}
                          </div>
                          <div className="col-span-5">
                            <Input
                              type="number"
                              value={set.weight}
                              onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', parseFloat(e.target.value) || 0)}
                              inputMode="decimal"
                            />
                          </div>
                          <div className="col-span-5">
                            <Input
                              type="number"
                              value={set.reps}
                              onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
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

                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="flex-1"
                    onClick={() => setViewMode('view')}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleSave}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          // List all workouts
          <div>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : logs.length === 0 ? (
              <Card>
                <CardBody className="text-center py-16">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No workout history</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">Your logged workouts will appear here</p>
                  <Button onClick={() => navigate('/templates')}>
                    Log Workout
                  </Button>
                </CardBody>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {logs.map((log: typeof logs[0]) => (
                  <Card
                    key={log.id}
                    onClick={() => {
                      setSelectedLogId(log.id);
                      setSearchParams({ log: log.id });
                      setViewMode('view');
                    }}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <CardBody>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{log.template_name || 'Custom Workout'}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(log.date), 'MMM d, yyyy')}
                            </span>
                            <span>{log.exercise_logs.length} exercises</span>
                          </div>
                        </div>
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
