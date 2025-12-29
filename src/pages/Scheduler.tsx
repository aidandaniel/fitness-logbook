import { useState, useEffect, useRef } from 'react';
import { useUser } from '@insforge/react';
import { useSchedules, WORKOUT_DAY_LABELS, DEFAULT_WORKOUT_COLORS, type WorkoutDayType } from '../hooks/useSchedules';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal, ModalActions } from '../components/ui/Modal';
import { Plus, Trash2, Calendar, Palette, Check } from 'lucide-react';
import { format } from 'date-fns';

const PRESET_PATTERNS = {
  'Push/Pull/Legs': ['push', 'pull', 'legs', 'rest'] as WorkoutDayType[],
  'Upper/Lower Split': ['upper', 'lower', 'rest', 'upper', 'lower', 'rest', 'rest'] as WorkoutDayType[],
  'Full Body (3x)': ['full_body', 'rest', 'full_body', 'rest', 'full_body', 'rest', 'rest'] as WorkoutDayType[],
  '6 Day Split': ['push', 'pull', 'legs', 'push', 'pull', 'legs', 'rest'] as WorkoutDayType[],
  'Cardio + Weights': ['push', 'cardio', 'pull', 'cardio', 'legs', 'rest', 'rest'] as WorkoutDayType[],
};

const COLOR_OPTIONS = [
  '#3B82F6', // blue
  '#A855F7', // purple
  '#F97316', // orange
  '#22C55E', // green
  '#6366F1', // indigo
  '#14B8A6', // teal
  '#EF4444', // red
  '#EC4899', // pink
  '#F59E0B', // amber
  '#84CC16', // lime
  '#06B6D4', // cyan
  '#8B5CF6', // violet
  '#F43F5E', // rose
  '#9CA3AF', // gray
];

