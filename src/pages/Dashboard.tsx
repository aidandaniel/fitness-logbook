import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@insforge/react';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useLogs } from '../hooks/useLogs';
import { useSchedules, WORKOUT_DAY_LABELS, type WorkoutDayType } from '../hooks/useSchedules';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';
import { Plus, Dumbbell, Trophy, Target, Zap, ChevronLeft, ChevronRight, CalendarClock } from 'lucide-react';

// Format date to YYYY-MM-DD in local timezone (not UTC)
function formatDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarMonth, setCalendarMonth] = useState(startOfMonth(selectedDate));

  const { logs, loading } = useLogs(user?.id);
  const { schedules, getWorkoutForDate, getWorkoutColor, getUpcomingWorkouts } = useSchedules(user?.id);

  const workoutDates = logs.map(log => log.date);
  const activeSchedule = schedules[0];

  // Normalize selectedDate to start of day for accurate comparison
  const normalizedSelectedDate = new Date(selectedDate);
  normalizedSelectedDate.setHours(0, 0, 0, 0);
  const selectedDateString = formatDateLocal(normalizedSelectedDate);
  
  const selectedLogs = logs.filter(log => log.date === selectedDateString);

  // Calculate stats
  const today = new Date();

  const monthlyGoal = 15;
  const totalWorkoutsThisMonth = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate.getMonth() === selectedDate.getMonth() &&
      logDate.getFullYear() === selectedDate.getFullYear();
  }).length;

  const totalWorkoutsThisWeek = logs.filter(log => {
    const logDate = new Date(log.date);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return logDate >= weekAgo;
  }).length;

  const monthlyProgress = Math.round((totalWorkoutsThisMonth / monthlyGoal) * 100);
  const remainingForGoal = Math.max(monthlyGoal - totalWorkoutsThisMonth, 0);

  // Get motivational messages based on progress
  const getMotivationalMessage = () => {
    if (totalWorkoutsThisMonth >= monthlyGoal) return "Goal crushed! 🔥";
    if (remainingForGoal === 1) return "One more workout!";
    if (remainingForGoal <= 3) return "Almost there!";
    if (remainingForGoal <= 5) return "Keep pushing!";
    if (totalWorkoutsThisMonth >= 10) return "So close!";
    if (totalWorkoutsThisMonth >= 7) return "Great progress!";
    if (totalWorkoutsThisMonth >= 4) return "Building momentum!";
    if (totalWorkoutsThisMonth >= 1) return "Good start!";
    return "Start today!";
  };

  // Calendar helpers
  const days = eachDayOfInterval({
    start: startOfMonth(calendarMonth),
    end: endOfMonth(calendarMonth),
  });

  const monthStart = startOfMonth(calendarMonth);
  const startDayPadding = monthStart.getDay();

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const hasWorkout = (date: Date) => {
    return workoutDates.some(d => isSameDay(new Date(d), date));
  };

  const goToDate = (date: Date) => {
    setCalendarMonth(startOfMonth(date));
    // Normalize date to start of day to avoid timezone issues
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    setSelectedDate(normalized);
  };

  const getDayWorkoutType = (date: Date): WorkoutDayType | null => {
    return getWorkoutForDate(date);
  };

  // Use the hook's function to ensure consistency with Scheduler page
  const upcomingWorkouts = activeSchedule ? getUpcomingWorkouts(today) : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm lg:text-base">{format(selectedDate, 'MMMM yyyy')}</p>
            </div>
            <Button onClick={() => navigate('/templates')} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Log Workout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-20 md:pb-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          {/* Monthly Goal Card */}
          <Card className={`bg-gradient-to-br ${totalWorkoutsThisMonth >= monthlyGoal ? 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800' : 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800'}`}>
            <CardBody className="text-center">
              <div className={`inline-flex p-3 rounded-full mb-2 ${totalWorkoutsThisMonth >= monthlyGoal ? 'bg-green-500' : 'bg-blue-500'}`}>
                <Target className={`w-6 h-6 text-white`} />
              </div>
              <p className={`text-3xl font-bold ${totalWorkoutsThisMonth >= monthlyGoal ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>{totalWorkoutsThisMonth} / {monthlyGoal}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Goal</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{getMotivationalMessage()}</p>
            </CardBody>
          </Card>

          {/* This Week */}
          <Card>
            <CardBody className="text-center">
              <div className="inline-flex p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-2">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalWorkoutsThisWeek}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
            </CardBody>
          </Card>

          {/* Month Progress */}
          <Card>
            <CardBody className="text-center">
              <div className="inline-flex p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-2">
                <Trophy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{Math.min(monthlyProgress, 100)}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Goal Progress</p>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(monthlyProgress, 100)}%` }}
                />
              </div>
            </CardBody>
          </Card>

          {/* Remaining */}
          <Card>
            <CardBody className="text-center">
              <div className={`inline-flex p-3 ${remainingForGoal === 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-orange-100 dark:bg-orange-900/30'} rounded-full mb-2`}>
                <Dumbbell className={`w-6 h-6 ${remainingForGoal === 0 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`} />
              </div>
              <p className={`text-3xl font-bold ${remainingForGoal === 0 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>{remainingForGoal}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{remainingForGoal === 0 ? 'Done!' : 'To Go'}</p>
            </CardBody>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Calendar Section - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Calendar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Workout Calendar</h2>
                {activeSchedule && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Schedule: {activeSchedule.name}</span>
                  </div>
                )}
              </div>

              {/* Month navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCalendarMonth(subMonths(calendarMonth, 1))}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {format(calendarMonth, 'MMMM yyyy')}
                </h2>

                <button
                  onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Week day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(day => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid with color-coded workout types */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {/* Empty cells for padding */}
                {Array.from({ length: startDayPadding }).map((_, i) => (
                  <div key={`padding-${i}`} className="aspect-square" />
                ))}

                {/* Day cells */}
                {days.map(day => {
                  const isSelected = isSameDay(day, selectedDate);
                  const isTodayDate = isToday(day);
                  const hasWorkoutThisDay = hasWorkout(day);
                  const workoutType = getDayWorkoutType(day);
                  const colorInfo = workoutType ? getWorkoutColor(workoutType) : null;

                  // Get background style based on workout type
                  const getBackgroundStyle = () => {
                    if (isSelected) return 'bg-blue-600 text-white shadow-md';
                    if (workoutType && colorInfo) {
                      return 'text-white';
                    }
                    if (isTodayDate) return 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold';
                    return 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700';
                  };

                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => goToDate(day)}
                      className={`
                        aspect-square flex flex-col items-center justify-center rounded-lg text-sm font-medium transition-all relative
                        ${getBackgroundStyle()}
                        ${!isSameMonth(day, calendarMonth) ? 'text-gray-300 dark:text-gray-600' : ''}
                      `}
                      style={{
                        backgroundColor: workoutType && colorInfo && !isSelected ? colorInfo.hex : undefined,
                      }}
                    >
                      <span>{format(day, 'd')}</span>

                      {/* Workout indicator dot */}
                      {hasWorkoutThisDay && !workoutType && (
                        <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-white' : 'bg-blue-600 dark:bg-blue-400'}`} />
                      )}

                      {/* Small workout type label */}
                      {workoutType && !isSelected && (
                        <span className="text-[9px] mt-0.5 opacity-90">
                          {WORKOUT_DAY_LABELS[workoutType].substring(0, 3)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Calendar legend */}
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-3 text-xs">
                  {activeSchedule && (activeSchedule.pattern as WorkoutDayType[]).map((dayType) => {
                    const colorInfo = getWorkoutColor(dayType);
                    return (
                      <span key={dayType} className="flex items-center gap-1 text-gray-700 dark:text-white">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: colorInfo.hex }}
                        />
                        {WORKOUT_DAY_LABELS[dayType]}
                      </span>
                    );
                  })}
                </div>
                <button
                  onClick={() => goToDate(new Date())}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Today
                </button>
              </div>
            </div>

            {/* Upcoming Workouts */}
            {activeSchedule && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <CalendarClock className="w-5 h-5" />
                    Upcoming Schedule
                  </h2>
                  <Button size="sm" variant="ghost" onClick={() => navigate('/scheduler')}>
                    Edit
                  </Button>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {upcomingWorkouts.map(({ date, type }, index) => {
                    const colorInfo = type ? getWorkoutColor(type) : null;
                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg text-center ${type
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
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Selected Day's Workouts */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {format(selectedDate, 'MMM d')}
                </h2>
                {(() => {
                  const workoutType = getDayWorkoutType(selectedDate);
                  const colorInfo = workoutType ? getWorkoutColor(workoutType) : null;
                  return workoutType ? (
                    <span
                      className="text-xs px-2 py-1 rounded-full text-white"
                      style={{ backgroundColor: colorInfo?.hex }}
                    >
                      {WORKOUT_DAY_LABELS[workoutType]}
                    </span>
                  ) : null;
                })()}
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : selectedLogs.length > 0 ? (
                <div className="space-y-3">
                  {selectedLogs.map(log => (
                    <div
                      key={log.id}
                      onClick={() => navigate(`/history?log=${log.id}`)}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer active:scale-[0.98]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{log.template_name || 'Custom Workout'}</h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                          {log.exercise_logs.length} exercises
                        </span>
                      </div>
                      {log.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{log.notes}</p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {log.exercise_logs.slice(0, 3).map((el, i) => (
                          <span key={i} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                            {el.exercise_name}
                          </span>
                        ))}
                        {log.exercise_logs.length > 3 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                            +{log.exercise_logs.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Dumbbell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No workout logged</p>
                  <Button size="sm" onClick={() => navigate('/templates')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Log Workout
                  </Button>
                </div>
              )}
            </div>

            {/* No schedule prompt */}
            {!activeSchedule && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
                <CalendarClock className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Create a Schedule</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Plan your workout routine with customizable patterns
                </p>
                <Button size="sm" onClick={() => navigate('/scheduler')}>
                  Create Schedule
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
