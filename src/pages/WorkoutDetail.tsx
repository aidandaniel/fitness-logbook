import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@insforge/react';
import { useWorkouts } from '../hooks/useWorkouts';
import { useSettings } from '../hooks/useSettings';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal, ModalActions } from '../components/ui/Modal';
import { Plus, Trash2, ArrowLeft, GripVertical } from 'lucide-react';

export function WorkoutDetail() {
  const { templateId } = useParams<{ templateId: string }>();
  const { user } = useUser();
  const navigate = useNavigate();
  const { workouts, loading, addExercise, deleteExercise, updateExercise } = useWorkouts(user?.id);
  const { settings } = useSettings(user?.id);

  const template = workouts.find(w => w.id === templateId);
  const unit = settings?.weight_unit || 'kg';

  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newWeight, setNewWeight] = useState('');
  const [newReps, setNewReps] = useState('');

  const handleAddExercise = async () => {
    if (!template || !newExerciseName.trim()) return;

    try {
      await addExercise({
        template_id: template.id,
        name: newExerciseName.trim(),
        default_weight: newWeight ? parseFloat(newWeight) : null,
        default_reps: newReps ? parseInt(newReps) : null,
        order_index: template.exercises.length,
      });

      setNewExerciseName('');
      setNewWeight('');
      setNewReps('');
      setShowAddExercise(false);
    } catch (error) {
      console.error('Error adding exercise:', error);
    }
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    if (!confirm('Remove this exercise from the template?')) return;

    try {
      await deleteExercise(exerciseId);
    } catch (error) {
      console.error('Error deleting exercise:', error);
    }
  };

  const handleUpdateExercise = async (exerciseId: string, updates: { name?: string; default_weight?: number | null; default_reps?: number | null }) => {
    try {
      await updateExercise(exerciseId, updates);
    } catch (error) {
      console.error('Error updating exercise:', error);
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 flex items-center gap-3">
          <button
            onClick={() => navigate('/templates')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{template.name}</h1>
            {template.description && (
              <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-base">{template.description}</p>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-20 md:pb-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : template.exercises.length === 0 ? (
          <Card>
            <CardBody className="text-center py-16">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No exercises yet</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Add exercises to this workout template</p>
              <Button size="lg" onClick={() => setShowAddExercise(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Add Exercise
              </Button>
            </CardBody>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {template.exercises.map((exercise) => (
                <Card key={exercise.id}>
                  <CardBody>
                    <div className="flex items-start gap-4">
                      <GripVertical className="w-5 h-5 text-gray-400 mt-2" />
                      <div className="flex-1 space-y-3">
                        <Input
                          value={exercise.name}
                          onChange={(e) => handleUpdateExercise(exercise.id, { name: e.target.value })}
                          placeholder="Exercise name"
                          className="text-lg"
                        />
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Default Weight ({unit})
                            </label>
                            <Input
                              type="number"
                              placeholder="Weight"
                              value={exercise.default_weight || ''}
                              onChange={(e) => handleUpdateExercise(exercise.id, {
                                default_weight: e.target.value ? parseFloat(e.target.value) : null
                              })}
                              inputMode="decimal"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Default Reps
                            </label>
                            <Input
                              type="number"
                              placeholder="Reps"
                              value={exercise.default_reps || ''}
                              onChange={(e) => handleUpdateExercise(exercise.id, {
                                default_reps: e.target.value ? parseInt(e.target.value) : null
                              })}
                              inputMode="numeric"
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteExercise(exercise.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors mt-8"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            <Button
              variant="secondary"
              size="lg"
              className="w-full mt-6"
              onClick={() => setShowAddExercise(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Exercise
            </Button>
          </>
        )}
      </main>

      {/* Add exercise modal */}
      <Modal
        isOpen={showAddExercise}
        onClose={() => setShowAddExercise(false)}
        title="Add Exercise"
      >
        <div className="p-5 space-y-4">
          <Input
            label="Exercise Name"
            placeholder="e.g., Bench Press"
            value={newExerciseName}
            onChange={(e) => setNewExerciseName(e.target.value)}
            autoFocus
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label={`Default Weight (${unit})`}
              type="number"
              placeholder="e.g., 100"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              inputMode="decimal"
            />
            <Input
              label="Default Reps"
              type="number"
              placeholder="e.g., 10"
              value={newReps}
              onChange={(e) => setNewReps(e.target.value)}
              inputMode="numeric"
            />
          </div>
        </div>
        <ModalActions>
          <Button variant="ghost" onClick={() => setShowAddExercise(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddExercise} disabled={!newExerciseName.trim()}>
            Add
          </Button>
        </ModalActions>
      </Modal>
    </div>
  );
}
