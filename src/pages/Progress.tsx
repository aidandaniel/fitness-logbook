import { useState, useRef } from 'react';
import { useUser } from '@insforge/react';
import { usePhotos, getWeekStart } from '../hooks/usePhotos';
import { useGoals } from '../hooks/useGoals';
import { usePRs } from '../hooks/usePRs';
import { useSettings } from '../hooks/useSettings';
import { useLogs } from '../hooks/useLogs';
import { WorkoutChart } from '../components/ui/WorkoutChart';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal, ModalActions } from '../components/ui/Modal';
import { Plus, Camera, Target, Trophy, Check, X } from 'lucide-react';
import { format } from 'date-fns';

export function Progress() {
  const { user } = useUser();
  const { photos, loading: photosLoading, uploadPhoto, deletePhoto } = usePhotos(user?.id);
  const { goals, loading: goalsLoading, createGoal, deleteGoal, toggleAchieved } = useGoals(user?.id);
  const { loading: prsLoading, createPR, deletePR, getTopPRs } = usePRs(user?.id);
  const { settings } = useSettings(user?.id);
  const { logs } = useLogs(user?.id);

  const [showUpload, setShowUpload] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddPR, setShowAddPR] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<string>(getWeekStart(new Date()).toISOString().split('T')[0]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Goal form state
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [goalCategory, setGoalCategory] = useState('strength');
  const [goalTargetValue, setGoalTargetValue] = useState('');

  // PR form state
  const [prExerciseName, setPrExerciseName] = useState('');
  const [prWeight, setPrWeight] = useState('');
  const [prReps, setPrReps] = useState('1');
  const [prDate, setPrDate] = useState(new Date().toISOString().split('T')[0]);
  const [prNotes, setPrNotes] = useState('');

  const unit = settings?.weight_unit || 'lbs';

  // Group photos by week
  const photosByWeek: Record<string, typeof photos> = {};
  photos.forEach(photo => {
    if (!photosByWeek[photo.week_date]) {
      photosByWeek[photo.week_date] = [];
    }
    photosByWeek[photo.week_date].push(photo);
  });

  const sortedWeeks = Object.keys(photosByWeek).sort((a, b) => b.localeCompare(a));
  const topPRs = getTopPRs();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    try {
      await uploadPhoto(file, new Date(selectedWeek), undefined);
      setShowUpload(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (id: string, key: string) => {
    if (!confirm('Delete this photo?')) return;
    try {
      await deletePhoto(id, key);
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Failed to delete photo');
    }
  };

  const handleAddGoal = async () => {
    if (!goalTitle.trim()) return;

    try {
      await createGoal({
        title: goalTitle.trim(),
        description: goalDescription.trim() || null,
        category: goalCategory,
        target_value: goalTargetValue ? parseFloat(goalTargetValue) : null,
        target_unit: unit,
      });
      setGoalTitle('');
      setGoalDescription('');
      setGoalTargetValue('');
      setShowAddGoal(false);
    } catch (error) {
      console.error('Error adding goal:', error);
      alert('Failed to add goal');
    }
  };

  const handleAddPR = async () => {
    if (!prExerciseName.trim() || !prWeight) return;

    try {
      await createPR({
        exercise_name: prExerciseName.trim(),
        weight: parseFloat(prWeight),
        unit: unit,
        reps: parseInt(prReps) || 1,
        date: prDate,
        notes: prNotes.trim() || null,
      });
      setPrExerciseName('');
      setPrWeight('');
      setPrReps('1');
      setPrNotes('');
      setShowAddPR(false);
    } catch (error) {
      console.error('Error adding PR:', error);
      alert('Failed to add PR');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Progress Tracking</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm lg:text-base">Photos, goals, and personal records</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-20 md:pb-8">
        {/* Workout Chart - Full Width */}
        <div className="mb-6">
          <WorkoutChart logs={logs} days={30} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Photos - Left Column */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Progress Photos
                </h2>
                <Button size="sm" onClick={() => setShowUpload(true)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {photosLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : sortedWeeks.length === 0 ? (
                <div className="text-center py-8">
                  <Camera className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No photos yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedWeeks.slice(0, 3).map(week => {
                    const weekPhotos = photosByWeek[week];
                    const weekDate = new Date(week);
                    const weekStart = getWeekStart(weekDate);

                    return (
                      <div key={week}>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          {format(weekStart, 'MMM d')}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {weekPhotos.slice(0, 4).map(photo => (
                            <div key={photo.id} className="relative aspect-[3/4] bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden group">
                              <img
                                src={photo.photo_url}
                                alt="Progress"
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={() => handleDeletePhoto(photo.id, photo.photo_key)}
                                className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Goals - Middle Column */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Goals
                </h2>
                <Button size="sm" onClick={() => setShowAddGoal(true)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {goalsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : goals.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No goals yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {goals.map(goal => (
                    <div
                      key={goal.id}
                      className={`p-3 rounded-lg border transition-all ${
                        goal.achieved
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <button
                          onClick={() => toggleAchieved(goal.id, !goal.achieved)}
                          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            goal.achieved
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300 dark:border-gray-500 hover:border-green-500'
                          }`}
                        >
                          {goal.achieved && <Check className="w-3 h-3 text-white" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm ${goal.achieved ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                            {goal.title}
                          </p>
                          {goal.target_value && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Target: {goal.target_value} {goal.target_unit}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* PR Checklist - Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Personal Records
                </h2>
                <Button size="sm" onClick={() => setShowAddPR(true)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {prsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : topPRs.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No PRs yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {topPRs.map(({ exercise, topPR }) => (
                    <div
                      key={topPR.id}
                      className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm text-gray-900 dark:text-white">{exercise}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {format(new Date(topPR.date), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                            {topPR.weight} {topPR.unit}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {topPR.reps} {topPR.reps === 1 ? 'rep' : 'reps'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => deletePR(topPR.id)}
                        className="mt-2 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Upload Photo Modal */}
      <Modal isOpen={showUpload} onClose={() => setShowUpload(false)} title="Add Progress Photo">
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Week Starting
            </label>
            <input
              type="date"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <ModalActions>
          <Button variant="ghost" onClick={() => setShowUpload(false)} disabled={uploading}>
            Cancel
          </Button>
        </ModalActions>
      </Modal>

      {/* Add Goal Modal */}
      <Modal isOpen={showAddGoal} onClose={() => setShowAddGoal(false)} title="Add Goal">
        <div className="p-5 space-y-4">
          <Input
            label="Goal Title"
            placeholder="e.g., Bench 135 lbs"
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
            autoFocus
          />
          <Input
            label="Description (optional)"
            placeholder="What do you want to achieve?"
            value={goalDescription}
            onChange={(e) => setGoalDescription(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label={`Target Value (${unit})`}
              type="number"
              placeholder="e.g., 135"
              value={goalTargetValue}
              onChange={(e) => setGoalTargetValue(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={goalCategory}
                onChange={(e) => setGoalCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="strength">Strength</option>
                <option value="cardio">Cardio</option>
                <option value="flexibility">Flexibility</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
        <ModalActions>
          <Button variant="ghost" onClick={() => setShowAddGoal(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddGoal} disabled={!goalTitle.trim()}>
            Add Goal
          </Button>
        </ModalActions>
      </Modal>

      {/* Add PR Modal */}
      <Modal isOpen={showAddPR} onClose={() => setShowAddPR(false)} title="Add Personal Record">
        <div className="p-5 space-y-4">
          <Input
            label="Exercise Name"
            placeholder="e.g., Bench Press"
            value={prExerciseName}
            onChange={(e) => setPrExerciseName(e.target.value)}
            autoFocus
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label={`Weight (${unit})`}
              type="number"
              placeholder="e.g., 135"
              value={prWeight}
              onChange={(e) => setPrWeight(e.target.value)}
            />
            <Input
              label="Reps"
              type="number"
              placeholder="1"
              value={prReps}
              onChange={(e) => setPrReps(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date Achieved
            </label>
            <input
              type="date"
              value={prDate}
              onChange={(e) => setPrDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <Input
            label="Notes (optional)"
            placeholder="Any details about this PR"
            value={prNotes}
            onChange={(e) => setPrNotes(e.target.value)}
          />
        </div>
        <ModalActions>
          <Button variant="ghost" onClick={() => setShowAddPR(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddPR} disabled={!prExerciseName.trim() || !prWeight}>
            Add PR
          </Button>
        </ModalActions>
      </Modal>
    </div>
  );
}
