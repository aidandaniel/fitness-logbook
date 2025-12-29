import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@insforge/react';
import { useWorkouts } from '../hooks/useWorkouts';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal, ModalActions } from '../components/ui/Modal';
import { Plus, Trash2, Edit, Dumbbell, Play } from 'lucide-react';

export function Templates() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { workouts, loading, createWorkout, deleteWorkout } = useWorkouts(user?.id);

  const [showModal, setShowModal] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [workoutDescription, setWorkoutDescription] = useState('');

  const handleCreate = async () => {
    if (!user || !workoutName.trim()) return;

    try {
      const newWorkout = await createWorkout({
        user_id: user.id,
        name: workoutName.trim(),
        description: workoutDescription.trim() || null,
      });

      setShowModal(false);
      setWorkoutName('');
      setWorkoutDescription('');
      navigate(`/templates/${newWorkout.id}`);
    } catch (error) {
      console.error('Error creating workout:', error);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This will also delete all exercises in this workout.`)) {
      return;
    }

    try {
      await deleteWorkout(id);
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Workout Templates</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm lg:text-base">{workouts.length} template{workouts.length !== 1 ? 's' : ''}</p>
            </div>
            <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-20 md:pb-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : workouts.length === 0 ? (
          <Card>
            <CardBody className="text-center py-16">
              <Dumbbell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No workout templates</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first workout template to get started</p>
              <Button size="lg" onClick={() => setShowModal(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Create Template
              </Button>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workouts.map(workout => (
              <Card key={workout.id} className="hover:shadow-lg transition-shadow">
                <CardBody>
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">{workout.name}</h3>
                      {workout.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{workout.description}</p>
                      )}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                          {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/log/${workout.id}`)}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Start
                      </Button>
                      <button
                        onClick={() => navigate(`/templates/${workout.id}`)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(workout.id, workout.name)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Create modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create Workout Template"
      >
        <div className="p-5 space-y-4">
          <Input
            label="Workout Name"
            placeholder="e.g., Push Day, Leg Day"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            autoFocus
          />
          <Input
            label="Description (optional)"
            placeholder="Notes about this workout"
            value={workoutDescription}
            onChange={(e) => setWorkoutDescription(e.target.value)}
          />
        </div>
        <ModalActions>
          <Button variant="ghost" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!workoutName.trim()}>
            Create
          </Button>
        </ModalActions>
      </Modal>
    </div>
  );
}