export function Scheduler() {
  const { user } = useUser();
  const { schedules, loading, createSchedule, deleteSchedule, getUpcomingWorkouts, getWorkoutColor, updateWorkoutColors, userSettings } = useSchedules(user?.id);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [scheduleName, setScheduleName] = useState('');
  const [patternName, setPatternName] = useState('Push/Pull/Legs');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [customPattern, setCustomPattern] = useState<WorkoutDayType[]>(['push', 'pull', 'legs', 'rest']);
  const [useCustomPattern, setUseCustomPattern] = useState(false);
  const [editingColors, setEditingColors] = useState<Record<string, string>>({});
  
  // Scroll detection for mobile header
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only hide header on mobile (below md breakpoint)
      if (window.innerWidth < 768) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down and past 100px
          setIsScrollingDown(true);
        } else if (currentScrollY < lastScrollY) {
          // Scrolling up
          setIsScrollingDown(false);
        }
      } else {
        // Always show on desktop
        setIsScrollingDown(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const activeSchedule = schedules[0];
  const upcomingWorkouts = activeSchedule ? getUpcomingWorkouts() : [];

  // Initialize colors from settings or defaults
  const getSavedColors = () => {
    if (userSettings?.workout_colors) {
      return userSettings.workout_colors as Record<string, string>;
    }
    return DEFAULT_WORKOUT_COLORS;
  };

  const handleCreateSchedule = async () => {
    if (!scheduleName.trim()) return;

    const pattern = useCustomPattern ? customPattern : PRESET_PATTERNS[patternName as keyof typeof PRESET_PATTERNS];

    try {
      await createSchedule({
        name: scheduleName.trim(),
        pattern: pattern as string[],
        start_date: startDate,
      });
      setScheduleName('');
      setStartDate(new Date().toISOString().split('T')[0]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating schedule:', error);
      alert('Failed to create schedule');
    }
  };

  const handleAddDayToPattern = (dayType: WorkoutDayType) => {
    setCustomPattern([...customPattern, dayType]);
  };

  const handleRemoveDayFromPattern = (index: number) => {
    setCustomPattern(customPattern.filter((_, i) => i !== index));
  };

  const openColorModal = () => {
    setEditingColors(getSavedColors());
    setShowColorModal(true);
  };

  const handleColorChange = (dayType: WorkoutDayType, color: string) => {
    setEditingColors(prev => ({ ...prev, [dayType]: color }));
  };

  const handleSaveColors = async () => {
    try {
      await updateWorkoutColors(editingColors);
      setShowColorModal(false);
    } catch (error) {
      console.error('Error saving colors:', error);
      alert('Failed to save colors');
    }
  };

  const handleResetColors = async () => {
    try {
      await updateWorkoutColors(DEFAULT_WORKOUT_COLORS);
      setShowColorModal(false);
    } catch (error) {
      console.error('Error resetting colors:', error);
      alert('Failed to reset colors');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header 
        ref={headerRef}
        className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm transition-transform duration-300 ease-in-out md:translate-y-0 ${
          isScrollingDown ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 md:py-4 lg:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-4">
            <div>
              <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Workout Scheduler</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1 text-xs md:text-sm lg:text-base hidden sm:block">Plan your weekly workout routine</p>
            </div>
            <div className="flex flex-row sm:flex-row gap-1.5 md:gap-2">
              <Button 
                variant="ghost" 
                onClick={openColorModal} 
                className="w-full sm:w-auto text-xs md:text-sm px-2 md:px-4 py-1.5 md:py-2"
                size="sm"
              >
                <Palette className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Edit Colors</span>
                <span className="sm:hidden">Colors</span>
              </Button>
              <Button 
                onClick={() => setShowCreateModal(true)} 
                className="w-full sm:w-auto text-xs md:text-sm px-2 md:px-4 py-1.5 md:py-2"
                size="sm"
              >
                <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">New Schedule</span>
                <span className="sm:hidden">New</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-20 md:pb-8">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : schedules.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No workout schedule</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Create a schedule to plan your workout routine</p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Schedule
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Active Schedule */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{activeSchedule.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Started: {format(new Date(activeSchedule.start_date), 'MMM d, yyyy')}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Delete this schedule?')) {
                      deleteSchedule(activeSchedule.id);
                    }
                  }}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Pattern Display with Colors */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Weekly Pattern</h3>
                <div className="flex flex-wrap gap-2">
                  {(activeSchedule.pattern as WorkoutDayType[]).map((dayType, index) => {
                    const colorInfo = getWorkoutColor(dayType);
                    return (
                      <div
                        key={index}
                        className="px-3 py-2 rounded-lg text-white text-sm font-medium"
                        style={{ backgroundColor: colorInfo.hex }}
                      >
                        {WORKOUT_DAY_LABELS[dayType]}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Upcoming Workouts */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Upcoming Workouts</h3>
                <div className="grid grid-cols-7 gap-2">
                  {upcomingWorkouts.map(({ date, type }, index) => {
                    const colorInfo = type ? getWorkoutColor(type) : null;
                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg text-center ${
                          type
                            ? 'text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}
                        style={{ backgroundColor: type && colorInfo ? colorInfo.hex : undefined }}
                      >
                        <div className="text-xs font-medium mb-1 opacity-90">{format(date, 'EEE')}</div>
                        <div className="text-lg font-bold">{format(date, 'd')}</div>
                        <div className="text-xs mt-1">
                          {type ? WORKOUT_DAY_LABELS[type] : 'Rest'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Past Schedules */}
            {schedules.length > 1 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Past Schedules</h2>
                <div className="space-y-3">
                  {schedules.slice(1).map(schedule => (
                    <div
                      key={schedule.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{schedule.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(schedule.start_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm('Delete this schedule?')) {
                            deleteSchedule(schedule.id);
                          }
                        }}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Create Schedule Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Workout Schedule">
        <div className="p-5 space-y-4">
          <Input
            label="Schedule Name"
            placeholder="e.g., My Push/Pull/Legs Routine"
            value={scheduleName}
            onChange={(e) => setScheduleName(e.target.value)}
            autoFocus
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={useCustomPattern}
                onChange={(e) => setUseCustomPattern(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Use Custom Pattern</span>
            </label>

            {!useCustomPattern ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Pattern
                </label>
                <select
                  value={patternName}
                  onChange={(e) => setPatternName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {Object.keys(PRESET_PATTERNS).map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                <div className="flex flex-wrap gap-2 mt-3">
                  {PRESET_PATTERNS[patternName as keyof typeof PRESET_PATTERNS].map((dayType, index) => {
                    const colorInfo = getWorkoutColor(dayType);
                    return (
                      <div
                        key={index}
                        className="px-3 py-1 rounded text-white text-sm"
                        style={{ backgroundColor: colorInfo.hex }}
                      >
                        {WORKOUT_DAY_LABELS[dayType]}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom Pattern
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {customPattern.map((dayType, index) => {
                    const colorInfo = getWorkoutColor(dayType);
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 rounded text-white text-sm"
                        style={{ backgroundColor: colorInfo.hex }}
                      >
                        <span>{WORKOUT_DAY_LABELS[dayType]}</span>
                        <button
                          onClick={() => handleRemoveDayFromPattern(index)}
                          className="hover:bg-white/20 rounded p-0.5"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">Add Day:</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(WORKOUT_DAY_LABELS).map(([key, label]) => {
                      const colorInfo = getWorkoutColor(key as WorkoutDayType);
                      return (
                        <button
                          key={key}
                          onClick={() => handleAddDayToPattern(key as WorkoutDayType)}
                          className="px-3 py-1 rounded text-white text-sm hover:opacity-80"
                          style={{ backgroundColor: colorInfo.hex }}
                        >
                          + {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <ModalActions>
          <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateSchedule} disabled={!scheduleName.trim()}>
            Create Schedule
          </Button>
        </ModalActions>
      </Modal>

      {/* Color Edit Modal */}
      <Modal isOpen={showColorModal} onClose={() => setShowColorModal(false)} title="Edit Workout Colors">
        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Customize the colors for each workout type. These colors will be used throughout the app.
          </p>

          {Object.entries(WORKOUT_DAY_LABELS).map(([key, label]) => {
            const dayType = key as WorkoutDayType;
            const currentColor = editingColors[dayType] || DEFAULT_WORKOUT_COLORS[dayType];

            return (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                <div className="flex items-center gap-2">
                  {COLOR_OPTIONS.map(color => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(dayType, color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        currentColor === color
                          ? 'border-gray-900 dark:border-white scale-110'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  {/* Custom color picker */}
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => handleColorChange(dayType, e.target.value)}
                    className="w-8 h-8 rounded-full cursor-pointer border-2 border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>
            );
          })}
        </div>
        <ModalActions>
          <Button variant="ghost" onClick={handleResetColors}>
            Reset to Defaults
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setShowColorModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveColors}>
              <Check className="w-4 h-4 mr-2" />
              Save Colors
            </Button>
          </div>
        </ModalActions>
      </Modal>
    </div>
  );
}
