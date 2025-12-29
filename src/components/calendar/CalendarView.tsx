import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  workoutDates: string[]; // Array of date strings that have workouts
}

export function CalendarView({ selectedDate, onDateSelect, workoutDates }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));

  useEffect(() => {
    setCurrentMonth(startOfMonth(selectedDate));
  }, [selectedDate]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const monthStart = startOfMonth(currentMonth);
  const startDayPadding = monthStart.getDay();

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const hasWorkout = (date: Date) => {
    return workoutDates.some(d => isSameDay(new Date(d), date));
  };

  const goToDate = (date: Date) => {
    setCurrentMonth(startOfMonth(date));
    onDateSelect(date);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>

        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
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

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for padding */}
        {Array.from({ length: startDayPadding }).map((_, i) => (
          <div key={`padding-${i}`} className="aspect-square" />
        ))}

        {/* Day cells */}
        {days.map(day => {
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);
          const hasWorkoutThisDay = hasWorkout(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => goToDate(day)}
              className={`
                aspect-square flex flex-col items-center justify-center rounded-lg text-sm font-medium transition-all relative
                ${isSelected
                  ? 'bg-blue-600 text-white shadow-md'
                  : isTodayDate
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
                ${!isSameMonth(day, currentMonth) ? 'text-gray-300 dark:text-gray-600' : ''}
              `}
            >
              <span>{format(day, 'd')}</span>

              {/* Workout indicator */}
              {hasWorkoutThisDay && (
                <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-white' : 'bg-blue-600 dark:bg-blue-400'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Go to today button */}
      <button
        onClick={() => goToDate(new Date())}
        className="mt-4 w-full py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors font-medium"
      >
        Today
      </button>
    </div>
  );
}
